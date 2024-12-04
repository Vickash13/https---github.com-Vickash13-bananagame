import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import { UserRouter } from './routes/user.js';
import { User } from './models/User.js';  // Import User model

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"], // Adjust to your frontend's URL
  credentials: true,
}));
app.use(cookieParser());
app.use('/auth', UserRouter);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Store game data temporarily
let currentGameData = null;

// Route to fetch game data from the Banana API
app.get('/api/banana', async (req, res) => {
  try {
    const response = await axios.get('https://marcconrad.com/uob/banana/api.php?out=json');
    console.log('Fetched game data:', response.data);
    currentGameData = response.data; // Cache the game data
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching game data from Banana API:', error.message);
    res.status(500).json({ message: 'Error fetching game data' });
  }
});

// Route to verify the user's answer
app.post('/api/banana/check', (req, res) => {
  const { answer } = req.body;

  if (!currentGameData) {
    console.error('Game data not loaded yet.');
    return res.status(400).json({ message: 'Game data not loaded. Please start the game first.' });
  }

  // Compare the answer with the correct solution in `currentGameData`
  const isCorrect = answer == currentGameData.solution; // Using '==' for loose comparison
  res.json({ isCorrect });
});

// POST route to save score without updating existing scores
app.post('/api/save-score', async (req, res) => {
  const { username, score } = req.body;

  if (!username || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid username or score' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      // If user doesn't exist, create a new user
      const newUser = new User({
        username,
        score,
      });
      await newUser.save();
      return res.status(201).json({ message: 'User created and score saved' });
    }

    // Update score for existing user
    user.score = score;
    await user.save();
    return res.json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Error saving score:', error);  // Log the error to console
    res.status(500).json({ message: 'Error saving score', error: error.message });  // Send error details back
  }
});
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ score: -1 }) // Sort by score in descending order
      .limit(10); // Optional: Limit to top 10 users
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
