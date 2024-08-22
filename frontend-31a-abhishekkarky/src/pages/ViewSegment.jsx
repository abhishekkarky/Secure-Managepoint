import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { deleteGroupByIdApi, getAllGroupApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ViewSegment = () => {
  const [group, setGroup] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const groupsPerPage = 10;
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
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
    // Fetch all groups
    getAllGroupApi()
      .then((res) => {
        setGroup(res.data.segments);
      })
      .catch((error) => {
        console.error('Error fetching group segment:', error);
      });
  }, [isUpdated]);

  useEffect(() => {
    // Filter groups type based on search query
    const filtered = group.filter((groups) =>
      groups.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchQuery, group]);

  const pageCount = Math.ceil(filteredSubscribers.length / groupsPerPage);

  const handleDelete = () => {
    const id = selectedSegment._id;
    deleteGroupByIdApi(id)
      .then((res) => {
        if (res.data.success) {
          setIsUpdated(v => !v)
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.log('Error deleting Group:', error);
      });
    closeDeleteModal();
  };

  const openDeleteModal = (data) => {
    setIsDeleteModalOpen(true);
    setSelectedSegment(data);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSegment(null);
  };

  const displaygroups = filteredSubscribers
    .slice(pageNumber * groupsPerPage, (pageNumber + 1) * groupsPerPage)
    .map((data) => (
      <tr key={data._id}>
        <td>{data.name}</td>
        <td>{data.subscribers.length}</td>
        <td>
          <Link className='edit-button' to={`/editSegment/${data._id}`}>
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

  return (
    <>
      <Navbar />
      <main className="profile-main">
        <div className="side-bar-user">
          <Link to='/createTag'><i className="fa-solid fa-plus"></i> Create Tag</Link>
          <Link to='/viewTag'><i className="fa-solid fa-tag"></i> View All Tags</Link>
          <Link to='/createSegment'><i className="fa-solid fa-plus"></i> Create Segment</Link>
          <Link className='active' to='/viewSegment'><i className="fa-solid fa-user-group"></i> View All Segment</Link>
        </div>
        <div className="profile-main-right">
          <h1 className='text-3xl'>View All Segments</h1>
          <br />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const sanitizedQuery = e.target.query.value.trim();
              setSearchQuery(sanitizedQuery);
            }}
            className='search-form'
          >
            <input className='search-input' type="text" placeholder="Search Segment" name="query" />
            <button className='search-button' type="submit">Search</button>
          </form>


          <br />
          {filteredSubscribers.length === 0 ? (
            <h2 style={{ textAlign: 'center' }}>No Segments to show</h2>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Segment Name</th>
                    <th scope="col">Subscriber</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displaygroups}
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
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:mx-auto">
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-all"
                      onClick={closeDeleteModal}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m0 4H12v-6zm0-9C6.48 6 2 10.48 2 16s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 18h2v2h-2v-2zm0-12h2v8h-2v-8z" />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete Segment?</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Are you sure you want to delete this segment? This action cannot be undone.</p>
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
                    <button type="button" onClick={closeDeleteModal} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
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
}

export default ViewSegment;
