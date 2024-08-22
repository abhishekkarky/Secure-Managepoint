import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { createBroadcastApi, getAllGroupApi, getAllSubscribersApi, getSingleBroadcastApi, updateBroadcastApi } from '../apis/api';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const EditBroadcast = () => {
    const { id } = useParams();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    const defaultTime = new Date().toLocaleString('en-US', options);

    const [groupsTag, setGroupsTag] = useState([]);
    const [groupsSegment, setGroupsSegment] = useState([]);
    const [allSubscribers, setAllSubscribers] = useState([]);
    const [broadcastTo, setBroadcastTo] = useState('Tag');
    const [broadcastGroup, setBroadcastGroup] = useState([]);
    const [broadcastTime, setBroadcastTime] = useState(defaultTime);
    const [broadcastTitle, setBroadcastTitle] = useState('');
    const [broadcastDescription, setBroadcastDescription] = useState('');
    const [subscriber, setSubscribers] = useState([]);
    const [selectedOption, setSelectedOption] = useState('Tag');
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

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const navigate = useNavigate();

    useEffect(() => {
        getAllGroupApi()
            .then((res) => {
                const tempTag = res.data.tags.map((tag) => ({
                    value: tag._id,
                    label: tag.name,
                }));

                const tempSegment = res.data.segments.map((segment) => ({
                    value: segment._id,
                    label: segment.name,
                }));
                setGroupsTag(tempTag);
                setGroupsSegment(tempSegment);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        getAllSubscribersApi()
            .then((res) => {
                if (res.data.subscribers) {
                    let temp = res.data.subscribers.map((subscriber) => ({
                        value: subscriber._id,
                        label: subscriber.fullName,
                    }));
                    setAllSubscribers(temp);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    useEffect(() => {
        getSingleBroadcastApi(id).then((res) => {
            console.log(res.data.broadcastData);

            if (res.data.broadcastData) {
                setBroadcastTitle(res.data.broadcastData.broadcastTitle);
                setBroadcastTo(res.data.broadcastData.broadcastTo);
                setBroadcastDescription(res.data.broadcastData.broadcastDescription);

                if (broadcastTo === 'Tag' || broadcastTo === 'Segment') {
                    setBroadcastGroup(res.data.broadcastData.broadcastGroup);
                } else {
                    const subscriberValue = res.data.broadcastData.sendTo.map((sendTo) => ({
                        value: sendTo._id,
                        label: sendTo.fullName,
                    }));
                    setBroadcastGroup(subscriberValue);
                }
            }
        });
    }, [id, broadcastTo]);

    const editorOptions = {
        placeholderText: 'Your broadcasting message here...',
        height: 300,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Broadcasting.....');

        const sanitizedTitle = DOMPurify.sanitize(broadcastTitle);
        const sanitizedDescription = DOMPurify.sanitize(broadcastDescription);

        const requestBody = {
            broadcastTitle: sanitizedTitle,
            broadcastTo,
            broadcastTime,
            broadcastDescription: sanitizedDescription,
        };

        switch (selectedOption) {
            case 'Tag':
                requestBody.broadcastGroup = broadcastGroup.map(group => group.value);
                break;
            case 'Segment':
                requestBody.broadcastGroup = broadcastGroup.map(group => group.value);
                break;
            case 'Individual':
                const subscriberValue = subscriber.map((data) => data.value);
                requestBody.sendTo = subscriberValue;
                break;
            case 'Subscribers':
                const value = allSubscribers.map((data) => data.value);
                requestBody.sendTo = value;
                requestBody.broadcastVisibility = "Public";
                break;
            default:
                break;
        }

        const today = new Date().toLocaleString('en-US', options);
        const currentTime = new Date(broadcastTime).toLocaleString('en-US', options);

        if (currentTime <= today) {
            requestBody.broadcastStatus = 'Sent';
        } else {
            requestBody.broadcastStatus = 'Queued';
            requestBody.broadcastVisibility = 'Queued';
        }

        createBroadcastApi(requestBody)
            .then((res) => {
                if (res.data.success === false) {
                    toast.dismiss(loadingToast);
                    toast.error(res.data.message);
                } else {
                    toast.dismiss(loadingToast);
                    toast.success(res.data.message);
                    navigate('/broadcast');
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

    const handleSaveToDraft = (e) => {
        e.preventDefault();

        const sanitizedTitle = DOMPurify.sanitize(broadcastTitle);
        const sanitizedDescription = DOMPurify.sanitize(broadcastDescription);

        const requestBody = {
            broadcastTitle: sanitizedTitle,
            broadcastTo,
            broadcastTime,
            broadcastDescription: sanitizedDescription,
            broadcastStatus: 'Draft',
            broadcastVisibility: "Draft",
        };

        switch (selectedOption) {
            case 'Tag':
                requestBody.broadcastGroup = broadcastGroup.map(group => group.value);
                break;
            case 'Segment':
                requestBody.broadcastGroup = broadcastGroup.map(group => group.value);
                break;
            case 'Individual':
                const subscriberValue = subscriber.map((data) => data.value);
                requestBody.sendTo = subscriberValue;
                break;
            case 'Subscribers':
                const value = allSubscribers.map((data) => data.value);
                requestBody.sendTo = value;
                break;
            default:
                break;
        }

        updateBroadcastApi(id, requestBody)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    navigate('/broadcast');
                }
            })
            .catch((error) => {
                console.log('Error saving to draft', error);
            });
    };

    return (
        <>
            <Navbar />
            <main className='new-broadcast-main'>
                <div className="new-main-top">
                    <Link className='back-button' to={'/broadcast'}>
                        <i className="fa-solid fa-arrow-left-long" style={{ fontSize: 15, marginRight: 10 }}></i>
                        Back to all Broadcasts
                    </Link>
                </div>
                <form className="new-main-bottom">
                    <h1 className='text-3xl font-bold'>Edit broadcast <i className="fa-solid fa-bullhorn" style={{ color: 'red', marginLeft: 10 }}></i></h1>
                    <label>Broadcast Title <span style={{ color: 'red' }}>*</span></label>
                    <input
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        type="text"
                        value={broadcastTitle}
                    />
                    <label>Select? <span style={{ color: 'red' }}>*</span></label>
                    <select
                        onChange={(e) => {
                            setBroadcastTo(e.target.value);
                            handleSelectChange(e);
                        }}
                        value={selectedOption}
                        placeholder="By Tags / By Segments ..."
                    >
                        <option value="Tag">By Tag</option>
                        <option value="Segment">By Segment</option>
                        <option value="Individual">Individual Subscriber</option>
                        <option value="Subscribers">All Subscribers</option>
                    </select>

                    {selectedOption === 'Tag' && (
                        <div className='input-field' style={{ marginTop: 15 }}>
                            <label style={{ marginBottom: 15 }}>By Tag's Name <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                options={groupsTag}
                                onChange={(selected) => setBroadcastGroup(selected)}
                                value={broadcastGroup}
                            />
                        </div>
                    )}
                    {selectedOption === 'Segment' && (
                        <div className='input-field' style={{ marginTop: 15 }}>
                            <label style={{ marginBottom: 15 }}>By Segment's Name <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                options={groupsSegment}
                                onChange={(selected) => setBroadcastGroup(selected)}
                                value={broadcastGroup}
                            />
                        </div>
                    )}
                    {selectedOption === 'Individual' && (
                        <div className='input-field' style={{ marginTop: 15 }}>
                            <label style={{ marginBottom: 15 }}>Select Subscribers <span style={{ color: 'red' }}>*</span></label>
                            <Select
                                isMulti
                                options={allSubscribers}
                                onChange={(selected) => setSubscribers(selected)}
                                value={subscriber}
                            />
                        </div>
                    )}
                    {selectedOption === 'Subscribers' && (
                        null
                    )}

                    <label>Broadcast Time <span style={{ color: 'red' }}>*</span></label>
                    <input
                        onChange={(e) => setBroadcastTime(e.target.value)}
                        type="datetime-local"
                        defaultValue={defaultTime}
                        min={defaultTime}
                    />

                    <label>Broadcasting Message <span style={{ color: 'red' }}>*</span></label>
                    <FroalaEditor
                        model={broadcastDescription}
                        onModelChange={(value) => setBroadcastDescription(value)}
                        config={editorOptions}
                    />
                    <div className="button-container">
                        <button style={{ backgroundColor: 'red' }} onClick={handleSaveToDraft}>
                            Save Changes
                        </button>
                        <button onClick={handleSubmit}>Send</button>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    );
}

export default EditBroadcast;
