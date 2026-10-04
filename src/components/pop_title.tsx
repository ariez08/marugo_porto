import React, { ReactNode } from "react";

export interface PopTitleProps {
  text?: string;
  children?: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  color?: string;
  className?: string;
  sparkle?: boolean;
}

const PopTitle: React.FC<PopTitleProps> = ({
  text,
  children,
  as: Component = "h1",
  color = "text-pink",
  className = "",
  sparkle = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2">
      <Component
        className={`font-londrina-solid font-black text-5xl md:text-6xl ${color} tracking-wide drop-shadow-[3px_3px_0px_#1c1c1c] ${className}`}
      >
        {children || text}
      </Component>
      {sparkle && (
        <span className="text-3xl text-yellow-200 select-none hidden sm:inline shrink-0" aria-hidden="true">
          ✨
        </span>
      )}
    </div>
  );
};

export default PopTitle;
