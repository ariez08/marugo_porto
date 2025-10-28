import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Nav from "../components/nav";
import Footer from "../components/footer";
import CapsuleButton from "../components/capsule_button";

import GiftImg from "../assets/gift-box.png";
import HBDAudio from "../assets/media/hbd-marble.mp3";

const Happy21: React.FC = () => {
  // ====== GAME STATE ======
  const [clickCount, setClickCount] = useState(0);
  const [lastClickAt, setLastClickAt] = useState<number | null>(null);
  const [giftStage, setGiftStage] = useState<"idle" | "shaking" | "success" | "hidden">("idle"); 
  // idle/shaking = sebelum berhasil; success = animasi grow+fade; hidden = gift hilang

  const [showMessage, setShowMessage] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  // ====== PARAMS ======
  const MAX_GAP_MS = 700; // jeda maksimum antar klik, lebih dari ini reset
  const TARGET = 10;      // jumlah klik cepat yang dibutuhkan

  // skala mengecil seiring progress
  const scaleFactor = useMemo(() => {
    const s = 1 - Math.min(clickCount, TARGET) * 0.04; // dari 1.00 -> 0.60
    return Number(s.toFixed(2));
  }, [clickCount]);

  // goyang acak saat diklik
  function randomWiggle() {
    const r = (min: number, max: number) => Math.random() * (max - min) + min;
    return {
      x: r(-10, 10),
      y: r(-10, 10),
      rotate: r(-8, 8),
      transition: { type: "spring", stiffness: 300, damping: 10 },
    };
  }

  // reset otomatis kalau user berhenti spam
  function scheduleReset() {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => {
      setClickCount(0);
      setLastClickAt(null);
    }, MAX_GAP_MS) as unknown as number;
  }

  // handler klik pada ikon hadiah
  const onGiftClick = () => {
    const now = Date.now();
    setGiftStage("shaking");

    setClickCount(prev => {
      // terlalu lama jedanya -> reset ke klik pertama
      if (lastClickAt && now - lastClickAt > MAX_GAP_MS) {
        setLastClickAt(now);
        scheduleReset();
        return 1;
      }

      const next = prev + 1;
      setLastClickAt(now);
      scheduleReset();

      if (next >= TARGET) {
        // Berhasil: animasi grow+fade -> sembunyi -> tampil pesan -> 3 detik kemudian putar audio
        if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
        setGiftStage("success");
        setTimeout(() => {
          setGiftStage("hidden");
          setShowMessage(true);
          setTimeout(() => setAudioReady(true), 3000);
        }, 700);
      }

      return next;
    });
  };

  const resetGame = () => {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    setShowMessage(false);
    setGiftStage("idle");
    setClickCount(0);
    setLastClickAt(null);
    setAudioReady(false);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
};

  // autoplay audio setelah siap (user sudah interaction via spam)
  useEffect(() => {
    if (audioReady && audioRef.current) {
      audioRef.current.play().catch(() => {
        // beberapa browser mungkin blok; kamu bisa munculkan tombol "Putar Musik" kalau mau
      });
    }
  }, [audioReady]);

  return (
    <div className="relative bg-pink flex flex-col min-h-screen">
      <Nav text="Happy Birthday 🎉" />

      <div className="relative grow flex flex-col items-center justify-center overflow-hidden">
        {/* Instruksi di atas hadiah */}
        <AnimatePresence>
          {giftStage !== "hidden" && (
            <motion.div
              key="instruction"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 text-center px-4"
            >
              <p className="font-school text-white md:text-3xl ssm:text-xl">
                Spam klik aku untuk melihat kejutan ✨
              </p>
              <br />
              {/* <p className="text-white/90 text-sm">Klik cepat {TARGET}x tanpa jeda!</p> */}
            </motion.div>
          )}
        </AnimatePresence>

          
        {/* Ikon Kado */}
        <AnimatePresence>
          {giftStage !== "hidden" && (
            <motion.button
              key="gift"
              onClick={onGiftClick}
              className="relative select-none focus:outline-none"
              initial={{ scale: 1, opacity: 1 }}
              animate={
                giftStage === "success"
                  ? { scale: [scaleFactor, 1.3, 0.9], opacity: [1, 1, 0], transition: { duration: 0.7 } }
                  : { scale: scaleFactor, opacity: 1 }
              }
              whileTap={{ scale: 0.95 }}
              aria-label="Hadiah kejutan, klik cepat sepuluh kali"
            >
                <motion.div
                    key={clickCount}
                    animate={randomWiggle()}
                    className="relative grid place-items-center"
                >
                
                <img
                    src={GiftImg}
                    alt="Hadiah"
                    className="w-[220px] h-[220px] object-contain drop-shadow-xl rounded-3xl ring-4 ring-yellow-100"
                />

                {/* Counter */}
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white font-semibold">
                  {clickCount}/{TARGET}
                </span>
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Pesan Ulang Tahun */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              key="message"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative mt-6 w-full max-w-2xl px-4"
            >
              <div className="relative rounded-3xl bg-white/95 p-6 shadow-2xl border border-pink-100">
                <h2 className="text-center font-school text-3xl md:text-4xl text-pink-600 font-bold">
                  Selamat Ulang Tahun ke-21 Keca 😣❤️
                </h2>
                <p className="mt-3 text-center text-pink-800">
                  [Tulis ucapanmu yang lucu dan romantis di sini. Singkat, jujur, dan bikin senyum.]
                </p>

                {/* Placeholder GIF/IMG — ganti src sesuai kebutuhan */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="aspect-square rounded-2xl bg-pink-50 grid place-items-center text-pink-400">
                    GIF #1
                  </div>
                  <div className="aspect-square rounded-2xl bg-pink-50 grid place-items-center text-pink-400">
                    IMG #2
                  </div>
                  <div className="aspect-square rounded-2xl bg-pink-50 grid place-items-center text-pink-400">
                    GIF #3
                  </div>
                </div>

                <div className="pointer-events-none">
                  {[..."💐🌸🌷💖✨🥳🎀"].map((e, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-2xl select-none"
                      initial={{ opacity: 0, y: 10, x: (i - 3) * 40 }}
                      animate={{ opacity: [0, 1, 1, 0], y: [-10, -30, -50, -70] }}
                      transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
                      style={{ left: `${10 + i * 12}%`, top: "-0.5rem" }}
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Tombol ulangi */}
                <div className="mt-5 flex justify-center">
                <CapsuleButton
                    onClick={resetGame}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-pink px-4 py-2 font-bold"
                    aria-label="Ulangi kejutan"
                    text="Mau Klik Kado Lagi 😣"
                />
                </div>

              {/* Tombol kembali */}
              <div className="mt-6 flex justify-center">
                <CapsuleButton text="Kembali ke Home" className="bg-white" to="/" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AUDIO PLACEHOLDER — ganti src dengan file MP3 kamu */}
      <audio ref={audioRef} preload="auto" src={HBDAudio} loop />

      <Footer />
    </div>
  );
};

export default Happy21;
