import React from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
// import { BiCookie } from 'react-icons/bi';
import Hero from '../assets/hero.png';

const Portfolio: React.FC = () => {
    return (
        <div className="relative bg-pink flex flex-col min-h-screen">
            <Nav text="My Portfolio" />
            <main className="flex-grow flex flex-col items-center p-4">
                <div id='bagianSatu' className='flex flex-col md:flex-row w-full items-center border-4 border-blue'>
                    <div className='border-2 border-yellow-100'>
                        <img src={Hero} alt="Kesa" className='w-32' />
                    </div>
                    <div>
                        <h2>
                            Something to say
                        </h2>
                    </div>
                </div>
                <div id='bagianDua' className='grid grid-flow-row-dense grid-cols-5 justify-center w-full border-4 border-blue'>
                    <h3 className='text-2xl font-bold border-2 '>My Portfolio</h3>
                    <div className='col-span-4 items-center justify-center border h-6'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.</p>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Portfolio;