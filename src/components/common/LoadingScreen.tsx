/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, memo } from 'react';
import { motion } from 'motion/react';

const LoadingScreen = ({
  onComplete,
  storeName,
  loadingName,
  loadingSubtitle,
  settings
}: {
  onComplete: () => void;
  storeName?: string;
  loadingName?: string;
  loadingSubtitle?: string;
  settings?: any;
}) => {
  useEffect(() => {
    let duration = settings?.duration ? Number(settings.duration) : 1200;
    if (isNaN(duration)) duration = 1200;
    
    // Fast loading for better mobile UX
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, settings]);

  const finalStoreName = loadingName || settings?.mainText || storeName || "SANZ STORE";
  const finalLoadingSubText = loadingSubtitle || settings?.subText || "Preparing your digital experience...";
  const finalLoadingText = settings?.text || "Memuat website...";

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="premium-loading-screen"
    >
      <div className="premium-loading-bg-glow premium-loading-bg-glow-one"></div>
      <div className="premium-loading-bg-glow premium-loading-bg-glow-two"></div>

      <div className="premium-loading-card">
        <div className="premium-loading-orb-wrap">
          <div className="premium-loading-ring"></div>
          <div className="premium-loading-orb">
            <span>✦</span>
          </div>
        </div>

        <h1 className="premium-loading-title">
          {finalStoreName}
        </h1>

        <p className="premium-loading-subtitle">
          {finalLoadingSubText}
        </p>

        <div className="premium-loading-progress">
          <div className="premium-loading-progress-bar"></div>
        </div>

        <p className="premium-loading-status">
          {finalLoadingText}
        </p>
      </div>
    </motion.div>
  );
};

export default memo(LoadingScreen);
