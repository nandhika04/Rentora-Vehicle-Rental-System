import React, { useState } from 'react';
import './RegistrationForm.css';
import AddBike from './components/AddBike';
import axios from 'axios';
import AdminPage from './AdminPage';
import { useNavigate } from 'react-router-dom';


const RegistrationForm = () => {
  
  const back = process.env.REACT_APP_BACKEND_URL;

  const navigate = useNavigate();

  const [username,setUserName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');

  const [error, setError] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("Please enter the Username.");
      return;
    }

    if (!email) {
      setError("Please enter a valid Email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    if (!confirmPassword) {
      setError("Please enter the Confirm Password.");
      return;
    }

    setError("");

    // Registration API call
    try {
      const response = await axios.post(`${back}/register`, {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (email === "admin@gmail.com" && password === "admin123") {
        console.log("It's Admin");
        navigate("/admin"); // Use navigate to route to AdminPage
      } else {
        if (response.data) {
          navigate("/"); // Navigate to home page
          console.log("Created an account...");
        }
      }
    } catch (error) {
      // Handle registration error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      {isSubmitted ? (
        <AddBike />
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Registration Form</h2>

          {/* {apiError && <div className="error-message api-error">{apiError}</div>} */}

          <label htmlFor="username">User Name</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter User Name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the password"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter Confirm password"
          />
          {error && <div className="error-message">{error}</div>}

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;