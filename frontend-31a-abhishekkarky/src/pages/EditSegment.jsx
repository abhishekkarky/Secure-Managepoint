import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import { getAllSubscribersApi, getGroupByIdApi, updateGroupByIdApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
const EditSegment = () => {
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

  useEffect(() => {
    getGroupByIdApi(id)
      .then((res) => {
        console.log(res.data);
        setName(res.data.group.name);
        let temp = res.data.group.subscribers.map((subscriber) => ({
          value: subscriber._id,
          label: subscriber.fullName,
        }));
        setSelectedSubscribers(temp);
      })
      .catch((error) => {
        console.error('Error fetching group:', error);
      });
  }, [id]);

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  // In your component
  const handleSubmit = (e) => {
    e.preventDefault();

    // Sanitize input values
    const sanitizedName = sanitizeInput(name);

    const subscriberValues = selectedSubscribers.map((data) => data.value);
    const data = {
      name: sanitizedName,
      subscribers: subscriberValues,
    };

    // API call
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
          <Link to="/viewTag">
            <i className="fa-solid fa-tag"></i> View All Tags
          </Link>
          <Link to="/createSegment">
            <i className="fa-solid fa-plus"></i> Create Segment
          </Link>
          <Link className="active" to="/viewSegment">
            <i className="fa-solid fa-user-group"></i> View All Segment
          </Link>
        </div>
        <form className="profile-main-right">
          <h1 className='text-3xl'>Segment Preferences</h1>
          <hr />
          <br />
          <label>Segment Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Edit Segment's name"
          />
          <label>Subscribers</label>
          <Select
            className="select-input"
            isMulti
            value={selectedSubscribers}
            onChange={setSelectedSubscribers}
            options={subscribers}
            defaultValue={subscribers}
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

export default EditSegment;