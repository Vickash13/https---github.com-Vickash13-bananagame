import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Game.css';

const Game = () => {
  const { difficulty, timer } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(Number(timer));
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [lives, setLives] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const apiUrl = 'http://localhost:3000/api/banana'; // Keep the game data API URL

  const fetchGameData = async () => {
    try {
      const response = await axios.get(apiUrl);
      console.log('Fetched game data:', response.data);
      setGameData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setIsLoading(false);
    }
  };

  const saveScore = async () => {
    const userData = JSON.parse(localStorage.getItem('user')) || { username: 'Guest' };
    const payload = { username: userData.username, score: correctAnswers };

    try {
      const response = await axios.post('http://localhost:3000/api/save-score', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        console.log('Score updated:', response.data);
      } else {
        console.error('Failed to update score:', response.data);
      }
    } catch (error) {
      console.error('Error saving score:', error.message, error.response?.data);
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
  }, [difficulty, navigate]);

  useEffect(() => {
    if (isGameOver) {
      saveScore(); // Save the score to the database
      const userData = JSON.parse(localStorage.getItem('user')) || { username: 'Guest' };
      navigate('/score', {
        state: {
          user: userData.username,
          difficulty,
          score: correctAnswers,
        },
      });
    }
  }, [isGameOver, correctAnswers, difficulty, navigate]);

  const handleAnswer = async (selectedAnswer) => {
    if (isGameOver) return;

    try {
      const response = await axios.post(`${apiUrl}/check`, { answer: selectedAnswer });

      if (response.data.isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        setResult('Correct Answer! Generating new question...');
        fetchGameData(); // Fetch a new question
      } else {
        setResult('Wrong Answer! Try again.');
        if (lives > 1) {
          setLives((prev) => prev - 1);
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

  const generateAnswers = (solution) => {
    const answers = Array.from({ length: 10 }, (_, i) => i);
    if (!answers.includes(solution)) {
      answers[0] = solution; // Ensure the correct answer is included
    }
    return answers;
  };

  const answers = gameData ? generateAnswers(gameData.solution) : [];

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
        {answers.length > 0 ? (
          answers.map((answer, index) => (
            <button
              key={index}
              className="circle-button"
              onClick={() => handleAnswer(answer)}
              disabled={isGameOver}
            >
              {answer}
            </button>
          ))
        ) : (
          <div>Answers are still loading...</div>
        )}
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
