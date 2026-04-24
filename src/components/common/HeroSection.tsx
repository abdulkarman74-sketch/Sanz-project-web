import React, { useState, useRef, useEffect, memo } from 'react';
import { Play, Volume2, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { SiteSettings } from '../../constants';

interface HeroSectionProps {
  settings: SiteSettings;
}

const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = settings.heroSlides.filter(s => s.enabled);
  const hasSlides = slides.length > 0;

  useEffect(() => {
    // Attempt autoplay (might be blocked by browser)
    const playAudio = async () => {
      if (audioRef.current && settings.audio.autoplay) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Autoplay blocked or load failed:", error);
          setIsPlaying(false);
        }
      }
    };
    playAudio();
  }, [settings.audio]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!hasSlides) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, hasSlides]);

  const nextSlide = () => {
    if (!hasSlides) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (!hasSlides) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const scrollToServices = (targetId: string) => {
    document.getElementById(targetId)?.scrollIntoView({behavior: 'smooth'});
  };

  if (!hasSlides) return null;

  return (
    <div className="relative w-full bg-slate-900 pt-[60px] sm:pt-[72px]">
      <audio 
        ref={audioRef} 
        loop={settings.audio.loop} 
        src={settings.audio.url} 
        preload="auto" 
      />
      
      {/* Slider Container */}
      <div 
        className="relative w-full overflow-hidden bg-slate-900"
        style={{ aspectRatio: '16/9' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image Cover */}
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 bg-slate-900/20" /> {/* Extra global darkening */}

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end pb-10 sm:pb-16 md:pb-24 px-4 sm:px-12 md:px-20 max-w-7xl mx-auto w-full">
              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-1 sm:mb-2 md:mb-4 drop-shadow-md line-clamp-2">
                {slide.title}
              </h2>
              <p className="text-[10px] sm:text-sm md:text-lg text-slate-300 font-medium max-w-2xl leading-snug md:leading-relaxed mb-3 sm:mb-6 drop-shadow line-clamp-2">
                {slide.desc}
              </p>
              
              {slide.buttonText && (
                <button 
                  onClick={() => scrollToServices(slide.buttonTarget)}
                  className="w-max h-8 sm:h-12 px-4 sm:px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-lg sm:rounded-xl font-bold uppercase tracking-widest text-[9px] sm:text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 sm:gap-2"
                >
                  <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4" /> {slide.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Arrows (Hidden on mobile) */}
        {slides.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all hidden sm:flex"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all hidden sm:flex"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {slides.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-6 left-0 right-0 z-30 flex justify-center gap-1.5 sm:gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all rounded-full ${
                  i === currentIndex 
                    ? 'bg-blue-500 w-6 sm:w-8 h-1.5 sm:h-2' 
                    : 'bg-white/40 hover:bg-white/70 w-1.5 h-1.5 sm:w-2 sm:h-2'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Audio Button Strip Below Slider */}
      {settings.audio.showButton && (
        <div className="w-full bg-slate-950 border-b border-slate-900 py-3 px-4 sm:px-6 flex justify-end">
          <div className="max-w-7xl mx-auto w-full flex justify-end">
            <button 
              onClick={toggleAudio}
              className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors flex items-center gap-2"
            >
              {isPlaying ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(HeroSection);
