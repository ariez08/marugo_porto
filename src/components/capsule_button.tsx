import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface CapsuleButtonProps {
  text?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  to?: string;
  className?: string;
  containerClassName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CapsuleButton: React.FC<CapsuleButtonProps> = ({
  text,
  children,
  onClick,
  to,
  className = "",
  containerClassName = "",
  type = "button",
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={`relative inline-block ${containerClassName}`}>
      {/* Bayangan Button - Pop-Brutalist hard shadow */}
      <div className="absolute top-2 left-2.5 w-full h-full rounded-full bg-black-100 opacity-85 z-0 pointer-events-none" />

      <button
        type={type}
        disabled={disabled}
        onClick={handleClick}
        className={`relative z-10 px-6 py-1.5 text-sm font-bold text-nowrap text-black-100 ${className} border border-black-200 rounded-full hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
      >
        {children || text}
      </button>
    </div>
  );
};

export default CapsuleButton;
