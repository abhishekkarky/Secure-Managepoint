import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { addSubscriberCSVApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AddSubscriberCSV = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
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

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('csvFile', file);

    addSubscriberCSVApi(formData)
      .then((res) => {
        if (res.data.success === false) {
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
          console.log(err.message);
        }
      });
  };

  return (
    <>
      <Navbar />
      <main className="profile-main">
        <div className="side-bar-user">
          <Link to='/addSubscriber'><i className="fa-solid fa-plus"></i> Add Subscriber</Link>
          <Link className='active' to='/addSubscriber/CSV'><i className="fa-solid fa-file"></i> Import from CSV</Link>
          <Link to='/editSubscriber'><i className="fa-solid fa-gear"></i> Manage Subscribers</Link>
        </div>
        <form className="profile-main-right" encType='multipart/form-data'>
          <h1 className='text-3xl'>Import Subscriber from CSV</h1>
          <hr />
          <br />
          <label>Upload a CSV File</label>
          <span className='text-[12px] text-red-500 mb-2'>* Note! Please add only subscriber's name and email in csv and upload the file.</span>
          <span className='text-[12px] text-red-500 mb-2'>* In CSV subscriber name and email must be fullName and email</span>
          <input className='cursor-pointer' type="file" id="csvFile" onChange={(e) => setFile(e.target.files[0])} />
          <button type="button" onClick={handleUpload}>Submit</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default AddSubscriberCSV;
