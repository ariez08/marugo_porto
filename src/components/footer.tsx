import React, { useState, useRef } from 'react';
import { HiX } from "react-icons/hi";
import { BsInstagram, BsTiktok } from "react-icons/bs";
import { motion, PanInfo } from "framer-motion";
import FooterPic from "../assets/icon_footer.webp";
import KeyPic from "../assets/cookie.png";
import LoginForm from './login_form';

const Footer: React.FC = () => {
  const colors = ['bg-yellow-200', 'bg-lime-green', 'bg-pink', 'bg-orange'];
  const [bgColor, setBgColor] = useState<string[]>(['bg-transparent', 'bg-transparent']);
  const [showPopup, setShowPopup] = useState(false);
  const footerPicRef = useRef<HTMLDivElement>(null);

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

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
    <footer className="relative flex flex-col bg-blue mt-5 overflow-hidden">
      <div className="flex flex-row p-2 text-white">
        <div ref={footerPicRef} className="m-1 pl-2">
          <img src={FooterPic} alt="footer_pic" className="w-16" />
        </div>

        <div className="flex flex-col m-1 mx-2">
          <h2 className="font-school text-2xl">Connect With Me</h2>
          <div className="">
            <a
              href="https://www.instagram.com/marr._.goo/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-row w-min my-1 text-lg border-2 rounded-lg ${bgColor[0]}`}
              onMouseEnter={() => handleMouseEvent(0, true)}
              onMouseLeave={() => handleMouseEvent(0, false)}
            >
              <BsInstagram className="m-1 my-1 text-2xl" />
              <span className="pr-2">@marr._.goo</span>
            </a>
            <a
              href="https://www.tiktok.com/@keca_uwuuuhh"
              target="_blank"
              rel="noopener noreferrer"
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
          onClick={() => setShowPopup(true)}
          onDragEnd={handleDragEnd}
        />
      </div>
      

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-50 p-4">
          <div className="relative bg-[#faf5ed] p-6 md:p-8 rounded-3xl shadow-[6px_6px_0px_#1c1c1c] max-w-sm w-full border-3 border-black-200">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute text-red hover:text-black-100 text-2xl font-bold right-3 top-3 cursor-pointer hover:scale-110 transition-transform p-1"
            >
              <HiX />
            </button>
            <div className="text-center mb-6">
              <h2 className="font-londrina text-3xl text-black-100">
                You Found The Secret!
              </h2>
            </div>
            <LoginForm />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <hr className="w-1/2 border-2 border-yellow-200 rounded-full" />
      </div>
      <div className="text-center text-md py-2">
        <p className="font-bold text-white">
          Copyright &copy; {new Date().getFullYear()}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
