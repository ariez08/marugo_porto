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
import LoadingSpinner from "../components/loading";

const Collection = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImages, setShowImages] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    console.log("Auth val: ",isAuthenticated)
    return <Navigate to="/im-not-supposed-here" replace />;
  }

  const handleShowImages = async () => {
    setLoading(true);
    setError(null); // Reset galat sebelumnya
    try {
      const data = await fetchAllImages();
      // Validasi apakah data yang diterima adalah sebuah array
      if (Array.isArray(data)) {
        setImages(data);
      } else {
        // Jika bukan array, set state menjadi array kosong untuk mencegah galat
        setImages([]);
        console.error("Data yang diterima dari API bukan sebuah array:", data);
        setError('Gagal memuat gambar: format data tidak valid.');
      }
    } catch (err: any) {
      setImages([]); // Pastikan tetap array kosong jika terjadi galat
      setError(err.message || 'Gagal memuat gambar');
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
      <div className="grow">
        <div className="m-4">
          <button 
              onClick={() => setShowUploadForm(true)} 
              className="px-4 py-2 bg-blue text-white rounded-sm cursor-pointer"
            >
              Upload Image
          </button>
          <button 
            onClick={handleShowImages} 
            disabled={showImages}
            className={`mx-1 px-4 rounded-sm ${showImages ? 'bg-gray-200 cursor-not-allowed opacity-80 py-1' : 'bg-green text-white py-2 cursor-pointer'}`}
            >
            Show
          </button>
          <button 
            onClick={handleHideImages} 
            disabled={!showImages}
            className={`mx-1 px-4 rounded-sm ${!showImages ? 'bg-gray-200 cursor-not-allowed opacity-80 py-1' : 'bg-red text-white py-2 cursor-pointer'}`}
            >
            Hide
          </button>
        </div>
      
        {error && <div>{error}</div>}

        {showImages && (
          <div 
            className="mx-4 p-4 overflow-y-scroll overflow-x-hidden md:h-[60vh] md:w-[65vw] grid lg:grid-cols-4 sm:grid-cols-3 ssm:grid-cols-2 gap-8 border-4 border-white rounded-lg" 
            style={{ gridAutoRows: "60%" }}
          >
            {loading ? (
              <div className="w-6 h-6"><LoadingSpinner/></div>
            ) : (
              images.map((image) => (
                <motion.div 
                  id="imageCard" 
                  key={image.id} 
                  className="relative cursor-pointer" 
                  layoutId={`image-${image.id}`} // Shared layout ID
                  onClick={() => handleImageClick(image)}
                >
                  <motion.img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full rounded-sm shadow-sm object-cover bg-white"
                    whileHover={{ scale: 1.1 }}
                  />
                  {/* <div className="absolute top-1 w-6 h-6 -z-1"><LoadingSpinner/></div> */}
                  <div className="absolute top-1 right-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the image click event
                        handleDelete(image.id);
                      }} 
                      className="px-2 py-1 bg-red text-white text-xs rounded-sm hover:opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="bg-black-100/50 rounded-full">
                    <h3 className="text-center text-sm capitalize font-name text-white text-nowrap mt-1 font-medium">{image.name}</h3>
                  </div>
                  
                </motion.div>
              ))
            )}
          </div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-60">
              <motion.div 
                className="relative bg-yellow-100 rounded-md shadow-2xl shadow-blue p-4 pr-8 md:max-w-5xl flex md:flex-row ssm:flex-col border-4 border-yellow-200"
                layoutId={`image-${selectedImage.id}`} // Shared layout ID
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="md:max-w-3xl ssm:max-w-[80vw] md:max-h-[90vh] ssm:max-h-[50vh] object-contain rounded-lg border-2 border-green bg-linear-to-r from-purple-100 to-purple-200"
                />
                <div className="ml-4 ssm:m-3 flex flex-row md:flex-col justify-between">
                  <div className="m-2">
                    <h2 className="m-1 px-1 rounded-md place-self-end font-bold font-name text-yellow-200 bg-green w-fit">{selectedImage.category}</h2>
                    <div className="p-2 bg-white rounded-xl">
                      <h2 className="text-xl font-bold mb-1 ml-1 capitalize font-name">{selectedImage.name}</h2>
                      <p className="px-2 py-1 text-sm bg-white-300 rounded-lg">{selectedImage.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      handleDelete(selectedImage.id);
                      setSelectedImage(null);
                    }} 
                    className="w-min h-min px-4 py-2 bg-red text-white rounded-full hover:bg-red-700 m-2 cursor-pointer"
                  >
                    Delete
                  </button>
                  <HiX onClick={() => setSelectedImage(null)} className='absolute text-red text-xl font-bold right-2 top-2 cursor-pointer rounded-full bg-white'/>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {showUploadForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70">
            <div className="bg-white p-6 rounded-sm shadow-lg w-96">
              <ImageUploadForm />
              <button 
                onClick={() => {
                  setShowUploadForm(false)
                  handleShowImages()
                }} 
                className="mt-4 px-4 py-2 bg-red text-white rounded-sm"
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
