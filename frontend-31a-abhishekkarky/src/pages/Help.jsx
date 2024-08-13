import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Help = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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

    const [faqData, setFaqData] = useState([
        {
            question: 'How can I add subscribers in group?',
            answer: "After logging in to your account, you will be redirected to the dashboard where you can view analytics and find buttons on the right side of the page. Click on the 'Add Subscribers' button, and you will be redirected to a new page. On this page, look for the option to 'Import Subscribers from CSV' and click on it. Upload the CSV file containing your subscribers' details, then submit. You are now good to go!",
            expanded: false,
        },
        {
            question: 'How can I make group of subscribers to send Broadcast?',
            answer: "On the Subscribers page, you will find a 'Tags' and 'Segments' section. Click on the link provided below the text to go to the respective page. You will be redirected to the 'Add Tags' or 'Add Segments' page. Create groups and add subscribers according to your needs. You are now good to go!",
            expanded: false,
        },
        {
            question: 'Can I send Broadcast to multiple subscribers at once?',
            answer: "Yes, on Managepoint, you can send a broadcast to multiple recipients by navigating to the broadcast page. Click on 'New Broadcast,' then fill out the form according to your needs. You can choose the recipients by tags, segments, individual subscribers, or all subscribers. Finally, click the 'Send' button at the bottom of the form. You are now good to go!",
            expanded: false,
        },
        {
            question: 'Can I save my Subscribers detail on my local storage by any means?',
            answer: "Yes, on Managepoint, you can save all your subscriber details on a local computer or any device you are using by navigating to the subscribers' page. At the bottom of the page, where you can see 'Export Subscribers in CSV,' click that button and download. You are now good to go!",
            expanded: false,
        },
    ]);

    const toggleAccordion = (index) => {
        setFaqData((prevFaqData) => {
            return prevFaqData.map((faq, i) => {
                if (i === index) {
                    return { ...faq, expanded: !faq.expanded };
                } else {
                    return { ...faq, expanded: false };
                }
            });
        });
    };


    return (
        <>
            <Navbar />
            <main className="profile-main">
                <div className="side-bar-user">
                    <Link to={`/editProfile/${user._id}`}><i className="fa-solid fa-user"></i> Account Details</Link>
                    <Link to={`/changePassword/${user._id}`}><i className="fa-solid fa-user"></i> Change Password</Link>
                    <Link className='active' to={'/help'}><i className="fa-solid fa-circle-info"></i> Help?</Link>
                    <button onClick={openLogoutModal}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                </div>
                <div className="profile-main-right">
                    <h1 className='text-2xl'>Help?</h1>
                    <hr className='mt-2' />
                    <div className="p-1">
                        <p className='text-md font-md mt-1'>FAQs</p>
                        <section class="bg-white text-black">
                            <div class="container max-w-4xl px-1 py-5 mx-auto">
                                <div className="space-y-4">
                                    {faqData.map((faq, index) => (
                                        <div key={index} className="border-2 border-neutral-200 rounded-md ">
                                            <button
                                                onClick={() => toggleAccordion(index)}
                                                className="flex items-center justify-between !w-full px-2 !mt-0 !border-white !shadow-none !transition-none !transform-none !h-10"
                                            >
                                                <h1 className="font-semibold text-neutral-800">{faq.question}</h1>
                                                <span className="text-black bg-gray-200 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transform ${faq.expanded ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                            {faq.expanded && <hr className="border-gray-200" />}
                                            {faq.expanded && (
                                                <p className="py-4 px-2 text-md text-neutral-700">
                                                    {faq.answer}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
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
    )
}

export default Help