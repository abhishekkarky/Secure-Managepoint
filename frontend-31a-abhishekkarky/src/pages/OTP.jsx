import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../apis/api';

const OTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email') || '';
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [otpError, setOtpError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [cPasswordError, setCPasswordError] = useState('')

    const validate = () => {
        let isValid = true;

        setOtpError('');
        setPasswordError('');
        setCPasswordError('');

        if (otp.trim() === '') {
            setOtpError('OTP is required');
            isValid = false;
        } else if (otp.length !== 4) {
            setOtpError('OTP must be of 4 digits');
            isValid = false;
        }
        if (newPassword.trim() === '') {
            setPasswordError('Password is required');
            isValid = false;
        } else if (newPassword.length < 8 || newPassword.length > 15) {
            setPasswordError('Password must be between 8 and 15 characters');
            isValid = false;
        }
        if (confirmNewPassword.trim() === '') {
            setCPasswordError("Confirm password is required");
            isValid = false;
        } else if (confirmNewPassword.length < 8 || confirmNewPassword.length > 15) {
            setCPasswordError('Password must be between 8 and 15 characters');
            isValid = false;
        } else if (newPassword !== confirmNewPassword) {
            setCPasswordError('Password do not match');
            isValid = false;
        }
        return isValid;
    }


    const handleChangePassword = (e) => {
        e.preventDefault();

        const isValid = validate()
        if (!isValid) {
            return
        }

        console.log(email, otp, newPassword)
        const formData = new FormData();
        formData.append("email", email)
        formData.append("otp", otp)
        formData.append("newPassword", newPassword)

        resetPasswordApi(formData).then((res) => {
            if (res.data.success == false) {
                toast.error(res.data.message);
            } else {
                toast.success(res.data.message);
                navigate('/login')
            }
        }).catch((err) => {
            if (err.response && err.response.status === 403) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Something went wrong');
                console.log(err.message);
            }
        })
    };

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
                    <h2>Check your email 😄</h2>
                    <br />
                    <p>Please keep your password secure!</p>
                    <br />
                    <br />
                    <form>
                        <input type="email" placeholder="Enter email" value={email} hidden />
                        <label>OTP</label>
                        <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
                        {
                            otpError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{otpError}</p>
                        }
                        <br />
                        <label>New password</label>
                        <input type="password" placeholder="Enter new password" onChange={(e) => setNewPassword(e.target.value)} />
                        {
                            passwordError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{passwordError}</p>
                        }
                        <br />
                        <label>Confirm new password</label>
                        <input type="password" placeholder="Confirm new password" onChange={(e) => setConfirmNewPassword(e.target.value)} />
                        {
                            cPasswordError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{cPasswordError}</p>
                        }
                        <br />
                        <br />
                        <button className="login-button" type="submit" onClick={handleChangePassword}>Change</button>
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
    );
};

export default OTP;
