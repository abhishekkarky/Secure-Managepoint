import React from 'react'
import { Link } from 'react-router-dom'

const LoggedInHeader = ({ user, openLogoutModal }) => {
    return (
        <>
            <header>
                <nav>
                    <input type="checkbox" id="check" />
                    <label htmlFor="check" className="checkbtn">
                        <i className="fas fa-bars"></i>
                    </label>
                    <label className="logo">
                        <Link to="/" className='list-group-item active' id='home'>
                            <img src="/assets/images/mp-logo.png" alt="Logo" />
                        </Link>
                    </label>
                    <ul>
                        <li>
                            <Link to="/subscriber" className="list-group-item" id="subscribers">
                                Subscribers
                            </Link>
                        </li>
                        <li>
                            <Link to="/broadcast" className="list-group-item" id="broadcast">
                                Broadcast
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="list-group-item" id="learn">
                                Learn
                            </Link>
                        </li>
                        <div className="dropdown">
                            <button className="dropbtn">
                                {user.fullName} <i className="fa-solid fa-caret-down"></i>
                            </button>
                            <div className="dropdown-content">
                                <Link to={`/editProfile/${user._id}`} className="list-group-item" id='editProfile'>
                                    Edit Profile
                                </Link>
                                <Link to={`/changePassword/${user._id}`} className="list-group-item" id='changePassword'>
                                    Change Password
                                </Link>
                                <Link to={`/help`} className="list-group-item" id='help'>
                                    Help?
                                </Link>
                                <button onClick={openLogoutModal} className="list-group-item logout">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default LoggedInHeader