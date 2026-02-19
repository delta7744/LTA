"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";
import BrandedLoader from "./branded-loader";

const FALLBACK_SLIDES: BannerSlide[] = [
  {
    _id: "fallback-1",
    title: "Luxury Travel Redefined",
    subTitle: "Experience the pinnacle of hospitality with LTA's curated hotel selections.",
    image: "/assests/hotels.jpg",
    link: "/hotels"
  },
  {
    _id: "fallback-2",
    title: "Global Flight Network",
    subTitle: "Seamless connections to over 500 destinations worldwide.",
    image: "/assests/flight.jpg",
    link: "/flights"
  }
];

const SLIDE_DURATION = 8000;

interface BannerSlide {
  _id: string;
  title: string;
  subTitle: string;
  image: string;
  link: string;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch slides from API
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchSlides() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const res = await fetch(`${baseUrl}/banner`, {
          signal: controller.signal,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch slides");
        const data = await res.json();
        const apiSlides = data.data || [];
        setSlides(apiSlides.length > 0 ? apiSlides : FALLBACK_SLIDES);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn("Fetch timed out, using fallback");
        } else {
          console.error("Failed to fetch slides, using fallback:", error);
        }
        setSlides(FALLBACK_SLIDES);
      } finally {
        clearTimeout(timeoutId);
      }
    }
    fetchSlides();
    return () => clearTimeout(timeoutId);
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  // Progress logic
  useEffect(() => {
    if (!isPlaying || slides.length === 0) {
      if (progressTimer.current) clearInterval(progressTimer.current);
      return;
    }

    const interval = 50; // Update every 50ms
    const increment = (interval / SLIDE_DURATION) * 100;

    progressTimer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [isPlaying, slides.length, nextSlide]);

  if (slides.length === 0) {
    return <BrandedLoader />;
  }

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-black">
      {/* Background Slides with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Ken Burns Effect Image */}
          <motion.div
            initial={{ scale: 1.1, x: "-2%", y: "-2%" }}
            animate={{ scale: 1.25, x: "2%", y: "2%" }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
            className="absolute inset-0"
          >
            <img
              src={slide.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80"}
              alt={slide.title}
              className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
            />
          </motion.div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-lta-purple/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Flight Path Motif Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, delay: 1 }}
              d="M-10,80 C20,20 80,120 110,20"
              fill="none"
              stroke="white"
              strokeWidth="0.2"
              strokeDasharray="1 2"
            />
          </svg>
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="relative z-10 container h-full flex items-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-lta-orange" />
            <span className="text-lta-orange font-bold tracking-[0.3em] uppercase text-sm md:text-base">
              {currentSlide === 0 ? "Premium Experience" : slide.subTitle}
            </span>
          </motion.div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              key={`h1-${currentSlide}`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "circOut", delay: 0.7 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
            >
              {currentSlide === 0 ? "Leader Travel Agency" : slide.title}
            </motion.h1>
          </div>

          <motion.p
            key={`p-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 leading-relaxed"
          >
            {currentSlide === 0
              ? "Discover the world with the expertise of Tunisia's leading travel specialists. Unforgettable journeys tailored just for you."
              : slide.subTitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="flex flex-wrap gap-6"
          >
            <Link
              href={slide.link || "/tours"}
              className="group relative px-8 py-4 bg-lta-purple text-white rounded-full font-bold overflow-hidden shadow-2xl transition-all hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Exploring <ExternalLink className="w-4 h-4 text-lta-orange" />
              </span>
              <div className="absolute inset-0 bg-lta-orange translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link
              href="#services"
              className="px-8 py-4 border border-white/30 text-white rounded-full font-bold backdrop-blur-sm hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Our Services
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Modern Controls */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-20">
        <button
          onClick={prevSlide}
          className="p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-lta-purple hover:border-lta-purple transition-all group"
        >
          <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>

        <div className="flex flex-col gap-4 items-center py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="group relative px-3"
            >
              <div className={`w-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? "h-6 bg-lta-orange" : "h-1.5 bg-white/30 group-hover:h-3 group-hover:bg-white/60"}`} />
            </button>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-lta-purple hover:border-lta-purple transition-all group"
        >
          <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-20">
        <motion.div
          className="h-full bg-lta-orange"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Play/Pause & Counter */}
      <div className="absolute bottom-10 left-8 md:left-16 flex items-center gap-6 z-20">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="text-xs font-black tracking-widest uppercase">
            {isPlaying ? "Autoplay On" : "Autoplay Paused"}
          </span>
        </button>

        <div className="h-4 w-px bg-white/20" />

        <div className="text-white/40 font-mono text-sm tracking-tighter">
          <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, "0")}</span>
          <span className="mx-1">/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Background Decorative Rings */}
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 border border-lta-orange/5 rounded-full pointer-events-none" />
    </div>
  );
}
