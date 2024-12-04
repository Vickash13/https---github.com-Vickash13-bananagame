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
  const navigate = useNavigate();

  // Fetch a new trivia question
  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=1&type=multiple&category=18"
      ); // Category 18 = Computer Science
      if (response.status === 429) {
        console.error("Rate limit exceeded. Retrying in 5 seconds...");
        setTimeout(fetchQuestion, 5000);
        return;
      }
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("No questions available in the response.");
      }

      const trivia = data.results[0];
      setQuestion(trivia.question);
      const allAnswers = [...trivia.incorrect_answers, trivia.correct_answer].sort(
        () => Math.random() - 0.5
      );
      setAnswers(allAnswers);
      setCorrectAnswer(trivia.correct_answer);
      setUserAnswer(null);
      setFeedback("");
    } catch (error) {
      console.error("Error fetching trivia question:", error);
      setFeedback("Unable to load a question. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswer = (answer) => {
    setUserAnswer(answer);
    if (answer === correctAnswer) {
      setFeedback("🎉 Correct! Enjoy the next level!");
      setTimeout(() => {
        navigate("/level");
      }, 2000); // Delay navigation to let the user see feedback
    } else {
      setFeedback("🙁 Wrong answer. Try again!");
      setTimeout(() => fetchQuestion(), 2000); // Fetch a new question after feedback
    }
  };

  useEffect(() => {
    fetchQuestion();
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
        <h2 className="game-title">💻 Computer Trivia Game</h2>
        {loading ? (
          <p className="loading-text">Loading question...</p>
        ) : question ? (
          <>
            <p
              className="question-text"
              dangerouslySetInnerHTML={{ __html: question }}
            />
            <div className="answers-container">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  className="answer-button"
                  onClick={() => handleAnswer(answer)}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
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
