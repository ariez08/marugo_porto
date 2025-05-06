import React from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';

const Portfolio: React.FC = () => {
    return (
        <div className="relative bg-pink flex flex-col min-h-screen">
            <Nav text="My Portfolio" />
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div id='bagianSatu' className='flex flex-col items-center justify-center'>
                    <div>

                    </div>
                    
                </div>
                <div id='bagianDua'>

                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Portfolio;