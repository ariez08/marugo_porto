import React, { ReactNode } from 'react'
import CatPic from "../assets/flower_cat.png"
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

interface AboutCardProps {
    name: string;
    children: ReactNode;
    minSize?: string;
}
const AboutCard:React.FC<AboutCardProps> = ({name, children, minSize= "10"}) => {
  return (
    <div className='text-white'>
        <div className='bg-blue border-1 border-white w-min px-3 rounded-full text-nowrap flex'>
            <h1 className='text-3xl text-white font-name font-semibold'>{name}</h1><HiOutlineChevronDoubleRight className='text-yellow-200 font-bold text-5xl'/>
        </div>
        <div className={`relative mt-1 px-4 py-2 pr-8 text-xl border-2 border-white rounded-custom max-w-[50vh] min-w-[${minSize}vw]`}>
            {children}
            <img src={CatPic} alt="floweerr" className='absolute -right-3 -bottom-3 w-10'/>
        </div>
    </div>
  )
}

export default AboutCard