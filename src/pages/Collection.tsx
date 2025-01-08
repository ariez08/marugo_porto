// Collection.tsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllImages, ImageData, deleteImageById } from "../Api";

import Nav from "../components/nav";
import Footer from "../components/footer";
import ImageUploadForm from "../components/image_form";

const Collection = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImages, setShowImages] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    const isLoggingOut = localStorage.getItem("isLoggingOut") === "true";
    console.log("isLoggingOut", isLoggingOut)
    if (localStorage.getItem("isLoggingOut") === "true") {
      // localStorage.removeItem("isLoggingOut"); // Clear the temporary flag
      localStorage.setItem("isAuthenticated", "false");
      return <Navigate to="/home" replace />;
    }
    return <Navigate to="/im-not-supposed-here" replace />;
  }

  const handleShowImages = async () => {
    setLoading(true);
    try {
      const data = await fetchAllImages();
      setImages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
      setShowImages(true);
    }
  };

  const handleHideImages = () => {
    setShowImages(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteImageById(id);
      setImages((prevImages) => prevImages.filter((image) => image.id !== id)); // Remove from state
      alert("Image deleted successfully");
      if (selectedImage?.id === id) setSelectedImage(null); // Close modal if the deleted image is open
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
  };

  return (
    <div className="relative bg-pink flex flex-col min-h-screen">
      <Nav text="Collection & Upload"/>

      <div className="flex-grow">
        <div className="m-4">
          <button 
              onClick={() => setShowUploadForm(true)} 
              className="px-4 py-2 bg-blue text-white rounded"
            >
              Upload Image
          </button>
          <button 
            onClick={handleShowImages} 
            disabled={showImages}
            className={`mx-1 px-4 rounded ${showImages ? 'bg-gray-200 cursor-not-allowed opacity-80 py-1' : 'bg-green text-white py-2'}`}
            >
            Show
          </button>
          <button 
            onClick={handleHideImages} 
            disabled={!showImages}
            className={`mx-1 px-4 rounded ${!showImages ? 'bg-gray-200 cursor-not-allowed opacity-80 py-1' : 'bg-red text-white py-2'}`}
            >
            Hide
          </button>
        </div>
      
        {error && <div>{error}</div>}

        {showImages && (
          <div 
            className="mx-4 p-4 overflow-y-scroll overflow-x-hidden h-[500px] w-1/2 grid grid-cols-4 gap-8 border-4 border-white rounded-lg" 
            style={{ gridAutoRows: "70%" }}
          >
            {loading ? (
              <div>Loading...</div>
            ) : (
              images.map((image) => (
                <motion.div 
                  id="imageCard" 
                  key={image.id} 
                  className="group relative cursor-pointer" 
                  layoutId={`image-${image.id}`} // Shared layout ID
                  onClick={() => handleImageClick(image)}
                >
                  <motion.img
                    src={image.image}
                    alt={image.name}
                    className="w-full h-full rounded shadow object-cover bg-white"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="absolute top-1 right-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the image click event
                        handleDelete(image.id);
                      }} 
                      className="px-2 py-1 bg-red text-white text-xs rounded hover:opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="bg-black-100 bg-opacity-50 rounded-full">
                    <h3 className="text-center text-sm capitalize font-name text-white text-nowrap mt-1 font-medium">{image.name}</h3>
                  </div>
                  
                </motion.div>
              ))
            )}
          </div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-60">
              <motion.div 
                className="relative bg-pink rounded shadow-xl p-4 pr-8 max-w-5xl flex"
                layoutId={`image-${selectedImage.id}`} // Shared layout ID
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img
                  src={selectedImage.image}
                  alt={selectedImage.name}
                  className="max-w-3xl max-h-[90vh] object-contain rounded-lg border-2 border-gray-300 bg-gradient-to-r from-purple-100 to-purple-200"
                />
                <div className="ml-4 flex flex-col justify-between">
                  <div className="p-2 bg-white rounded-xl">
                    <h2 className="text-xl font-bold mb-1 ml-1 capitalize font-name">{selectedImage.name}</h2>
                    <p className="px-2 py-1 text-sm bg-white-300 rounded-lg">{selectedImage.description}</p>
                  </div>
                  <button 
                    onClick={() => {
                      handleDelete(selectedImage.id);
                      setSelectedImage(null);
                    }} 
                    className="px-4 py-2 bg-red text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <HiX onClick={() => setSelectedImage(null)} className='absolute text-red text-xl font-bold right-2 top-2 cursor-pointer'/>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {showUploadForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <ImageUploadForm />
              <button 
                onClick={() => setShowUploadForm(false)} 
                className="mt-4 px-4 py-2 bg-red text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Collection;
