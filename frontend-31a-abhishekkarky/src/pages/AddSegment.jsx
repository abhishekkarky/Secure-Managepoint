import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { createGroupApi, getAllSubscribersApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AddSegment = () => {
    const [segmentName, setSegmentName] = useState('');
    const [selectedOption, setSelectedOption] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [activePage] = useState('subscribers');

    useEffect(() => {
        // Highlight the active page in the sidebar
        let listGroupItem = Array.from(document.getElementsByClassName("list-group-item"));
        listGroupItem.forEach(i => i.classList.remove("active"));
        let activeID = document.getElementById(activePage);
        if (activeID) activeID.classList.add("active");
    }, [activePage]);

    useEffect(() => {
        // Fetch all subscribers and map them for the select input
        getAllSubscribersApi()
            .then((res) => {
                const temp = res.data.subscribers.map(subscriber => ({
                    value: subscriber._id,
                    label: subscriber.fullName
                }));
                setSubscribers(temp);
            })
            .catch((error) => {
                console.error('Error fetching subscribers:', error);
                toast.error('Failed to fetch subscribers.');
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate segmentName
        if (!segmentName.trim()) {
            toast.error('Segment name is required.');
            return;
        }

        const subscriberValue = selectedOption.map(data => data.value);
        const data = {
            name: segmentName.trim(),
            subscribers: subscriberValue,
            groupType: 'Segment'
        };

        // Make API call to create group
        createGroupApi(data)
            .then((res) => {
                if (!res.data.success) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                }
            })
            .catch((err) => {
                const errorMessage = err.response && err.response.status === 403
                    ? err.response.data.message
                    : 'Something went wrong';
                toast.error(errorMessage);
                console.error('API Error:', err.message);
            });
    };

    return (
        <>
            <Navbar />
            <main className="profile-main">
                <div className="side-bar-user">
                    <Link to='/createTag'><i className="fa-solid fa-plus"></i> Create Tag</Link>
                    <Link to='/viewTag'><i className="fa-solid fa-tag"></i> View All Tags</Link>
                    <Link className='active' to='/createSegment'><i className="fa-solid fa-plus"></i> Create Segment</Link>
                    <Link to='/viewSegment'><i className="fa-solid fa-user-group"></i> View All Segment</Link>
                </div>
                <form className="profile-main-right" onSubmit={handleSubmit}>
                    <h1 className='text-3xl'>Create Segment</h1>
                    <hr />
                    <br />
                    <label>Segment's Name</label>
                    <input
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                        type="text"
                        placeholder='Enter Segment Name'
                    />
                    <label>Add Subscriber</label>
                    <Select
                        className='select-input'
                        isMulti
                        value={selectedOption}
                        onChange={setSelectedOption}
                        options={subscribers}
                    />
                    <button type="submit">Save Changes</button>
                </form>
            </main>
            <Footer />
        </>
    );
}

export default AddSegment;
