/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';

const CursorGlow = () => {
  // Mobile check is handled via CSS 'hidden md:block'
  return (
    <>
      <div 
        className="fixed inset-0 z-[1] pointer-events-none hidden md:block"
        style={{
          background: `radial-gradient(1000px circle at var(--cursor-x) var(--cursor-y), rgba(59, 130, 246, 0.05), transparent 80%)`
        }}
      />
      <div 
        className="fixed top-0 left-0 w-8 h-8 z-[100] rounded-full border-2 border-blue-500/30 blur-sm pointer-events-none hidden md:block transition-transform duration-100 ease-out"
        style={{
          transform: `translate(calc(var(--cursor-x) - 16px), calc(var(--cursor-y) - 16px))`
        }}
      />
    </>
  );
};

export default memo(CursorGlow);
