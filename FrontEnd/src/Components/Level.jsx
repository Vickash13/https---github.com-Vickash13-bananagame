import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Level.css';

// Import the background image
import backgroundImage from '../assets/log1.jpeg'; 

const Level = () => {
  const navigate = useNavigate();

  // Function to handle level selection
  const handleLevelClick = (difficulty, timer) => {
    navigate(`/game/${difficulty}/${timer}`);
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('user'); // Clear authentication data
    navigate('/login'); // Redirect to login page
  };

  // Inline style for the background image
  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    textAlign: 'center',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <h1>Select Game Difficulty</h1>
      {/* Button container */}
      <div className="button-container">
        <button onClick={() => handleLevelClick('Easy', 90)} className="level-button easy">
          Easy
        </button>
        <button onClick={() => handleLevelClick('Normal', 60)} className="level-button normal">
          Normal
        </button>
        <button onClick={() => handleLevelClick('Hard', 30)} className="level-button hard">
          Hard
        </button>
        <button onClick={signOut} className="sign-out-button">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Level;
