import React from 'react';
import { Link } from 'react-router-dom';

const LoggedoutHeader = () => {
    return (
        <>
                <header className='h-36'>
                    <nav className='bg-transparent z-10'>
                        <input type="checkbox" id="check" />
                        <label htmlFor="check" className="checkbtn">
                            <i className="fas fa-bars"></i>
                        </label>
                        <label className="logo">
                            <Link className='flex items-center gap-x-5' to="/login">
                                <img src="/assets/images/mp-logo.png" alt="Logo" />
                                <h1 className='font-bold text-3xl pt-4 hidden md:block'>ManagePoint</h1>
                            </Link>
                        </label>
                        <ul>
                            <li>
                                <Link to="/login" className="list-group-item" id="login">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="list-group-item" id="register">
                                    Create an account
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                <p className='text-neutral-200 md:text-lg text-sm md:w-[80%] w-[90%] mx-auto md:px-4 px-1'>Best Creator Marketing Tool for Beginners</p>
        </>
    );
};

export default LoggedoutHeader