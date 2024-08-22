import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import { getAllSubscribersApi, getGroupByIdApi, updateGroupByIdApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const EditTag = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [selectedSubscribers, setSelectedSubscribers] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [activePage] = useState('subscribers');

    useEffect(() => {
        let listGroupItem = Array.from(document.getElementsByClassName("list-group-item"));
        listGroupItem.forEach(i => {
            i.classList.remove("active");
        });
        let activeID = document.getElementById(activePage);
        if (activeID) {
            activeID.classList.add("active");
        }
    }, [activePage]);

    useEffect(() => {
        getAllSubscribersApi()
            .then((res) => {
                const sanitizedSubscribers = res.data.subscribers.map((subscriber) => ({
                    value: subscriber._id,
                    label: DOMPurify.sanitize(subscriber.fullName),
                }));
                setSubscribers(sanitizedSubscribers);
            })
            .catch((error) => {
                console.error('Error fetching subscribers:', error);
            });
    }, []);

    useEffect(() => {
        getGroupByIdApi(id)
            .then((res) => {
                console.log(res.data);
                setName(DOMPurify.sanitize(res.data.group.name));
                const sanitizedSubscribers = res.data.group.subscribers.map((subscriber) => ({
                    value: subscriber._id,
                    label: DOMPurify.sanitize(subscriber.fullName),
                }));
                setSelectedSubscribers(sanitizedSubscribers);
            })
            .catch((error) => {
                console.error('Error fetching group:', error);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, selectedSubscribers);

        // Sanitize input values
        const sanitizedName = DOMPurify.sanitize(name);
        const subscriberValues = selectedSubscribers.map((data) => data.value);
        const data = {
            name: sanitizedName,
            subscribers: subscriberValues,
        };

        // Api call
        updateGroupByIdApi(id, data)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
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
            <Navbar />
            <main className="profile-main">
                <div className="side-bar-user">
                    <Link to="/createTag">
                        <i className="fa-solid fa-plus"></i> Create Tag
                    </Link>
                    <Link className="active" to="/viewTag">
                        <i className="fa-solid fa-tag"></i> View All Tags
                    </Link>
                    <Link to="/createSegment">
                        <i className="fa-solid fa-plus"></i> Create Segment
                    </Link>
                    <Link to="/viewSegment">
                        <i className="fa-solid fa-user-group"></i> View All Segments
                    </Link>
                </div>
                <form className="profile-main-right">
                    <h1 className='text-3xl'>Tag Preferences</h1>
                    <hr />
                    <br />
                    <label>Tag Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Edit Tag's name"
                    />
                    <label>Subscribers</label>
                    <Select
                        className="select-input"
                        isMulti
                        value={selectedSubscribers}
                        onChange={setSelectedSubscribers}
                        options={subscribers}
                    />
                    <button type="submit" onClick={handleSubmit}>
                        Save Changes
                    </button>
                </form>
            </main>
            <Footer />
        </>
    );
};

export default EditTag;
