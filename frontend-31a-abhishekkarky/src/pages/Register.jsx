import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { createUserApi } from '../apis/api'
import '../styles/Login.css'
import DOMPurify from 'dompurify';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullNameError, setFullNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const validate = () => {
        let isValid = true

        setFullNameError('')
        setEmailError('')
        setPasswordError('')

        if (fullName.trim() === '') {
            setFullNameError('Fullname is required')
            isValid = false
        }
        if (email.trim() === '') {
            setEmailError('Email is required')
            isValid = false
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Please provide valid email address');
            isValid = false;
        }
        if (password.trim() === '') {
            setPasswordError('Password is required')
            isValid = false
        } else if (password.length < 8 || password.length > 15) {
            setPasswordError('Password must be between 8 and 15 characters');
            isValid = false;
        }
        return isValid
    }

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = validate()
        if (!isValid) {
            return
        }

        const data = {
            fullName: fullName,
            email: email,
            password: password,
        };

        // Making API call
        createUserApi(data)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    navigate('/login')
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 403) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error('Something went wrong');
                    console.log(err.message);
                }
            });
    };

    return (
        <>
            <br />
            <main className="login-main">
                <div className="login-main-left">
                    <Link to={"/"} className="logo-section">
                        <div className="circular-logo">
                            <img src="../assets/images/mp-logo.png" alt="" />
                        </div>
                        <h3>ManagePoint</h3>
                    </Link>
                    <br />
                    <br />
                    <h2>Create an account  🤝</h2>
                    <br />
                    <p>Kindly fill all details to register your account.</p>
                    <br />
                    <br />
                    <form action="">
                        <label>Full Name</label>
                        <input onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Jennifer Lawrence" />
                        {
                            fullNameError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{fullNameError}</p>
                        }
                        <br />
                        <label>Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="jenniferlawrence@gmail.com" />
                        {
                            emailError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{emailError}</p>
                        }
                        <br />
                        <label>Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="**********" />
                        {
                            passwordError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{passwordError}</p>
                        }
                        <br />
                        <br />
                        <button onClick={handleSubmit} className="login-button" type="submit">Signup</button>
                        <div className="row-content">
                            <Link to="/resetpassword">Forgot Password?</Link>
                            <Link to="/login">Already have an account?</Link>
                        </div>
                        <br />
                        <div className="seperator">
                            <div className="line"></div>
                            <span>or</span>
                            <div className="line"></div>
                        </div>
                        <button className="google-login-button">
                            <img src="../assets/images/google.png" alt="Google Icon" className="google-icon" />
                            Register with Google
                        </button>
                    </form>
                </div>
                <div className="login-main-right">
                    <img src="../assets/images/auth-img.png" alt="" />
                </div>
            </main>
        </>
    )
}

export default Register