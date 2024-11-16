import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Game.css';

const Game = () => {
  const { difficulty, timer } = useParams();
  const [countdown, setCountdown] = useState(Number(timer));
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [lives, setLives] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const apiUrl = 'http://localhost:3000/api/banana';

  const fetchGameData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setGameData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGameOver(true);
          setResult(`Game Over! You answered ${correctAnswers} questions correctly.`);
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(interval);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleAnswer = async (selectedAnswer) => {
    if (isGameOver) return; // Disable further interaction after the game ends

    try {
      const response = await axios.post(`${apiUrl}/check`, { answer: selectedAnswer });
      if (response.data.isCorrect) {
        setCorrectAnswers((prev) => prev + 1); // Increment correct answers
        setResult('Correct Answer! Generating new question...');
        fetchGameData(); // Fetch a new question
      } else {
        setResult('Wrong Answer! Try again.');
        if (lives > 1) {
          setLives((prev) => prev - 1); // Decrease lives
        } else {
          setLives(0);
          clearInterval(intervalId); // Stop timer
          setIsGameOver(true);
          setResult(`Game Over! You answered ${correctAnswers} questions correctly.`);
        }
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      setResult('Error checking answer.');
    }
  };

  if (isLoading) return <div className="loading">Loading game data...</div>;

  return (
    <div className="game-container">
      <h3>{`Playing on ${difficulty} Difficulty`}</h3>

      <div className="timer-and-lives">
        <p className="timer">Time: {countdown}s</p>
        <div className="lives">
          {[...Array(lives)].map((_, index) => (
            <span key={index} className="heart">&#10084;</span>
          ))}
        </div>
      </div>

      <div className="question-container">
        <h3 className="question-text">Question:</h3>
        {gameData && <img className="question-img" src={gameData.question} alt="Game Question" />}
      </div>

      <div className="answer-buttons">
        {[...Array(10).keys()].map((num) => (
          <button
            key={num}
            className="circle-button"
            onClick={() => handleAnswer(num)}
            disabled={isGameOver} // Disable buttons if the game is over
          >
            {num}
          </button>
        ))}
      </div>

      {result && <p className="result">{result}</p>}

      {isGameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <p>{`You answered ${correctAnswers} questions correctly.`}</p>
          <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default Game;
