import React from 'react';
import { useState, useEffect } from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import PortoSlide from '../components/porto_slide';
import Hero from '../assets/hero.png';
import { CarouselData, fetchCrouselItems } from '../Api';
import LoadingSpinner from '../components/loading';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { EffectFade, Navigation, Pagination, Autoplay} from 'swiper/modules';

const Portfolio: React.FC = () => {
    const [carousel, setCarousel] = useState<CarouselData[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchCarouselData = async () => {
            setLoading(true);
            try {
                const data = await fetchCrouselItems();
                setCarousel(data);
            } catch (err: any) {
                console.error("Error fetching carousel items:", err);
            } finally {
                setLoading(false);
                console.log("Carousel data fetched:", carousel);
            }
        };

        fetchCarouselData();
    }, []);

    return (
        <div className="relative bg-pink flex flex-col min-h-screen">
            <Nav text="My Portfolio" />
            <main className="grow flex flex-col items-center p-4">
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
                    <div className='text-2xl font-bold border-2 '>
                        Pick a category
                    </div>
                    <div className='col-span-4 items-center justify-center border z-1'>
                        <Swiper
                            loop={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            slidesPerView={1}
                            effect={'fade'}
                            navigation={false}
                            pagination={{
                             clickable: true,
                            }}
                            modules={[EffectFade, Navigation, Pagination, Autoplay]}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                            className='-z-50'
                            >
                            {/* Perlu bikin loop */}
                            {/* <SwiperSlide className='flex justify-center items-center'>
                                <PortoSlide text='Slide Title 1'/>
                            </SwiperSlide> */}
                            {loading ? (
                                <div className="w-6 h-6"><LoadingSpinner/></div>
                            ) : (
                                carousel.map((item) => (
                                    <SwiperSlide className='flex justify-center items-center h-full border-2 '>
                                        {/* <div>{item.main_url}</div> */}
                                        <PortoSlide text={item.category} mainImg={item.main_url} leftImg={item.left_url} rightImg={item.right_url}/>
                                    </SwiperSlide>
                                ))
                            )}
                            {/* <SwiperSlide className='flex justify-center items-center'>
                                <PortoSlide text='Illustration'/>
                            </SwiperSlide> */}
                        </Swiper>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Portfolio;