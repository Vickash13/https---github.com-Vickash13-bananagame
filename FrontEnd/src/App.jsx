import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useRef } from 'react';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import Home from './Components/Home';
import ResetPassword from './Components/ResetPassword';
import Level from './Components/Level';
import Game from './Components/Game';
import backgroundMusic from './assets/background-music.mp3'; // Import the music file
import Score from './Components/Score'

function App() {
  const audioRef = useRef(null); // Create a reference to control the audio

  return (
    <BrowserRouter>
      {/* Audio element placed at the root level */}
      <audio ref={audioRef} src={backgroundMusic} preload="auto" loop />
      
      <Routes>
        {/* Redirect root URL to Login */}
        <Route path='/' element={<Navigate to="/login" />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path='/home' element={<Home audioRef={audioRef} />} />
        <Route path='/level' element={<Level />} />
        <Route path='/game/:difficulty/:timer' element={<Game />} />
        <Route path="/score" element={<Score />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
