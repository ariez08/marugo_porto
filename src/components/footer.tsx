import React, { useState, useRef } from 'react';
import ToggleSwitch from './logreg_switch';
import { HiX } from "react-icons/hi";
import { BsInstagram, BsTiktok } from "react-icons/bs";
import { motion } from "framer-motion";
import FooterPic from "../assets/icon_footer.png";
import KeyPic from "../assets/cookie.png";
import LoginForm from './login_form';
import RegisterForm from './register_form';

const Footer: React.FC = () => {
  const colors = ['bg-yellow-200', 'bg-lime-green', 'bg-pink', 'bg-orange'];
  const [bgColor, setBgColor] = useState<string[]>(['bg-transparent', 'bg-transparent']);
  const [showPopup, setShowPopup] = useState(false);
  const [showRegister, setResgister] = useState(true);
  const footerPicRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setResgister((prev) => !prev);
  };

  const getRandomColor = (currentColor: string) => {
    let randomColor;
    do {
      const randomIndex = Math.floor(Math.random() * colors.length);
      randomColor = colors[randomIndex];
    } while (randomColor === currentColor);
    return randomColor;
  };

  const handleMouseEvent = (index: number, isEnter: boolean) => {
    const newColors = [...bgColor];
    newColors[index] = isEnter ? getRandomColor(bgColor[index]) : 'bg-transparent';
    setBgColor(newColors);
  };

  const handleDragEnd = (_event: any, info: any) => {
    const footerPicElement = footerPicRef.current;
    if (!footerPicElement) return;

    const footerPicRect = footerPicElement.getBoundingClientRect();

    if (info && info.point) {
      const { x, y } = info.point;

      if (
        x >= footerPicRect.left + window.scrollX &&
        x <= footerPicRect.right + window.scrollX &&
        y >= footerPicRect.top + window.scrollY &&
        y <= footerPicRect.bottom + window.scrollY
      ) {
        setShowPopup(true);
      }
      
    } else {
      console.warn("Drag information is missing or incomplete.");
    }
  };


  return (
    <footer className="flex flex-col bg-blue mt-5 overflow-hidden">
      <div className="flex flex-row p-2 text-white">
        <div ref={footerPicRef} className="m-1 pl-2">
          <img src={FooterPic} alt="footer_pic" className="w-16" />
        </div>

        <div className="flex flex-col m-1 mx-2">
          <h2 className="font-school text-2xl">Connect With Me</h2>
          <div className="">
            <a
              href="https://www.instagram.com/marr._.goo/"
              className={`flex flex-row w-min my-1 text-lg border-2 rounded-lg ${bgColor[0]}`}
              onMouseEnter={() => handleMouseEvent(0, true)}
              onMouseLeave={() => handleMouseEvent(0, false)}
            >
              <BsInstagram className="m-1 my-1 text-2xl" />
              <span className="pr-2">@marr._.goo</span>
            </a>
            <a
              href="#"
              className={`flex flex-row w-min my-1 text-lg border-2 rounded-lg ${bgColor[1]}`}
              onMouseEnter={() => handleMouseEvent(1, true)}
              onMouseLeave={() => handleMouseEvent(1, false)}
            >
              <BsTiktok className="m-1 my-1 text-2xl" />
              <span className="pr-2">@keca_uwuuuhh</span>
            </a>
          </div>
        </div>
      </div>

      <div className='w-8 h-8 absolute bottom-1 right-1'>
        <motion.img 
          src={KeyPic}
          alt="drag_to_reveal"
          className="h-full object-cover cursor-pointer"
          drag
          dragSnapToOrigin={true}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          whileDrag={{ scale: 0.9, rotate: 5 }}
          onDragEnd={handleDragEnd}
        />
      </div>
      

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-center underline underline-offset-4 decoration-wavy">You Found The Secret! 😭</h2>
            <div className='flex gap-2'>
              <HiX onClick={() => setShowPopup(false)} className='absolute text-red text-xl font-bold right-2 top-2 cursor-pointer'/>
              {(showRegister) ?
              <RegisterForm/>:<LoginForm/>}
              <ToggleSwitch isActive={showRegister} onToggle={handleToggle} />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <hr className="w-1/2 border-2 border-yellow-200 rounded-full" />
      </div>
      <div className="text-center text-md py-2">
        <p className="font-bold text-white">Copyright &copy; 2024. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
