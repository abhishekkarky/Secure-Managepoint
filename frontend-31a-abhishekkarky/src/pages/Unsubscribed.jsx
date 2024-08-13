import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { unsubscribeApi } from '../apis/api';

const Unsubscribed = () => {
  const { userId, subscriberId } = useParams();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    unsubscribeApi(userId, subscriberId).then(() => {
      setLoading(true)
    }).catch((error) => {
      console.log('Error', error)
    })
  }, [])

  return (
    <>
      {!loading ? <></> : <>
        <main className='flex justify-center items-center w-full h-screen p-4'>
          <div className="flex flex-col justify-center items-center gap-y-5 md:min-w-fit w-full py-5">
            <Link to={'/'}><img className='w-[120px] h-[120px]' src="/assets/images/mp-logo.png" alt="Managepoint Logo" /></Link>
            <h1 className='text-2xl text-neutral-300 text-center'>We are very sad to let go of you 😔</h1>
            <p className='text-md text-neutral-300'>You have successfully unsubscribed !!</p>
          </div>
        </main>
      </>}

    </>
  )
}

export default Unsubscribed