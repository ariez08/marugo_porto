import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode; // Tipe untuk konten anak di dalam komponen
  className?: string; // className bersifat opsional
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className="relative">
      {/* Stack Kartu di Belakang */}
      <div
        className={`absolute left-3 w-full h-full rounded-full opacity-60 -z-60 ${className}`}
      ></div>

      {/* Kartu Utama */}
      <div className={`relative rounded-full p-4 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
