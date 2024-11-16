import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to hold error message
    const [loading, setLoading] = useState(false); // State to handle loading
    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!email || !password) {
            setError('Please fill in both fields');
            return;
        }

        setLoading(true);  // Set loading to true while waiting for response
        setError('');  // Reset error before making request

        Axios.post('http://localhost:3000/auth/login', { email, password })
            .then(response => {
                setLoading(false);
                if (response.data.status) {
                    navigate('/home');
                } else {
                    setError('Incorrect email or password. Please try again.');
                }
            })
            .catch(err => {
                setLoading(false);
                setError('An error occurred. Please try again later.');
                console.log(err);
            });
    };

    return (
        <div className="sign-up-container">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {/* Email Input */}
                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    autoComplete="off" 
                    placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                />

                {/* Password Input */}
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    placeholder="******" 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password}
                />

                {/* Show loading or error messages */}
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Submit Button */}
                <button type="submit" disabled={loading}>
                    Login
                </button>

                {/* Links for forgot password and signup */}
                <Link to="/forgotPassword" className="forgot-password-link"><b>Forgot Password?</b></Link>
                <p>Don't Have an account? <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;
