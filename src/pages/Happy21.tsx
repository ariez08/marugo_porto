import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Nav from "../components/nav";
import Footer from "../components/footer";
import CapsuleButton from "../components/capsule_button";

import GiftImg from "../assets/gift-box.png";
import HBDAudio from "../assets/media/hbd-marble.mp3";

import BirthdayGirl from "../assets/keca-meng.jpg";
import DecoPNG1 from "../assets/mangca-ijo.jpg";
import DecoPNG2 from "../assets/mangca-touch.jpg";
import DecoPNG3 from "../assets/mang-smel.jpg";
import DecoPNG4 from "../assets/mang-love.jpg";

import LeftGift from "../assets/manggit-keca.gif";
import RightGift from "../assets/mangca-joget.gif";

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
    const TARGET = 20;      // jumlah klik cepat yang dibutuhkan

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
            setTimeout(() => setAudioReady(true), 1500);
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

    // ====== POSISI ACAK UNTUK DEKORASI SUDUT ======
    const topLeftOffsetVW    = useMemo(() => 5 + Math.random() * 10, []);  // 5–15vw dari kiri
    const topRightOffsetVW   = useMemo(() => 5 + Math.random() * 10, []);  // 2–12vw dari kanan
    const bottomLeftOffsetVW = useMemo(() => 5 + Math.random() * 10, []);
    const bottomRightOffsetVW= useMemo(() => 5 + Math.random() * 10, []);

    type Particle = { id: number; xPct: number; emoji: "❤️" | "✨" };
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdRef = useRef(0);

    function spawnParticles(n = 4) {
    const batch: Particle[] = Array.from({ length: n }).map(() => ({
        id: ++particleIdRef.current,
        xPct: Math.random() * 100, // posisi X relatif kontainer frame
        emoji: Math.random() < 0.5 ? "❤️" : "✨",
    }));
    setParticles((p) => [...p, ...batch]);
    }

    function removeParticle(id: number) {
        setParticles((p) => p.filter((it) => it.id !== id));
    }


    useEffect(() => {
        if (audioReady && audioRef.current) {
        audioRef.current.play().catch(() => {
            // beberapa browser mungkin blok; kamu bisa munculkan tombol "Putar Musik" kalau mau
        });
        }
    }, [audioReady]);

    useEffect(() => {
        if (!showMessage) return;

        const tick = () => {
            if (document.visibilityState === "visible") {
            spawnParticles(2);
            }
        };

        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, [showMessage]);

    return (
        <div className="relative bg-pink flex flex-col min-h-screen">
        <Nav text="Happy Birthday" />

        <div className="relative grow flex flex-col items-center justify-center overflow-hidden m-2">
            <img
                src={DecoPNG1}
                alt="dekorasi"
                className="pointer-events-none select-none absolute top-1 left-0 translate-x-[-50%] w-24 h-24 object-contain opacity-90 rounded-2xl"
                style={{ left: `${topLeftOffsetVW}vw` }}
            />
            <img
                src={DecoPNG4}
                alt="dekorasi"
                className="pointer-events-none select-none absolute top-1 right-0 translate-x-[50%] w-24 h-24 object-contain opacity-90 rounded-2xl"
                style={{ right: `${topRightOffsetVW}vw` }}
            />

            <img
                src={DecoPNG3}
                alt="dekorasi"
                className="pointer-events-none select-none absolute bottom-1 left-0 translate-x-[-50%] w-24 h-24 object-contain opacity-90 rounded-2xl"
                style={{ left: `${bottomLeftOffsetVW}vw` }}
            />
            <img
                src={DecoPNG2}
                alt="dekorasi"
                className="pointer-events-none select-none absolute bottom-1 right-0 translate-x-[50%] w-24 h-24 object-contain opacity-90 rounded-2xl"
                style={{ right: `${bottomRightOffsetVW}vw` }}
            />

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
                    Spam klik ada surprise~ 👀✨
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
                        className="w-[220px] h-[220px] object-contain p-2 rounded-3xl ring-4 ring-yellow-100"
                    />

                    {/* Counter */}
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white font-semibold">
                    {/* {clickCount}/{TARGET} */}
                    </span>
                </motion.div>
                </motion.button>
            )}
            </AnimatePresence>

            {/* Pesan Ulang Tahun */}
            <AnimatePresence>
            {showMessage && (
                <div className="relative rounded-3xl bg-white/95 p-6 border border-pink shadow-lg max-w-4xl w-full mx-4 md:my-1 ssm:my-32">
                    {/* FRAME PINK DI DALAM CARD PUTIH */}
                    <motion.div
                        className="relative rounded-2xl border-4 border-pink/80 p-5 bg-pink/20"
                        onMouseEnter={() => spawnParticles(3)}
                        onClick={() => spawnParticles(5)}
                        whileHover={{ rotate: [-0.3, 0.3, 0], x: [0, 2, 0] }}
                        whileTap={{ scale: 0.98, rotate: 0.3 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    >
                        {/* Konten teks (di atas emoji) */}
                        <div className="relative z-10">
                        <h2 className="text-center font-school text-3xl md:text-4xl text-pink font-bold">
                            Selamat Ulang Tahun ke-21 Keca Cantik 🎂🎉
                        </h2>
                        <p className="mt-3 text-center text-pink bg-white/80 p-4 rounded-xl font-medium md:text-lg ssm:text-sm">
                            Semoga halaman kecik ini bisa buat keca sedikit terhibur di hari spesial keca. <br /> <hr />
                            Dimas paham ulang tahun kali ini agak jauh dari harapan keca, tapi Dimas selalu berharap keca bisa selalu bahagia, sehat, dan punya kehidupan yang lebih baik. <br /> <hr />
                            Dimas mau bilang, terima kasih cantik ya udah jadi pacar Imang yang paling sabar, paling pengertian, paling selalu ada pas Imang butuh <br /> <hr />
                            I love you so much more, keca. Dimas sayang banget sama keca 🥹❤️
                        </p>

                        {/* Placeholder GIF/IMG — ganti src sesuai kebutuhan */}
                        <div className="mt-5 grid grid-cols-3 gap-3">
                            <div className="aspect-square rounded-2xl bg-pink/40 grid place-items-center text-pink-400">
                                <img src={LeftGift} alt="Left Gift" className="w-64 h-64 object-contain rounded-2xl" />
                            </div>
                            <div className="aspect-square rounded-2xl grid place-items-center">
                                <img src={BirthdayGirl} alt="" className="w-64 h-64 object-contain rounded-2xl"/>
                            </div>
                            <div className="aspect-square rounded-2xl bg-pink/40 grid place-items-center text-pink-400">
                                <img src={RightGift} alt="Right Gift" className="w-64 h-64 object-contain rounded-2xl" />
                            </div>
                        </div>
                        </div>

                        {/* LAYER PARTIKEL EMOJI (di bawah konten, di atas background frame) */}
                        <div className="pointer-events-none absolute inset-0 overflow-visible z-0">
                            {particles.map((p) => (
                                <motion.span
                                key={p.id}
                                className="absolute text-2xl"
                                style={{ left: `${p.xPct}%` }}
                                initial={{ y: -10, opacity: 0, rotate: 0 }}
                                animate={{ y: 140, opacity: [0, 1, 0.6, 0], rotate: [0, 10, -10] }}
                                transition={{ duration: 1.2, ease: "easeIn" }}
                                onAnimationComplete={() => removeParticle(p.id)}
                                >
                                {p.emoji}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Emoji dekoratif melayang di atas frame (loop) */}
                    <div className="relative mt-2">
                        {[..."💐🌸🌷💖✨🥳🎀"].map((e, i) => (
                            <motion.span
                            key={`float-${i}`}
                            className="absolute text-2xl select-none"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 1, 0], y: [-10, -30, -60, -90] }}
                            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                            style={{ left: `${8 + i * 12}%`, top: "-0.5rem" }}
                            >
                            {e}
                            </motion.span>
                        ))}
                    </div>


                    {/* Tombol ulangi + kembali bersebelahan */}
                    <div className="mt-5 flex justify-center gap-3 flex-wrap">
                        <CapsuleButton
                            onClick={resetGame}
                            className="inline-flex items-center gap-2 rounded-full bg-pink text-white px-4 py-2 font-bold hover:bg-pink/50"
                            aria-label="Ulangi kejutan"
                            text="Mau Klik Kado Lagi 😣"
                        />
                        <CapsuleButton
                            text="Kembali"
                            className="bg-white"
                            to="/"
                        />
                    </div>

                </div>
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


