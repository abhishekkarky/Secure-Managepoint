import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Index = () => {
    return (
        <>
            <Navbar />
            <main className='-mt-6 w-[100%] md:px-40 px-4 py-10 mx-auto bg-white min-h-[650px] text-black'>
                <p className='font-bold md:text-4xl text-2xl text-[#202227]'>The go-to marketing hub for creators <br className='md:block hidden' /> that helps you grow your audience <br className='md:block hidden' /> with ease.
                </p>
                <br />
                <div className="md:w-[700px] w-[90%] mx-auto flex h-[410px] md:float-right rounded-lg overflow-hidden">
                <iframe className='w-full h-full' src="https://www.youtube.com/embed/XtvA22PInP8?si=OKNv4J451U2Ye3Oq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </main>
            <Footer/>
        </>
    )
}

export default Index