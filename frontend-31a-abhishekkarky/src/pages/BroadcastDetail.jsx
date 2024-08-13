import { LinearProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import '../styles/BroadcastDetail.css'
import { getSingleBroadcastApi, totalSubscriberCountApi } from '../apis/api'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'

const BroadcastDetail = () => {
    const { id } = useParams();
    const [broadcastTitle, setBroadcastTitle] = useState('')
    const [broadcastDescription, setBroadcastDescription] = useState('')
    const [broadcastTime, setBroadcastTime] = useState('')
    const [broadcastSentTo, setBroadcastSentTo] = useState('')
    const [totalsubscriberCount, setTotalSubscriberCount] = useState(0)
    const [activePage] = useState('broadcast');

    useEffect(() => {
        totalSubscriberCountApi()
            .then((res) => {
                setTotalSubscriberCount(res.data.count);
            })
            .catch((error) => {
                console.error("Error fetching total subscriber count:", error);
            });
        }, [])

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

    useEffect(()=> {
        getSingleBroadcastApi(id).then((res)=> {
            console.log(res.data.broadcastData)
            setBroadcastTitle(res.data.broadcastData.broadcastTitle)
            setBroadcastDescription(res.data.broadcastData.broadcastDescription)
            setBroadcastTime(res.data.broadcastData.broadcastTime)
            setBroadcastSentTo(res.data.broadcastData.sendTo)
        })
    }, [])

    const progressPercentage = (broadcastSentTo.length / totalsubscriberCount) * 100;

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
                <div className="broadcast-detail-body">
                    <h1 className='subject'>Subject</h1>
                    <p style={{fontSize: 18}}>{broadcastTitle}</p>
                    <p className='description'><FroalaEditorView model={broadcastDescription} /></p>
                    <h1 className='stats'>STATS</h1>
                    <div className="row-bd-stats">
                        <div className="flex flex-col gap-y-3 md:w-[300px] w-full">
                            <h1 className='rec-counts'>{broadcastSentTo.length}</h1>
                            <p className='recipients'>RECIPIENTS</p>
                            <LinearProgress className='w-full h-[5px]' variant="determinate" value={progressPercentage} sx={{ backgroundColor: 'rgb(218, 218, 218)', '& .MuiLinearProgress-bar': { backgroundColor: 'orange' } }} />
                        </div>
                        <div className="flex flex-col gap-y-3 md:w-[300px] w-full">
                            <h1 className='rec-counts'>50</h1>
                            <p className='recipients'>UNSUBSCRIBED</p>
                            <LinearProgress className='w-full h-[5px]' variant="determinate" value={50} sx={{ backgroundColor: 'rgb(218, 218, 218)', '& .MuiLinearProgress-bar': { backgroundColor: 'orange' } }} />
                        </div>
                    </div>
                    <h1 className='published-date-h1'>Publication Date</h1>
                    <p className='date'>{new Date(broadcastTime).toLocaleDateString()}</p>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default BroadcastDetail
