import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./Score.css"; // Ensure this import is correct

const Score = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { difficulty, score } = location.state || {}; // Get passed data

  // Define score categories
  const scoreCategory =
    score > 80 ? "Excellent" : score > 50 ? "Good" : "Needs Improvement";

  // States for animation
  const [showConfetti, setShowConfetti] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(0);

  useEffect(() => {
    setShowConfetti(true);
    setScoreAnimation(score); // Start the score animation
    const timer = setTimeout(() => {
      setShowConfetti(false); // Stop confetti after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [score]);

  return (
    <div className="score"> {/* This class is defined in your CSS file */}
      {/* Confetti animation */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Game Over Text */}
      <h4 className="game-over-text">Game Over</h4>

      {/* Score Category Badge */}
      <div className="score-category">
        <span className={`score-badge-${scoreCategory.toLowerCase().replace(' ', '-')}`}>
          {scoreCategory}
        </span>
      </div>

      {/* Animated Score Display */}
      <div className="score-display">
        <div className="score-number">
          <span>{scoreAnimation}</span>
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
            strokeDasharray={`${score * 0.44}, 440`} // Score-based animation
            strokeLinecap="round"
            transform="rotate(-90, 75, 75)"
          />
        </svg>
      </div>

      {/* Unique Button Container */}
      <div className="score-action-buttons">
        <button className="banana-main-menu-button" onClick={() => navigate("/home")}>
          Go to Main Menu
        </button>
        <button className="banana-retry-button" onClick={() => navigate("/level")}>
          Try Another Round
        </button>
      </div>
    </div>
  );
};

export default Score; // Make sure to export your component correctly
