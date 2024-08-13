import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGrowthRate, totalBroadcastCountApi, totalSubscriberCountApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import ApexChart from './Chart';

const Dashboard = () => {
    const [totalsubscriberCount, setTotalSubscriberCount] = useState(0);
    const [totalBroadcastCount, setTotalBroadcastCount] = useState(0);
    const [growthRate, setGrowthRate] = useState(0)

    useEffect(() => {
        totalSubscriberCountApi()
            .then((res) => {
                setTotalSubscriberCount(res.data.count);
            })
            .catch((error) => {
                console.error("Error fetching total subscriber count:", error);
            });

        totalBroadcastCountApi()
            .then((res) => {
                setTotalBroadcastCount(res.data.count);
            })
            .catch((error) => {
                console.error("Error fetching total broadcast count:", error);
            });

        getGrowthRate().then((res) => {
            setGrowthRate(res.data.growthRate)
        })
    }, [])

    return (
        <>
            <Navbar />
            <main className="home-main">
                <div className="home-main-top">
                    <h1 className='text-4xl font-bold'>
                        Channel Analytics
                    </h1>
                    <div className="main-top-card">
                        <div className="cards">
                            <div className="cards-icon">
                                <img src="../assets/images/totalEmail.png" alt="" />
                            </div>
                            <br />
                            <div className="cards-content">
                                <p>Total Emails</p>
                                <p>{totalBroadcastCount}</p>
                            </div>
                        </div>
                        <div className="cards">
                            <div className="cards-icon">
                                <img src="../assets/images/subscriberIcon.png" alt="" />
                            </div>
                            <br />
                            <div className="cards-content">
                                <p>Total Subscribers</p>
                                <p>{totalsubscriberCount}</p>
                            </div>
                        </div>
                        <div className="cards">
                            <div className="cards-icon">
                                <img src="../assets/images/growthIcon.png" alt="" />
                            </div>
                            <br />
                            <div className="cards-content">
                                <p>Growth Rate</p>
                                {growthRate < 0 ? (
                                    <p style={{ color: '#e92939' }}>{growthRate}%</p>
                                ) : (
                                    <p>{growthRate}%</p>
                                )}
                            </div>


                        </div>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <div className="main-home-bottom">
                    <div className="main-bottom-left">
                        <div className="graph">
                            <ApexChart />
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="main-bottom-right">
                        <Link to={'/subscriber'}>Subscribers</Link>
                        <Link to={'/help'}>FAQs</Link>
                        <Link to={'/broadcast'}>Email sent</Link>
                    </div>
                </div>
            </main>
            <br />
            <br />
            <Footer />
        </>
    )
}

export default Dashboard;
