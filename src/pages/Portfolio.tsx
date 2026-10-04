import React, { useState, useEffect } from "react";
import Nav from "../components/nav";
import Footer from "../components/footer";
import PortoSlide from "../components/porto_slide";
import Hero from "../assets/hero.png";
import FlowerCat from "../assets/flower_cat.png";
import LoadingSpinner from "../components/loading";
import CapsuleButton from "../components/capsule_button";
import PopTitle from "../components/pop_title";
import {
  CarouselData,
  Category,
  ImageData,
  fetchCategories,
  fetchAllImages,
  fetchCrouselItems,
} from "../Api";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiEye } from "react-icons/hi";

const Portfolio: React.FC = () => {
  const [carousel, setCarousel] = useState<CarouselData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolioData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesData, imagesData, carouselData] = await Promise.allSettled([
          fetchCategories(),
          fetchAllImages(),
          fetchCrouselItems(),
        ]);

        if (categoriesData.status === "fulfilled") {
          setCategories(categoriesData.value);
        }
        if (imagesData.status === "fulfilled") {
          setImages(Array.isArray(imagesData.value) ? imagesData.value : []);
        }
        if (carouselData.status === "fulfilled") {
          setCarousel(Array.isArray(carouselData.value) ? carouselData.value : []);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal memuat portofolio");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  const filteredImages = selectedCategory
    ? images.filter(
        (img) => img.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : images;

  // Filter carousel items with at least one image url
  const validCarouselItems = carousel.filter((item) => Boolean(item.main_url));

  return (
    <div className="relative bg-pink flex flex-col min-h-screen text-black-100">
      <Nav text="MY PORTFOLIO" />

      <main className="grow max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        {error && (
          <div className="p-4 bg-white border-2 border-red rounded-2xl text-red font-bold shadow-md">
            {error}
          </div>
        )}
        {/* Unified 3D Layered Card: Desktop Right-Side Crack / Mobile Bottom Crack */}
        <div className="relative border-3 border-black-200 rounded-3xl shadow-[8px_8px_0px_#1c1c1c] overflow-hidden bg-yellow-100 flex flex-col md:flex-row">
          {/* Lapisan Atas (Top White Layer: Avatar di Kiri, Judul di Kanan) */}
          <div className="relative z-20 bg-white p-4 sm:p-6 md:p-8 pb-5 sm:pb-6 md:pb-8 flex flex-row items-center gap-3.5 sm:gap-6 w-full md:w-7/12 shrink-0">
            {/* Avatar Lebih Besar di Kiri */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl md:rounded-3xl bg-yellow-100 border-2.5 md:border-3 border-black-200 shadow-md p-1.5 md:p-2 flex items-center justify-center overflow-hidden transform -rotate-2">
                <img src={Hero} alt="Marugo Avatar" className="w-full h-full object-contain" />
              </div>
              <img
                src={FlowerCat}
                alt="Decoration Cat"
                className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>

            {/* Judul di Kanan dengan Indentasi Playful */}
            <div className="flex flex-col grow justify-center leading-none select-none">
              <PopTitle as="span" text="Koleksi" className="text-3xl sm:text-4xl md:text-5xl transform -rotate-1" />
              <PopTitle as="span" text="Karya" className="text-3xl sm:text-4xl md:text-5xl ml-3.5 sm:ml-5 md:ml-6 transform rotate-1" />
              <div className="ml-7 sm:ml-10 md:ml-12 transform -rotate-1">
                <PopTitle as="span" text="Ilustrasi" className="text-3xl sm:text-4xl md:text-5xl" sparkle={true} />
              </div>
            </div>

            {/* Desktop: Seamless Natural Cookie Fracture on the Right Edge */}
            <div className="hidden md:block absolute -right-7 top-0 bottom-0 w-8 z-30 pointer-events-none overflow-visible">
              <svg
                viewBox="0 0 32 600"
                preserveAspectRatio="none"
                className="h-full w-8 block overflow-visible"
              >
                <path
                  d="M0,0 L20,0 C15,35 8,55 7,75 C18,105 26,130 25,150 C12,175 6,200 8,225 C23,260 28,290 26,310 C15,340 7,365 9,390 C24,425 27,455 25,480 C14,510 6,535 8,560 C20,580 25,595 18,600 L0,600 Z"
                  fill="#ffffff"
                />
                <path
                  d="M20,0 C15,35 8,55 7,75 C18,105 26,130 25,150 C12,175 6,200 8,225 C23,260 28,290 26,310 C15,340 7,365 9,390 C24,425 27,455 25,480 C14,510 6,535 8,560 C20,580 25,595 18,600"
                  fill="none"
                  stroke="#0d0d0d"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              {/* Remahan biskuit desktop */}
              <div className="absolute top-12 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-200 border-2 border-black-200" />
              <div className="absolute top-28 -right-2 w-2 h-2 rounded-full bg-black-200" />
              <div className="absolute top-52 -right-1.5 w-3 h-2 rounded-sm bg-yellow-200 border-2 border-black-200 rotate-12" />
              <div className="absolute top-72 -right-2 w-2 h-2 rounded-full bg-black-200" />
              <div className="absolute top-96 -right-1 w-2 h-2 rounded-full bg-yellow-200 border-2 border-black-200" />
            </div>

            {/* Mobile: Seamless Natural Cookie Fracture directly attached to bottom of white card */}
            <div className="md:hidden absolute -bottom-5 left-0 right-0 w-full pointer-events-none z-30 overflow-visible">
              <svg
                viewBox="0 0 1000 24"
                preserveAspectRatio="none"
                className="w-full h-5 sm:h-6 block overflow-visible"
              >
                {/* White body extension */}
                <path
                  d="M-4,-2 L-4,14 C50,4 100,22 160,12 C220,4 280,22 340,14 C400,4 460,22 520,12 C580,4 640,22 700,14 C760,4 820,22 880,12 C940,4 980,18 1004,12 L1004,-2 Z"
                  fill="#ffffff"
                />
                {/* Clean crack line */}
                <path
                  d="M-4,14 C50,4 100,22 160,12 C220,4 280,22 340,14 C400,4 460,22 520,12 C580,4 640,22 700,14 C760,4 820,22 880,12 C940,4 980,18 1004,12"
                  fill="none"
                  stroke="#0d0d0d"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              {/* Remahan biskuit mobile */}
              <div className="absolute top-1 left-12 w-2 h-2 rounded-full bg-yellow-200 border border-black-200" />
              <div className="absolute top-2.5 left-36 w-1.5 h-1.5 rounded-full bg-black-200" />
              <div className="absolute top-1 right-20 w-2 h-2 rounded-full bg-yellow-200 border border-black-200" />
              <div className="absolute top-2.5 right-6 w-1.5 h-1.5 rounded-full bg-black-200" />
            </div>
          </div>

          {/* Lapisan Bawah: Baki Kategori Kuning Bersih Tanpa Garis Gradien Gelap */}
          <div className="relative z-10 bg-yellow-100 p-4 sm:p-6 md:p-8 pt-6 sm:pt-7 md:pt-8 flex flex-col justify-center grow md:pl-11">
            {/* Desktop only crevice shadow */}
            <div className="hidden md:block absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black-200/30 to-transparent pointer-events-none" />

            {/* Tombol-tombol dengan aneka ukuran biskuit yang dinamis */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 relative z-10">
              <CapsuleButton
                onClick={() => setSelectedCategory(null)}
                className={`text-xs sm:text-sm md:text-base px-4.5 sm:px-6 py-1.5 sm:py-2 transition-transform hover:scale-105 ${
                  selectedCategory === null
                    ? "bg-orange text-black-100"
                    : "bg-white text-gray-700 hover:bg-yellow-200"
                }`}
                containerClassName="transform -rotate-1 hover:rotate-0 transition-transform"
              >
                Semua Karya ({images.length})
              </CapsuleButton>

              {categories.map((cat, idx) => {
                const count = images.filter(
                  (img) => img.category?.toLowerCase() === cat.name.toLowerCase()
                ).length;
                const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();

                const sizeVariants = [
                  {
                    btnClass: "text-xs sm:text-sm px-3 sm:px-4.5 py-1 sm:py-1.5",
                    containerClass: "transform rotate-2 hover:rotate-0 transition-transform",
                  },
                  {
                    btnClass: "text-xs sm:text-base px-3.5 sm:px-5 py-1 sm:py-2",
                    containerClass: "transform -rotate-2 hover:rotate-0 transition-transform",
                  },
                  {
                    btnClass: "text-xs px-2.5 sm:px-3.5 py-1",
                    containerClass: "transform rotate-1 hover:rotate-0 transition-transform",
                  },
                  {
                    btnClass: "text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5",
                    containerClass: "transform -rotate-1 hover:rotate-0 transition-transform",
                  },
                ];
                const variant = sizeVariants[idx % sizeVariants.length];

                return (
                  <CapsuleButton
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`${variant.btnClass} ${
                      isSelected
                        ? "bg-orange text-black-100 scale-105"
                        : "bg-white text-gray-700 hover:bg-yellow-200"
                    }`}
                    containerClassName={variant.containerClass}
                  >
                    {cat.name} ({count})
                  </CapsuleButton>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Carousel Slider (If carousel items are configured) */}
        {validCarouselItems.length > 0 && (
          <div className="w-full">
            <div className="mb-3 text-center">
              <h2 className="font-londrina text-3xl text-white drop-shadow-sm">
                Sorotan Utama (Featured)
              </h2>
            </div>
            <Swiper
              loop={validCarouselItems.length > 1}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              slidesPerView={1}
              effect={"fade"}
              navigation={true}
              pagination={{ clickable: true }}
              modules={[EffectFade, Navigation, Pagination, Autoplay]}
              className="w-full pb-8"
            >
              {validCarouselItems.map((item) => (
                <SwiperSlide key={item.id} className="flex justify-center items-center">
                  <PortoSlide
                    text={item.category}
                    mainImg={item.main_url}
                    leftImg={item.left_url}
                    rightImg={item.right_url}
                    description={item.description}
                    altText={item.alt_text}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        {/* Section 4: Main Gallery Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-12 h-12">
              <LoadingSpinner />
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white/80 border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center flex flex-col items-center gap-3">
            <h3 className="font-londrina text-3xl text-black-100">Belum Ada Karya</h3>
            <p className="font-school text-gray-500 text-lg">
              {selectedCategory
                ? `Belum ada ilustrasi di kategori "${selectedCategory}".`
                : "Belum ada karya ilustrasi yang di-upload ke portofolio."}
            </p>
            {selectedCategory && (
              <CapsuleButton
                onClick={() => setSelectedCategory(null)}
                className="bg-blue text-white"
              >
                Lihat Semua Kategori
              </CapsuleButton>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layoutId={`porto-${image.id}`}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setSelectedImage(image)}
                className="group bg-white border-2 border-black-200 rounded-3xl overflow-hidden shadow-lg cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black-100 font-bold rounded-full text-xs shadow-md">
                      <HiEye className="text-base" />
                      <span>Perbesar</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between grow gap-2 font-desc">
                  <div>
                    <span className="text-xs bg-yellow-200 text-black-100 font-bold px-2.5 py-0.5 rounded-full border border-black-200 inline-block mb-1">
                      {image.category || "Illustration"}
                    </span>
                    <h3 className="font-londrina text-2xl text-black-100 truncate" title={image.name}>
                      {image.name}
                    </h3>
                    {image.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Zoom Gambar */}
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
                    {selectedImage.category || "Illustration"}
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
                    onClick={() => setSelectedImage(null)}
                    className="bg-gray-200 hover:bg-gray-300"
                  >
                    Tutup
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

export default Portfolio;
