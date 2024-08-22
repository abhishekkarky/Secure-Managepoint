import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { sendOTPApi } from '../apis/api'
import '../styles/Login.css'

const DOMPurify = require('dompurify')

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const validate = () => {
        let isValid = true

        setEmailError('')

        if (email.trim() === '') {
            setEmailError('Email is required')
            isValid = false
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Please provide valid email address');
            isValid = false;
        }
        return isValid
    }

    const handleSubmitOTP = (e) => {
        e.preventDefault();

        const isValid = validate()
        if (!isValid) {
            return
        }

        const loadingToast = toast.loading("Sending OTP...")
        const formData = new FormData();
        formData.append("email", email);
        sendOTPApi(formData).then((res) => {
            if (res.data.success == false) {
                toast.error(res.data.message);
            } else {
                toast.dismiss(loadingToast)
                toast.success(res.data.message);
                navigate(`/otp?email=${email}`)
            }
        }).catch((err) => {
            if (err.response && err.response.status === 403) {
                toast.dismiss(loadingToast)
                toast.error(err.response.data.message);
            } else {
                toast.error('Something went wrong');
                console.log(err.message);
            }
        })
    }
    return (
        <>
            <br />
            <main className="login-main">
                <div className="login-main-left">
                    <div className="logo-section">
                        <div className="circular-logo">
                            <img src="../assets/images/mp-logo.png" alt="" />
                        </div>
                        <h3>ManagePoint</h3>
                    </div>
                    <br />
                    <br />
                    <br />
                    <h2>Forgot your password 😭</h2>
                    <br />
                    <p>Don't worry we got you covered !</p>
                    <br />
                    <br />
                    <form action="">
                        <label>Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="jenniferlawrence@gmail.com" />
                        {
                            emailError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{emailError}</p>
                        }
                        <br />
                        <br />
                        <button className="login-button" type="submit" onClick={handleSubmitOTP}>Send OTP</button>
                        <div className="row-content">
                            <Link to="/login">Remember your password?</Link>
                        </div>
                    </form>
                    <br />
                    <br />
                </div>
                <div className="login-main-right">
                    <img src="../assets/images/auth-img.png" alt="" />
                </div>
            </main>
        </>
    )
}

export default ResetPassword