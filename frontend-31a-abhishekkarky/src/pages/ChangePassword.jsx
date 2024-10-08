import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { editUserPassword } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const ChangePassword = () => {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Cleanup and reset form fields when component unmounts
    useEffect(() => {
        return () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        };
    }, []);

    const sanitizeInput = (input) => {
        // Simple sanitation example: remove any HTML tags from input
        return input.replace(/<\/?[^>]+(>|$)/g, "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sanitize user inputs
        const sanitizedCurrentPassword = sanitizeInput(currentPassword);
        const sanitizedNewPassword = sanitizeInput(newPassword);
        const sanitizedConfirmNewPassword = sanitizeInput(confirmNewPassword);

        if (sanitizedNewPassword !== sanitizedConfirmNewPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('currentPassword', sanitizedCurrentPassword);
            formData.append('newPassword', sanitizedNewPassword);

            const response = await editUserPassword(id, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/profile'); // Redirect to profile or another appropriate page
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            if (err.response && err.response.status === 403) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Something went wrong');
                console.error(err.message);
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        toast('See you soon! Bye', {
            icon: '👋',
        });
    };

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <main className="profile-main">
                <div className="side-bar-user">
                    <Link to={`/editProfile/${user._id}`}>
                        <i className="fa-solid fa-user"></i> Account Details
                    </Link>
                    <Link className='active' to={`/changePassword/${user._id}`}>
                        <i className="fa-solid fa-user"></i> Change Password
                    </Link>
                    <Link to={'/help'}>
                        <i className="fa-solid fa-circle-info"></i> Help?
                    </Link>
                    <button onClick={openLogoutModal}>
                        <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </div>
                <form className="profile-main-right" onSubmit={handleSubmit}>
                    <h1 className='text-3xl'>Change Password</h1>
                    <br />
                    <label>Current Password</label>
                    <input
                        type="password"
                        placeholder='Enter your current password'
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder='Enter your new password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        placeholder='Confirm your new password'
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <button type="submit">Change Password</button>
                </form>
            </main>
            {isLogoutModalOpen && (
                <div className="modal-container">
                    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-90 transition-opacity"></div>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                </svg>
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Logout?</h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => {
                                                handleLogout();
                                                closeLogoutModal();
                                            }}
                                        >
                                            Logout
                                        </button>
                                        <button type="button" onClick={closeLogoutModal} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default ChangePassword;
