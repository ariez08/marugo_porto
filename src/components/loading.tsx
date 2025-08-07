const LoadingSpinner = () => {
  return (
    <div className="relative justify-center items-center h-full">
      <div className="absolute m-1 w-full h-full border-4 border-yellow-200 border-dashed rounded-full motion-safe:animate-[spin_1.5s_linear_infinite]"></div>
    </div>
  );
};

export default LoadingSpinner;