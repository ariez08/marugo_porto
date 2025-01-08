import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CapsuleButtonProps {
  text: string; 
  onClick?: () => void;
  to?: string; 
  className?: string;
}

const CapsuleButton: React.FC<CapsuleButtonProps> = ({ text, onClick, to, className = ""}) => {
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk menangani klik tombol, jika 'to' diberikan, navigasikan ke halaman yang sesuai
  const handleClick = () => {
    if (to) {
      navigate(to); // Jika 'to' diberikan, navigasi ke URL tersebut
    }
    if (onClick) {
      onClick(); // Jika onClick diberikan, jalankan fungsi onClick
    }
  };

  return (
    <div className='relative mt-4'>
      {/* Bayangan Button */}
      <div
        className={`absolute -z-60 top-2 left-3 w-full h-full rounded-full opacity-85 bg-black-100`}
      ></div>
      
      <button
        onClick={handleClick}
        className={`relative px-6 py-1 text-sm text-black-100 ${className} border border-black-200 rounded-full hover:bg-gray-100`}
      >
        {text}
      </button>
      
    </div>
    
  );
};

export default CapsuleButton;
