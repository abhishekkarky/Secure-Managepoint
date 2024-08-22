import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { getAllGroupApi } from '../apis/api';
const ViewTag = () => {
  const [group, setGroup] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const groupsPerPage = 10;
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
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
        setGroup(res.data.tags);
      })
      .catch((error) => {
        console.error('Error fetching group tag:', error);
      });
  }, [isUpdated]);

  useEffect(() => {
    // Filter groups type based on search query
    const filtered = group.filter((groups) =>
      groups.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchQuery, group]);

  const pageCount = Math.ceil(filteredSubscribers.length / groupsPerPage); const handleSearch = (e) => {
    e.preventDefault();
    const sanitizedQuery = DOMPurify.sanitize(e.target.query.value);
    setSearchQuery(sanitizedQuery);
  };

  return (
    <form
      onSubmit={handleSearch}
      className='search-form'
    >
      <input className='search-input' type="text" placeholder="Search tags" name="query" />
      <button className='search-button' type="submit">Search</button>
    </form>
  );



};

export default ViewTag;
