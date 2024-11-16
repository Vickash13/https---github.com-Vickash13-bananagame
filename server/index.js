import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import { UserRouter } from './routes/user.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));
app.use(cookieParser());
app.use('/auth', UserRouter);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/authentication')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Store game data temporarily
let currentGameData = null;

// Route to fetch game data from the Banana API
app.get('/api/banana', async (req, res) => {
  try {
    const response = await axios.get('https://marcconrad.com/uob/banana/api.php?out=json');
    console.log('Banana API Response:', response.data);
    currentGameData = response.data; // Cache the game data
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ message: 'Error fetching game data' });
  }
});

// Route to verify the user's answer
app.post('/api/banana/check', (req, res) => {
  const { answer } = req.body;

  if (!currentGameData) {
    return res.status(400).json({ message: 'Game data not loaded. Please start the game first.' });
  }

  // Compare the answer with the correct solution in `currentGameData`
  const isCorrect = answer == currentGameData.solution; // Using '==' for loose comparison
  res.json({ isCorrect });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
