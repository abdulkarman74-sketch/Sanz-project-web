import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Download } from 'lucide-react';
import VideoShort from './VideoShort';
import DownloaderView from './DownloaderView';
import { VIDEO_DATA } from '../constants';

const VideoView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shorts' | 'downloader'>('shorts');

  return (
    <div className="min-h-screen bg-black pt-20 pb-24 px-4">
      <div className="max-w-md mx-auto">
        {/* Tab Switcher */}
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5 mb-6">
          <button
            onClick={() => setActiveTab('shorts')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'shorts'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            Shorts
          </button>
          <button
            onClick={() => setActiveTab('downloader')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'downloader'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            Downloader
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'shorts' ? (
            <motion.div
              key="shorts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {VIDEO_DATA.map((video) => (
                <VideoShort key={video.id} url={video.url} title={video.title} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="downloader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DownloaderView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoView;
