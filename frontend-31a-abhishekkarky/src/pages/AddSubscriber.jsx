import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { createSubscriberApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const AddSubscriber = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();

    const validate = () => {
        let isValid = true;

        setFullNameError('');
        setEmailError('');

        if (fullName.trim() === '') {
            setFullNameError("Subscriber's name is required");
            isValid = false;
        }

        if (email.trim() === '') {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = validate();
        if (!isValid) {
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName.trim()); // Trimmed for sanitation
        formData.append("email", email.trim()); // Trimmed for sanitation

        // Making API call
        createSubscriberApi(formData)
            .then((res) => {
                if (!res.data.success) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    navigate('/subscriber');
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 403) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error('Something went wrong');
                    console.error(err.message);
                }
            });
    };

    useEffect(() => {
        // Highlight the active page in the sidebar
        const listGroupItem = Array.from(document.getElementsByClassName("list-group-item"));
        listGroupItem.forEach(i => i.classList.remove("active"));
        const activeID = document.getElementById('subscribers');
        if (activeID) activeID.classList.add("active");
    }, []);

    return (
        <>
            <Navbar />
            <main className="profile-main">
                <div className="side-bar-user">
                    <Link className='active' to='/addSubscriber'><i className="fa-solid fa-plus"></i> Add Subscriber</Link>
                    <Link to='/addSubscriber/CSV'><i className="fa-solid fa-file"></i> Import from CSV</Link>
                    <Link to='/editSubscriber'><i className="fa-solid fa-gear"></i> Manage Subscribers</Link>
                </div>
                <form className="profile-main-right" onSubmit={handleSubmit}>
                    <h1 className='text-3xl'>Add Subscriber</h1>
                    <hr />
                    <br />
                    <label>Subscriber's Name</label>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type="text"
                        placeholder='Enter Fullname'
                    />
                    {fullNameError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{fullNameError}</p>}
                    <label>Subscriber's Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder='Enter Email-address'
                    />
                    {emailError && <p className='mt-2 text-[12px]' style={{ color: "#dc3545" }}>{emailError}</p>}
                    <button type="submit">Save Changes</button>
                </form>
            </main>
            <Footer />
        </>
    );
}

export default AddSubscriber;