import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { exportSubscriberInCSV, getAllSubscribersApi, totalSubscriberCountApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/Subscriber.css';

const Subscriber = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [subscribers, setSubscribers] = useState([]);
  const [totalSubscribersCount, setTotalSubscribersCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const subscribersPerPage = 10;
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
        const sanitizedSubscribers = res.data.subscribers.map(subscriber => ({
          ...subscriber,
          fullName: DOMPurify.sanitize(subscriber.fullName),
        }));
        setSubscribers(sanitizedSubscribers);
      })
      .catch((error) => {
        console.error('Error fetching subscribers:', error);
      });

    totalSubscriberCountApi()
      .then((res) => {
        setTotalSubscribersCount(res.data.count);
      })
      .catch((error) => {
        console.error('Error fetching total subscriber count:', error);
      });
  }, []);

  const handleSearchQuery = (e) => {
    e.preventDefault();
    const sanitizedQuery = DOMPurify.sanitize(e.target.query.value);
    setSearchQuery(sanitizedQuery);
  };

  useEffect(() => {
    const filtered = subscribers.filter((subscriber) =>
      subscriber.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchQuery, subscribers]);

  const pageCount = Math.ceil(filteredSubscribers.length / subscribersPerPage);

  const displaySubscribers = filteredSubscribers
    .slice(pageNumber * subscribersPerPage, (pageNumber + 1) * subscribersPerPage)
    .map((data) => (
      <tr key={data._id}>
        <td>{data.fullName}</td>
        <td>{new Date(data.date).toLocaleDateString()}</td>
        <td>
          {data.isSubscribed ? (
            <i className="fa-solid fa-circle" style={{ color: '#6BBF59' }}></i>
          ) : (
            <i className="fa-solid fa-circle" style={{ color: 'red' }}></i>
          )}
        </td>
      </tr>
    ));

  const handlePageClick = (data) => {
    setPageNumber(data.selected);
  };

  const exportSubscribersToCSV = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadConfirmation = () => {
    exportSubscriberInCSV()
      .then((res) => {
        const downloadLink = res.data.downloadLink;
        fetch(downloadLink)
          .then((response) => response.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${user.fullName} subscribers.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            setShowDownloadModal(false);
          })
          .catch((error) => {
            console.error("Error fetching CSV file:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching download link:", error);
      });
  };

  return (
    <>
      <Navbar />
      <main className="subscriber-main">
        <div className="s-main-top">
          <h1 className="text-4xl">All Subscribers</h1>
          <form onSubmit={handleSearchQuery}>
            <input type="text" placeholder="Search subscribers" name="query" />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="s-main-bottom">
          <div className="s-main-bottom-left">
            {filteredSubscribers.length === 0 ? (
              <div className="no-result">
                <h1 style={{ color: 'black' }}>No Subscribers Found...</h1>
              </div>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Subscriber</th>
                      <th scope="col">Subscription Date</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>{displaySubscribers}</tbody>
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
          <br />
          <div className="s-main-bottom-right">
            <div className="count">
              <p>Subscribers Count : {totalSubscribersCount}</p>
            </div>
            <br />
            <div className="bottom-right-box-one">
              <Link to={'/addSubscriber'} className="add-button">
                <i className="fa-solid fa-plus"></i> Add Subscriber
              </Link>
              <br />
              <Link to={'/editSubscriber'} className="manage-button">
                <i className="fa-solid fa-gear"></i> Manage Subscribers Preferences
              </Link>
            </div>
            <br />
            <div className="bottom-right-box-two">
              <div className="box-two-cards">
                <div className="card-icon">
                  <i className="fa-solid fa-tag"></i>
                </div>
                <div className="card-item">
                  <p>Tags</p>
                  <Link to="/createTag">Create tags and organize subscribers</Link>
                </div>
              </div>
              <br />
              <div className="box-two-cards">
                <div className="card-icon">
                  <i className="fa-solid fa-user-group"></i>
                </div>
                <div className="card-item">
                  <p>Segments</p>
                  <Link to="/createSegment">Group your subscribers together for broadcasts</Link>
                </div>
              </div>
              <br />
              <div className="box-two-cards">
                <div className="card-icon">
                  <i className="fa-solid fa-file-export"></i>
                </div>
                <div className="card-item">
                  <p>Export Subscribers</p>
                  <a style={{ cursor: 'pointer' }} onClick={exportSubscribersToCSV}>
                    All subscriber to CSV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <br />
      <br />
      <Footer />

      {showDownloadModal && (
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
                      onClick={() => setShowDownloadModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg
                          className="h-6 w-6 text-green-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                          Download Confirmation
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Are you sure you want to download subscribers?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={handleDownloadConfirmation}
                    >
                      Confirm Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDownloadModal(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
    </>
  );
};

export default Subscriber;





