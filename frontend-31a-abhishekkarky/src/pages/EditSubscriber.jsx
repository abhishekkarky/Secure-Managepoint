import DOMPurify from 'dompurify'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSubscriberByIdApi, updateSubscriberByIdApi } from '../apis/api'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const EditSubscriber = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getSubscriberByIdApi(id).then((res) => {
      console.log(res.data);
      setFullName(DOMPurify.sanitize(res.data.subscriberData.fullName));
      setEmail(DOMPurify.sanitize(res.data.subscriberData.email));
    });
  }, [id]);


  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
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


  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(fullName, email)

    const formData = new FormData();
    formData.append('fullName', fullName)
    formData.append('email', email)

    updateSubscriberByIdApi(id, formData).then((res) => {
      if (res.data.success == true) {
        toast.success(res.data.message)
        navigate('/subscriber')
      }
      else {
        toast.error(res.data.message)
      }
    }).catch(err => {
      if (err.response && err.response.status === 403) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Something went wrong');
        console.log(err.message);
      }
    })
  }

  return (
    <>
      <Navbar />
      <main className="profile-main">
        <div className="side-bar-user">
          <Link to='/addSubscriber'><i className="fa-solid fa-plus"></i> Add Subscriber</Link>
          <Link to=''><i className="fa-solid fa-file"></i> Bulk Subscriber Upload</Link>
          <Link className='active' to='/editSubscriber'><i className="fa-solid fa-gear"></i> Manage Subscribers</Link>
        </div>
        <form className="profile-main-right">
          <h1 className='text-3xl'>Edit Subscriber Details</h1>
          <hr />
          <br />
          <label>Subscriber Name</label>
          <input
            type="text"
            value={fullName}
            placeholder="Edit Subscriber's name"
            onChange={(e) => setFullName(e.target.value)}
          />
          <label>Subscriber Email</label>
          <input
            type="email"
            value={email}
            placeholder='Edit Subscriber Email Address'
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubmit} type="submit">Save Changes</button>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default EditSubscriber