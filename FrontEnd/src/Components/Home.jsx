import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import backgroundImage from '../assets/log4.jpeg';
import monkeyImage from '../assets/monkey.png';

const Home = ({ audioRef }) => {
  const navigate = useNavigate();

  const startGame = () => {
    // Play the background music when the game starts
    audioRef.current.play();
    // Navigate to the trivia question page first
    navigate('/question');
  };

  const signOut = () => {
    // Clear authentication data from localStorage (or sessionStorage)
    localStorage.removeItem('user'); // Assuming 'user' is the key storing user data

    // Redirect to the login page after sign out
    navigate('/login');
  };

  return (
    <div className="home-container">
      <img src={backgroundImage} alt="Background" className="background-image" />
      <div className="title-container">
        <h2 className="game-title">Banana Game</h2>
      </div>
      <div className="character-container">
        <img src={monkeyImage} alt="Monkey" className="monkey-image" />
      </div>
      <p className="description-text"><b>Start the game now to collect bananas and reach new levels!</b></p>
      <div className="button-container">
        <button className="start-button" onClick={startGame}>Start Game</button>
        <button className="signout-button" onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default Home;
