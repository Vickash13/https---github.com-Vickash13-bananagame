import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';
import backgroundImage from '../assets/log4.jpeg';  // Adjust the path if necessary

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/leaderboard');
        setLeaderboard(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div
      className="leaderboard-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <h2 className="leaderboard-title">Leaderboard</h2>
      {isLoading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user._id} className={`rank-${index + 1}`}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="leaderboard-action-buttons">
        <button className="go-home-button" onClick={goToHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
