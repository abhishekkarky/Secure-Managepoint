import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { createGroupApi, getAllSubscribersApi } from '../apis/api'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import '../styles/Profile.css'
import DOMPurify from 'dompurify';
const CreateTag = () => {

    const [subscribers, setSubscribers] = useState([])
    const [selectedOption, setSelectedOption] = useState([]);
    const [tagName, setTagName] = useState()
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
    })

    useEffect(() => {
        getAllSubscribersApi()
            .then((res) => {
                let temp = res.data.subscribers.map((subscriber) => ({
                    value: subscriber._id,
                    label: subscriber.fullName
                }))
                setSubscribers(temp);
            })
            .catch((error) => {
                console.error('Error fetching subscribers:', error);
            });
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const subscriberValue = selectedOption.map((data) => {
            return data.value;
        })
        // making logical form data
        const data = {
            "name": tagName,
            "subscribers": subscriberValue,
            "groupType": 'Tag'
        }
        // making API Call
        createGroupApi(data)
            .then((res) => {
                if (res.data.success == false) {
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
                    <Link className='active' to='/createTag'><i class="fa-solid fa-plus"></i> Create Tag</Link>
                    <Link to='/viewTag'><i class="fa-solid fa-tag"></i> View All Tags</Link>
                    <Link to='/createSegment'><i class="fa-solid fa-plus"></i> Create Segment</Link>
                    <Link to='/viewSegment'><i class="fa-solid fa-user-group"></i> View All Segment</Link>
                </div>
                <form className="profile-main-right">
                    <h1 className='text-3xl'>Create Tags</h1>
                    <hr />
                    <br />
                    <label>Tag's Name</label>
                    <input onChange={(e) => setTagName(e.target.value)} type="text" placeholder='Enter Tag Name' />
                    <label>Add Subscriber</label>
                    <Select className='select-input'
                        isMulti
                        value={selectedOption}
                        onChange={setSelectedOption}
                        options={subscribers}
                    />
                    <button onClick={handleSubmit} type="submit">Save Changes</button>
                </form>
            </main>
            <Footer />
        </>
    )
}

export default CreateTag