import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!username || !email || !password) {
            setErrorMessage("All fields are required!");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        Axios.post('http://localhost:3000/auth/signup', {
            username,
            email,
            password,
        })
        .then((response) => {
            setIsLoading(false);
            if (response.data.status) {
                // Save user data to localStorage after successful signup
                const userData = {
                    username: username,  // Username from the form
                    email: email,        // You could also store the email if needed
                };
                localStorage.setItem('user', JSON.stringify(userData)); // Store in localStorage

                // Log the stored data to verify
                console.log("User data saved to localStorage:", userData);

                navigate('/login');
            } else {
                setErrorMessage("Signup failed. Please try again.");
            }
        })
        .catch((err) => {
            setIsLoading(false);
            setErrorMessage("Server error. Please try again later.");
            console.error(err);
        });
    };

    return (
        <div className="sign-up-container">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <label htmlFor="username">Username:</label>
                <input 
                    type="text" 
                    id="username" 
                    placeholder="Username" 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />

                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
