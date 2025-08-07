import React from 'react'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// const imageFallback: string = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZsb3dlciUyMGNhdHxlbnwwfHx8fDE2ODQ5NTY1MjA&ixlib=rb-4.0.3&q=80&w=400";

interface PortoSlideProps {
    text: string
    children?: React.ReactNode
    mainImg?: string
    leftImg?: string
    rightImg?: string
  }

const PortoSlide: React.FC<PortoSlideProps> = ({
  text,
  mainImg,
  leftImg,
  rightImg,
}) => {
  return (
    <div className='m-4 p-2 text-center justify-center rounded-2xl -z-50 bg-yellow-100 h-full border-4 border-green/30'>
        <h1 className='bg-white w-fit place-self-center px-4 py-1 m-1 -z-50'>{text}</h1>
        <div className='container grid grid-cols-4 justify-center items-center p-2 h-full w-full'>
            <div className='relative w-full h-full'>
                <img src={leftImg} alt="Porto" className='w-[10vw] absolute bottom-0 -right-6 rounded-2xl'/>
            </div>
            <div className='relative w-full h-full col-span-2'>
                <img src={mainImg} alt="Porto" className='h-[64vh] place-self-center rounded-2xl'/>
            </div>
            <div className='relative w-full h-full place-self-start'>
                <img src={rightImg} alt="Porto" className='w-[10vw] absolute top-0 -left-6 rounded-2xl'/>
            </div>
        </div>
    </div>
  )
}


export default PortoSlide