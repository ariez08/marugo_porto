import React, { ReactNode } from 'react'
import Cat1 from "../assets/love_cat.png"

interface WorkExpProps {
    corp: string;
    date: string;
    children?: ReactNode;
}
const WorkExpCard: React.FC<WorkExpProps> = ({corp, date, children}) => {
  return (
    <div className='m-2 px-1 flex text-white'>
        <img src={Cat1} alt="icon_cat" className='w-8 h-8'/>
        <div className='ml-2'>
            <h2 className='text-xl font-bold'>{corp}</h2>
            <h3>{date}</h3>
            <ul className="list-disc ml-5">
              {children}
            </ul>
        </div>
    </div>
  )
}

export default WorkExpCard