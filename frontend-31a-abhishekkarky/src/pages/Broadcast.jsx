import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { deleteBroadcastByApi, getAllBroadcastApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/Broadcast.css';
import DOMPurify from 'dompurify'; 
const Broadcast = () => {
  const [broadcastAll, setBroadcastAll] = useState([]);
  const [broadcastDraft, setBroadcastDraft] = useState([]);
  const [broadcastQueued, setBroadcastQueued] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const groupsPerPage = 10;
  const [activePage] = useState('broadcast');

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

  const formattedDate = (broadcastTime) => {
    const optionsDate = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };

    const date = new Date(broadcastTime);
    const formattedDateString = date.toLocaleDateString('en-US', optionsDate);

    return `${formattedDateString}`;
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);

  useEffect(() => {
    getAllBroadcastApi().then((res) => {
      setBroadcastAll(res.data.all);
      setBroadcastDraft(res.data.draft)
      setBroadcastQueued(res.data.queued)
    });
  }, [isUpdated]);

  useEffect(() => {
    const filtered = broadcastAll.filter((data) =>
      data.broadcastTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchQuery, broadcastAll]);

  const pageCount = Math.ceil(filteredSubscribers.length / groupsPerPage);

  const completedBroadcasts = broadcastAll.filter(
    (data) => data.broadcastStatus === 'Sent'
  );

  const handleDelete = () => {
    const id = selectedBroadcast._id;
    deleteBroadcastByApi(id)
      .then((res) => {
        if (res.data.success) {
          setIsUpdated((v) => !v);
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
    setSelectedBroadcast(data);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedBroadcast(null);
  };

  const displaygroups = filteredSubscribers
    .slice(pageNumber * groupsPerPage, (pageNumber + 1) * groupsPerPage)
    .map((data) => (
      <div className="broadcast-container" key={data._id}>
        <div className="b-container-left">
          <h3>
            {data.broadcastTitle}{' '}
            {data.broadcastVisibility && (
              <span className='title-span'>{data.broadcastVisibility}</span>
            )}
          </h3>
          <div className="b-left-content">
            {data.broadcastStatus === 'Draft' ? (
              <p>
                <i
                  className="fa-regular fa-clock"
                  style={{
                    color: 'rgb(87, 87, 87)',
                    fontSize: 15,
                    marginRight: 4,
                  }}
                ></i>{' '}
                <span>Last Saved</span> {formattedDate(data.broadcastTime)}
              </p>
            ) : (
              <>
                <p>
                  <i
                    className="fa-regular fa-envelope"
                    style={{ fontSize: 15, color: 'black', marginRight: 4 }}
                  ></i>{' '}
                  <span style={{ marginRight: 2 }}>{data.sent ? data.sent.sentTo.length : 0}</span> Recipient
                </p>
                <p>
                  <span style={{ marginRight: 2 }}>0</span> Unsubscribed
                </p>
                {data.broadcastStatus === 'Queued' ? (
                  <p>
                    <i
                      className="fa-regular fa-clock"
                      style={{
                        color: 'rgb(87, 87, 87)',
                        fontSize: 15,
                        marginRight: 4,
                      }}
                    ></i>{' '}
                    <span>Releasing on :</span> {formattedDate(data.broadcastTime)}
                  </p>
                ) : (
                  <p>
                    <i
                      className="fa-regular fa-clock"
                      style={{
                        color: 'rgb(87, 87, 87)',
                        fontSize: 15,
                        marginRight: 4,
                      }}
                    ></i>{' '}
                    <span>Published</span> {formattedDate(data.broadcastTime)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="b-container-right">
          {data.broadcastStatus === 'Draft' ? (
            <Link to={`/editBroadcast/${data._id}`} className='edit-button'>
              <i className="fa-regular fa-edit"></i>
            </Link>
          ) : (
            <Link to={`/broadcastDetail/${data._id}`} className='edit-button'>
              <i className="fa-regular fa-eye"></i>
            </Link>
          )}
          <button onClick={() => openDeleteModal(data)} className='delete-button'>
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    ));

  const handlePageClick = (data) => {
    setPageNumber(data.selected);
  };

  return (
    <>
      <Navbar />
      <main className='broadcast-main'>
        <div className="main-top">
          <Link className='active' to={'/broadcast'}>
            <i className="fa-solid fa-bullhorn"></i> All Broadcasts{' '}
            <span>{broadcastAll ? broadcastAll.length : 0}</span>
          </Link>
          <Link to={'/draft'}>
            <i className="fa-regular fa-clipboard"></i> Drafts <span>{broadcastDraft ? broadcastDraft.length : 0}</span>
          </Link>
          <Link to={'/queued'}>
            <i className="fa-solid fa-hourglass"></i> Queued <span>{broadcastQueued ? broadcastQueued.length : 0}</span>
          </Link>
          <Link to={''}>
            <i className="fa-solid fa-arrows-spin"></i> Processing{' '}
            <span>0</span>
          </Link>
          <Link to={'/completed'}>
            <i className="fa-solid fa-circle-check"></i> Completed{' '}
            <span>{completedBroadcasts ? completedBroadcasts.length : 0}</span>
          </Link>
          <Link to={'/newBroadcast'}>
            <i className="fa-solid fa-plus"></i> New Broadcast
          </Link>
        </div>
        <div className="main-bottom">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchQuery(e.target.query.value);
            }}
            className='search-form'>
            <input
              className='search-input'
              type="text"
              placeholder="Search All Broadcast"
              name="query"
            />
            <button className='search-button' type="submit">
              Search
            </button>
          </form>
          {displaygroups}
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
                        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete Broadcast?</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Are you sure you want to delete this broadcast? This action cannot be undone.</p>
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
};

export default Broadcast;
