import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import Home from './Components/Home';
import ResetPassword from './Components/ResetPassword';
import Level from './Components/Level';
import Game from './Components/Game';
import Score from './Components/Score';
import Leaderboard from './Components/Leaderboard';
import Question from './Components/Question'; // Import the Question component
import backgroundMusic from './assets/background-music.mp3';

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.warn('Auto-play failed: ', error);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Audio element placed at the root level */}
      <audio ref={audioRef} src={backgroundMusic} preload="auto" loop />
      
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path='/home' element={<Home audioRef={audioRef} />} />
        <Route path='/level' element={<Level />} />
        <Route path='/question' element={<Question />} /> {/* New route for trivia */}
        <Route path='/game/:difficulty/:timer' element={<Game />} />
        <Route path="/score" element={<Score />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
