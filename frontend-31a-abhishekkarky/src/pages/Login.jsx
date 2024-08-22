import DOMPurify from 'dompurify';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { loginUserApi } from '../apis/api';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');

    if (email.trim() === '') {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please provide a valid email address');
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8 || password.length > 15) {
      setPasswordError('Password must be between 8 and 15 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return;
    }

    // Sanitize user input to prevent XSS
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);

    try {
      const response = await loginUserApi({ email: sanitizedEmail, password: sanitizedPassword });

      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.replace("/");
        toast.success('Welcome!', {
          icon: '😃',
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.error('Access forbidden: ' + (err.response.data.message || 'You do not have permission.'));
      } else {
        toast.error('Something went wrong: ' + (err.message || 'Please try again later.'));
        console.error(err);
      }
    }
  };

  return (
    <>
      <br />
      <main className="login-main">
        <div className="login-main-left">
          <Link to="/" className="logo-section">
            <div className="circular-logo">
              <img src="../assets/images/mp-logo.png" alt="ManagePoint Logo" />
            </div>
            <h3>ManagePoint</h3>
          </Link>
          <br />
          <br />
          <br />
          <h2>Welcome Back 😁</h2>
          <br />
          <p>We are happy to have you back</p>
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jenniferlawrence@gmail.com"
              required
            />
            {emailError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{emailError}</p>}
            <br />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
              required
            />
            {passwordError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{passwordError}</p>}
            <br />
            <br />
            <button type="submit" className="login-button">Login</button>
            <div className="row-content">
              <Link to="/resetpassword">Forgot Password?</Link>
              <Link to="/register">Don't have an account?</Link>
            </div>
            <br />
            <div className="seperator">
              <div className="line"></div>
              <span>or</span>
              <div className="line"></div>
            </div>
            <button className="google-login-button">
              <img src="../assets/images/google.png" alt="Google Icon" className="google-icon" />
              Login with Google
            </button>
          </form>
          <br />
          <br />
        </div>
        <div className="login-main-right">
          <img src="../assets/images/auth-img.png" alt="Authentication Visual" />
        </div>
      </main>
    </>
  );
};

export default Login;
