import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Question.css";
import backgroundImage from "../assets/log2.jpeg"; // Replace with your background image path

const TriviaGame = () => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added to track error
  const navigate = useNavigate();

  const fetchQuestion = async (attempt = 1) => {
    setLoading(true);
    setError(null); // Reset error on every fetch attempt
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=1&category=19&difficulty=medium&type=multiple"
      );

      // Check if the response status is 429 (Rate limit exceeded)
      if (response.status === 429 && attempt <= 5) {
        // Exponential backoff: Wait before retrying
        const waitTime = Math.pow(2, attempt) * 1000; // Exponentially increasing delay
        setError(`Too many requests. Retrying in ${waitTime / 1000} seconds...`);
        setTimeout(() => fetchQuestion(attempt + 1), waitTime); // Retry after delay
        return;
      }

      const data = await response.json();

      // Check if data is defined and contains results
      if (data && data.results && data.results.length > 0) {
        const trivia = data.results[0];
        setQuestion(trivia.question);
        const allAnswers = [
          ...trivia.incorrect_answers,
          trivia.correct_answer,
        ].sort(() => Math.random() - 0.5);
        setAnswers(allAnswers);
        setCorrectAnswer(trivia.correct_answer);
        setUserAnswer(null);
        setFeedback("");
      } else {
        setError("No questions available. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching trivia question:", error);
      setError("Unable to load a question. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswer(answer);
    if (answer === correctAnswer) {
      setFeedback("🎉 Correct! Enjoy the next level!");
      setTimeout(() => {
        navigate("/level");
      }, 2000);
    } else {
      setFeedback("🙁 Wrong answer. Try again!");
      setTimeout(() => fetchQuestion(), 2000); // Fetch a new question on wrong answer
    }
  };

  useEffect(() => {
    fetchQuestion(); // Only fetch one question initially
  }, []);

  return (
    <div
      className="trivia-game-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="trivia-card">
        <h4 className="game-tit">🧮 Math IQ Game</h4>
        {loading ? (
          <p className="loading-text">Loading question...</p>
        ) : error ? (
          <p className="error-text">{error}</p> // Display error message
        ) : question ? (
          <>
            <p className="question-text">{question}</p>
            <div className="answers-container">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  className="answer-button"
                  onClick={() => handleAnswer(answer)}
                >
                  {answer}
                </button>
              ))}
            </div>
            {feedback && <p className="feedback-text">{feedback}</p>}
          </>
        ) : (
          <p className="error-text">Unable to load a question. Try refreshing.</p>
        )}
      </div>
    </div>
  );
};

export default TriviaGame;
