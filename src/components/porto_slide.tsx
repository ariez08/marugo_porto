import React from "react";

interface PortoSlideProps {
  text: string;
  mainImg?: string;
  leftImg?: string;
  rightImg?: string;
  description?: string;
  altText?: string;
}

const PortoSlide: React.FC<PortoSlideProps> = ({
  text,
  mainImg,
  leftImg,
  rightImg,
  description,
  altText,
}) => {
  return (
    <div className="relative mx-auto my-2 p-4 md:p-6 rounded-3xl bg-yellow-100 border-3 border-black-200 shadow-[4px_4px_0px_#1c1c1c] w-full max-w-4xl">
      {/* Category Badge Header */}
      <div className="flex justify-center mb-3">
        <span className="font-londrina text-2xl md:text-3xl text-black-100 bg-white px-6 py-1 rounded-full border-2 border-black-200 shadow-[2px_2px_0px_#1c1c1c]">
          {text}
        </span>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-center p-2">
        {leftImg && (
          <div className="hidden md:flex justify-end items-center">
            <img
              src={leftImg}
              alt="Left Preview"
              className="w-28 h-36 object-cover rounded-2xl border-2 border-black-200 shadow-md transform -rotate-3"
            />
          </div>
        )}

        <div className={`flex flex-col items-center justify-center ${leftImg && rightImg ? "md:col-span-2" : "md:col-span-4"}`}>
          {mainImg ? (
            <div className="relative rounded-2xl overflow-hidden border-3 border-black-200 shadow-lg bg-white">
              <img
                src={mainImg}
                alt={altText || text}
                className="max-h-[50vh] w-auto object-contain"
              />
            </div>
          ) : (
            <div className="h-48 w-full rounded-2xl border-2 border-dashed border-gray-300 bg-white/60 flex flex-col items-center justify-center p-4">
              <span className="font-school text-lg text-gray-500">Karya Unggulan {text}</span>
            </div>
          )}

          {description && (
            <p className="font-desc text-sm text-gray-600 mt-3 text-center max-w-md">
              {description}
            </p>
          )}
        </div>

        {rightImg && (
          <div className="hidden md:flex justify-start items-center">
            <img
              src={rightImg}
              alt="Right Preview"
              className="w-28 h-36 object-cover rounded-2xl border-2 border-black-200 shadow-md transform rotate-3"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PortoSlide;
