import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Rocket as RocketIcon } from 'lucide-react';

const VideoShort = ({ url, title }: { url: string; title: string; key?: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-screen snap-start flex items-center justify-center bg-black overflow-hidden">
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover md:max-w-[450px] md:rounded-3xl md:h-[90vh] md:border md:border-white/10"
        loop
        playsInline
        onClick={togglePlay}
      />
      
      {/* Overlay Info */}
      <div className="absolute bottom-10 left-6 right-6 z-10 pointer-events-none md:max-w-[400px] md:left-1/2 md:-translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <RocketIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">Sanz Official</span>
          </div>
          <h3 className="text-white text-sm font-medium line-clamp-2">
            {title} - Video Kata Kata Jepang Anime
          </h3>
        </motion.div>
      </div>

      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <Play className="w-10 h-10 text-white fill-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoShort;
