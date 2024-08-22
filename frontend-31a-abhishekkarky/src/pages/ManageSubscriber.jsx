import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { deleteSubscriberByIdApi, getAllSubscribersApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const ManageSubscriber = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const subscribersPerPage = 10;
  const [isUpdated, setIsUpdated] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
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
        setSubscribers(res.data.subscribers);
      })
      .catch((error) => {
        console.error('Error fetching subscribers:', error);
      });
  }, [isUpdated]);

  useEffect(() => {
    const filtered = subscribers.filter((subscriber) =>
      DOMPurify.sanitize(subscriber.fullName).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchQuery, subscribers]);

  const pageCount = Math.ceil(filteredSubscribers.length / subscribersPerPage);

  const handleDelete = () => {
    const id = selectedSubscriber._id;
    deleteSubscriberByIdApi(id)
      .then((res) => {
        if (res.data.success) {
          setIsUpdated((v) => !v);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.log('Error deleting subscriber:', error);
      });
    closeDeleteModal();
  };

  const displaySubscribers = filteredSubscribers
    .slice(pageNumber * subscribersPerPage, (pageNumber + 1) * subscribersPerPage)
    .map((data) => (
      <tr key={data._id}>
        <td>{DOMPurify.sanitize(data.fullName)}</td>
        <td>{DOMPurify.sanitize(data.email)}</td>
        <td>
          <Link className='edit-button' to={`/editSubscriber/details/${data._id}`}>
            <i className="fa-regular fa-pen-to-square" style={{ fontSize: 12 }}></i>
          </Link>
          <button onClick={() => openDeleteModal(data)} className='delete-button'>
            <i className="fa-regular fa-trash-can" style={{ fontSize: 12 }}></i>
          </button>
        </td>
      </tr>
    ));

  const handlePageClick = (data) => {
    setPageNumber(data.selected);
  };

  const openDeleteModal = (data) => {
    setIsDeleteModalOpen(true);
    setSelectedSubscriber(data);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSubscriber(null);
  };

  return (
    <>
      <Navbar />
      <main className="profile-main">
        <div className="side-bar-user">
          <Link to='/addSubscriber'><i className="fa-solid fa-plus"></i> Add Subscriber</Link>
          <Link to='/addSubscriber/CSV'><i className="fa-solid fa-file"></i> Import from CSV</Link>
          <Link className='active' to='/editSubscriber'><i className="fa-solid fa-gear"></i> Manage Subscribers</Link>
        </div>
        <div className="profile-main-right">
          <h1 className='text-3xl'>Subscriber List</h1>
          <br />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchQuery(DOMPurify.sanitize(e.target.query.value));
            }}
            className='search-form'
          >
            <input className='search-input' type="text" placeholder="Search subscribers" name="query" />
            <button className='search-button' type="submit">Search</button>
          </form>
          <br />
          {filteredSubscribers.length === 0 ? (
            <h2 style={{ textAlign: 'center' }}>No Subscribers to show</h2>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Subscriber</th>
                    <th scope="col">Subscriber Email</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySubscribers}
                </tbody>
              </table>
              <br />
              <hr />
              <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                previousLabel={<i className="fa-solid fa-circle-left"></i>}
                nextLabel={<i className="fa-solid fa-circle-right"></i>}
                previousLinkClassName={'pagination__link'}
                nextLinkClassName={'pagination__link'}
                disabledClassName={'pagination__link--disabled'}
                activeClassName={'pagination__link--active'}
              />
            </>
          )}
        </div>
      </main>
      {isDeleteModalOpen && (
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
                        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete?</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Are you sure you want to Delete? This cannot be undone later.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20 sm:w-auto"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
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

export default ManageSubscriber;
