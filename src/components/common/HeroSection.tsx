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
    <div className="relative w-full">
      <audio 
        ref={audioRef} 
        loop={settings.audio.loop} 
        src={settings.audio.url} 
        preload="auto" 
      />
      
      {/* Slider Container */}
      <section className="hero-slider-section" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="hero-slider-card">
          {slides.map((slide, index) => (
            <div 
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full hero-slide ${
                index === currentIndex ? 'active z-10' : 'z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title || "Banner"}
                className="hero-slide-image w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />

              <div className="hero-slide-overlay absolute inset-0"></div>
              <div className="hero-slide-glow absolute inset-0"></div>

              <div className="hero-slide-content relative z-20">
                <div className="hero-slide-badge">
                  ✦ Premium Digital Store
                </div>

                <h1 className="hero-slide-title">
                  {slide.title && slide.title.split(' ').length > 1 ? (
                    <>
                      {slide.title.split(' ').slice(0, -1).join(' ')}{' '}
                      <span className="accent">{slide.title.split(' ').slice(-1)[0]}</span>
                    </>
                  ) : (
                    slide.title || "SANZ STORE PREMIUM"
                  )}
                </h1>

                <p className="hero-slide-subtitle">
                  {slide.desc || slide.subtitle || "Layanan digital cepat, aman, dan terpercaya untuk kebutuhan server, bot, dan aplikasi premium."}
                </p>
              </div>
            </div>
          ))}

          <div className="hero-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.id || index}
                type="button"
                className={`hero-dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {settings.audio.showButton && (
        <button 
          onClick={toggleAudio}
          className="music-floating-button group"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <Play className="w-5 h-5 ml-0.5 group-hover:scale-110 transition-transform" />}
        </button>
      )}
    </div>
  );
};

export default memo(HeroSection);
