import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { editUserApi, getUserByIdApi, updateUserImageApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';
import DOMPurify from 'dompurify';
const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState('');
  const [updated, setIsUpdated] = useState(false)

  useEffect(() => {
    getUserByIdApi(id).then((res) => {
      setUser(res.data.userDetail);
      setFullName(res.data.userDetail.fullName)
      setEmail(res.data.userDetail.email)
      setAddress(res.data.userDetail.address)
      setNumber(res.data.userDetail.number)
      setUserImage(res.data.userDetail.userImageUrl)
    })
  }, [id, updated]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');

  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const handleImageUploadAndSubmit = (userImage) => {
    const formData = new FormData();
    formData.append("userImage", userImage)
    console.log(userImage)

    updateUserImageApi(id, formData)
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          setIsUpdated((v) => !v)
        } else {
          toast.error(res.data.message);
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
  }

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setUserImage(file);
      setPreviewImage(URL.createObjectURL(file));
      handleImageUploadAndSubmit(file);
    } else {
      console.log('No file selected');
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const userFormData = new FormData();
    userFormData.append('fullName', fullName);
    userFormData.append('email', email);
    userFormData.append('address', address);
    userFormData.append('number', number);

    editUserApi(id, userFormData)
      .then((userRes) => {
        if (userRes.data.success === true) {
          toast.success(userRes.data.message);
          setIsUpdated((v) => !v)
        } else {
          toast.error(userRes.data.message);
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


  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/");
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

  return (
    <>
      <Navbar />
      <main className="profile-main">
        <div className="side-bar-user">
          <Link className='active' to={`/editProfile/${user._id}`}><i className="fa-solid fa-user"></i> Account Details</Link>
          <Link to={`/changePassword/${user._id}`}><i className="fa-solid fa-user"></i> Change Password</Link>
          <Link to={'/help'}><i className="fa-solid fa-circle-info"></i> Help?</Link>
          <button onClick={openLogoutModal}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
        </div>
        <form className="profile-main-right" encType='multipart/form-data'>
          <h1 className='text-3xl mb-10'>Edit Profile</h1>
          <div className='image-preview-container'>
            <div className='relative'>
              <img src={previewImage || (userImage || '/assets/images/userImage.png')} className='image-preview w-[120px] h-[120px] object-cover' alt="" />
              <div className="absolute bottom-0 right-0 ml-2 mb-2 bg-[#123697] rounded-full px-2 py-1 cursor-pointer">
                <input
                  className='z-10 opacity-0 absolute cursor-pointer'
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  tabIndex={-1}
                  name='userImage'
                />
                <i className="fa-solid fa-camera text-white text-[12px]"></i>
              </div>

            </div>
          </div>
          <label>Full Name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder='Edit Fullname' />
          <label>Email-address</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Edit Email' />
          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder='Edit Address' />
          <label>Mobile Number</label>
          <input value={number} onChange={(e) => setNumber(e.target.value)} type="tel" placeholder='Edit Number' />
          <button onClick={handleSubmit} type="submit">Save Changes</button>
        </form>
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
  );
};

export default Profile;
