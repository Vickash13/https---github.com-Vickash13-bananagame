import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./Score.css"; // Ensure you have this file in the same directory

const Score = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { difficulty, score, username } = location.state || {}; // Get passed data

  // Define score categories
  const scoreCategory =
    score > 80 ? "Excellent" : score > 50 ? "Good" : "Needs Improvement";

  // States for animation
  const [showConfetti, setShowConfetti] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(0);

  useEffect(() => {
    setShowConfetti(true);
    const animationInterval = setInterval(() => {
      setScoreAnimation((prev) => (prev < score ? prev + 1 : score));
    }, 20);

    const confettiTimeout = setTimeout(() => {
      setShowConfetti(false); // Stop confetti after 3 seconds
    }, 3000);

    return () => {
      clearTimeout(confettiTimeout);
      clearInterval(animationInterval);
    };
  }, [score]);

  return (
    <div className="score">
      {/* Confetti animation */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Game Over Text */}
      <h4 className="game-over-text">Game Over</h4>

      {/* Score Category Badge */}
      <div className="score-category">
        <span className={`score-badge-${scoreCategory.toLowerCase().replace(" ", "-")}`}>
          {scoreCategory}
        </span>
      </div>

      {/* Animated Score Display */}
      <div className="score-display">
        <div className="score-number">
          Your Score = <span>{scoreAnimation}</span>
        </div>
      </div>

      {/* Progress Circle (Animated) */}
      <div className="score-circle">
        <svg className="circle" width="150" height="150">
          <circle cx="75" cy="75" r="70" stroke="#f1f1f1" strokeWidth="10" fill="none" />
          <circle
            cx="75"
            cy="75"
            r="70"
            stroke={score > 80 ? "#4CAF50" : score > 50 ? "#FF9800" : "#F44336"}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${score * 4.4}, 440`}
            strokeLinecap="round"
            transform="rotate(-90, 75, 75)"
          />
        </svg>
      </div>

      {/* Button Container */}
      <div className="score-action-buttons">
        <button className="main-menu-button" onClick={() => navigate("/home")}>
          Main Menu
        </button>
        <button className="retry-button" onClick={() => navigate("/level")}>
          Retry
        </button>
        <button className="leaderboard-button" onClick={() => navigate("/leaderboard")}>
          Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Score;
