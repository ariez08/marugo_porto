import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { HiX, HiPlus, HiPhotograph, HiEye } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllImages, ImageData, deleteImageById } from "../Api";

import Nav from "../components/nav";
import Footer from "../components/footer";
import ImageUploadForm from "../components/image_form";
import LoadingSpinner from "../components/loading";
import CapsuleButton from "../components/capsule_button";
import PopTitle from "../components/pop_title";

const Collection: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllImages();
      setImages(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setImages([]);
      setError(err instanceof Error ? err.message : "Gagal memuat gambar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadImages();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="relative min-h-screen bg-pink flex items-center justify-center">
        <div className="w-12 h-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleDelete = async (image: ImageData) => {
    const confirmed = window.confirm(`Hapus ilustrasi "${image.name}"?`);
    if (!confirmed) return;

    setDeletingId(image.id);
    try {
      await deleteImageById(image.id);
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      if (selectedImage?.id === image.id) {
        setSelectedImage(null);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus gambar");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative bg-pink flex flex-col min-h-screen text-black-100">
      <Nav text="KOLEKSI ILUSTRASI" />

      <main className="grow max-w-6xl w-full mx-auto p-4 md:p-8">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-2 border-black-200 rounded-3xl p-6 shadow-lg mb-8">
          <div>
            <PopTitle text="Galeri Koleksi" className="text-4xl md:text-5xl" />
          </div>

          <CapsuleButton
            onClick={() => setShowUploadModal(true)}
            className="bg-yellow-200 hover:bg-yellow-100 flex items-center gap-2"
          >
            <HiPlus className="text-lg" />
            <span>Upload Gambar</span>
          </CapsuleButton>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-white border-2 border-red rounded-2xl text-red font-bold">
            {error}
          </div>
        )}

        {/* Grid Gambar */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-12 h-12">
              <LoadingSpinner />
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xs border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-black-100 text-4xl">
              <HiPhotograph />
            </div>
            <div>
              <h3 className="font-londrina text-3xl text-black-100">Koleksi Masih Kosong</h3>
              <p className="font-school text-gray-500 text-lg mt-1">
                Belum ada ilustrasi yang di-upload. Mulai tambahkan karya sekarang!
              </p>
            </div>
            <CapsuleButton
              onClick={() => setShowUploadModal(true)}
              className="bg-blue text-white hover:brightness-110"
            >
              Upload Karya Pertama
            </CapsuleButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <motion.div
                key={image.id}
                layoutId={`image-${image.id}`}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative bg-white border-2 border-black-200 rounded-3xl overflow-hidden shadow-lg flex flex-col"
              >
                {/* Image Container */}
                <div
                  onClick={() => setSelectedImage(image)}
                  className="relative aspect-square w-full bg-gray-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black-100 font-bold rounded-full text-xs shadow-md">
                      <HiEye className="text-base" />
                      <span>Lihat Detail</span>
                    </span>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-4 flex flex-col justify-between grow gap-2">
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="text-xs bg-yellow-200 text-black-100 font-bold px-2.5 py-0.5 rounded-full border border-black-200">
                        {image.category || "Uncategorized"}
                      </span>
                    </div>
                    <h3 className="font-londrina text-2xl text-black-100 truncate" title={image.name}>
                      {image.name}
                    </h3>
                    {image.description && (
                      <p className="font-desc text-xs text-gray-500 line-clamp-2 mt-1">
                        {image.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <CapsuleButton
                      onClick={() => setSelectedImage(image)}
                      className="bg-yellow-200 text-xs py-1 px-4"
                    >
                      Buka
                    </CapsuleButton>
                    <CapsuleButton
                      onClick={() => handleDelete(image)}
                      disabled={deletingId === image.id}
                      className="bg-red text-white text-xs py-1 px-3"
                    >
                      {deletingId === image.id ? "Menghapus..." : "Hapus"}
                    </CapsuleButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Upload Pop-up */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white border-2 border-black-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black-100 p-1 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
              <h2 className="font-londrina text-3xl mb-6 text-black-100">Upload Karya Baru</h2>

              <ImageUploadForm
                onSuccess={() => {
                  setShowUploadModal(false);
                  loadImages();
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Detail Gambar */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white border-3 border-black-200 rounded-3xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row gap-6 shadow-2xl overflow-y-auto"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 text-red bg-white rounded-full p-1 border border-black-200 hover:scale-110 transition-transform cursor-pointer z-10"
              >
                <HiX className="text-2xl" />
              </button>

              <div className="md:w-3/5 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-gray-200">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>

              <div className="md:w-2/5 flex flex-col justify-between gap-4 font-desc">
                <div>
                  <span className="inline-block text-xs font-bold bg-yellow-200 text-black-100 px-3 py-1 rounded-full border border-black-200 mb-2">
                    {selectedImage.category || "Uncategorized"}
                  </span>
                  <h2 className="font-londrina text-4xl text-black-100 mb-2">
                    {selectedImage.name}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedImage.description || "Tidak ada deskripsi untuk karya ini."}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue underline"
                  >
                    Buka File Asli
                  </a>
                  <CapsuleButton
                    onClick={() => handleDelete(selectedImage)}
                    className="bg-red text-white text-xs py-1 px-4"
                  >
                    Hapus Karya
                  </CapsuleButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Collection;
