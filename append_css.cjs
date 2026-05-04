const fs = require('fs');
const content = `
/* ==================================================
   GLOBAL SMOOTH SETTINGS
   ================================================== */

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  overscroll-behavior-y: contain;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

* {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

button,
a,
[role="button"],
.clickable,
.product-card,
.category-card,
.home-category-pill,
.main-menu-item,
.admin-nav-item {
  touch-action: manipulation;
}

/* ==================================================
   GLOBAL TRANSITION SYSTEM
   ================================================== */

:root {
  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 140ms;
  --duration-normal: 220ms;
  --duration-slow: 320ms;
}

button,
a,
.clickable,
.product-card,
.category-card,
.home-category-pill,
.main-menu-item,
.admin-nav-item,
.admin-card,
.admin-section-card {
  transition:
    transform var(--duration-fast) var(--ease-smooth),
    opacity var(--duration-fast) var(--ease-smooth),
    background var(--duration-normal) var(--ease-smooth),
    color var(--duration-normal) var(--ease-smooth),
    border-color var(--duration-normal) var(--ease-smooth),
    box-shadow var(--duration-normal) var(--ease-smooth);
}

/* ==================================================
   PRESS EFFECT UNTUK HP
   ================================================== */

button:active,
a:active,
.clickable:active,
.home-category-pill:active,
.product-card:active,
.category-card:active,
.main-menu-item:active,
.admin-nav-item:active {
  transform: scale(0.98);
}

.product-card:active,
.category-card:active,
.admin-card:active,
.admin-section-card:active {
  transform: scale(0.992);
}

/* ==================================================
   SMOOTH SCROLL CONTAINER
   ================================================== */

.home-category-shell,
.main-menu-drawer,
.chat-drawer,
.admin-main,
.admin-nav,
.product-list,
.menu-semua-premium {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
}

.home-category-shell {
  scroll-snap-type: x proximity;
}

.home-category-pill {
  scroll-snap-align: start;
}

/* ==================================================
   DRAWER MENU UTAMA SMOOTH
   ================================================== */

.main-menu-drawer {
  transform: translateX(100%);
  opacity: 0;
  transition:
    transform 260ms var(--ease-soft),
    opacity 220ms var(--ease-smooth);
  will-change: transform, opacity;
}

.main-menu-drawer.open {
  transform: translateX(0);
  opacity: 1;
}

.main-menu-backdrop {
  opacity: 0;
  transition: opacity 220ms var(--ease-smooth);
}

.main-menu-backdrop.open {
  opacity: 1;
}

/* ==================================================
   CHAT DRAWER SMOOTH
   ================================================== */

.chat-drawer {
  transform: translateY(16px);
  opacity: 0;
  transition:
    transform 240ms var(--ease-soft),
    opacity 220ms var(--ease-smooth);
  will-change: transform, opacity;
}

.chat-drawer.open {
  transform: translateY(0);
  opacity: 1;
}

.chat-message-bubble {
  animation: chatBubbleIn 180ms var(--ease-soft);
}

@keyframes chatBubbleIn {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ==================================================
   MODAL / POPUP SMOOTH
   ================================================== */

.modal-backdrop,
.popup-backdrop,
.admin-login-backdrop {
  animation: fadeInSmooth 180ms var(--ease-smooth);
}

.modal-card,
.popup-card,
.admin-login-card {
  animation: modalInSmooth 220ms var(--ease-soft);
  will-change: transform, opacity;
}

@keyframes fadeInSmooth {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalInSmooth {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ==================================================
   CARD HOVER / TOUCH EFFECT
   ================================================== */

.product-card,
.category-card,
.menu-card,
.admin-card,
.admin-section-card {
  transform: translateZ(0);
  backface-visibility: hidden;
}

@media (hover: hover) {
  .product-card:hover,
  .category-card:hover,
  .menu-card:hover,
  .admin-card:hover,
  .admin-section-card:hover {
    transform: translateY(-2px);
  }
}

/* ==================================================
   BUTTON FEEDBACK
   ================================================== */

button,
.btn,
.primary-button,
.admin-save-button,
.hero-cta-button {
  transform: translateZ(0);
  backface-visibility: hidden;
}

@media (hover: hover) {
  button:hover,
  .btn:hover,
  .primary-button:hover,
  .admin-save-button:hover,
  .hero-cta-button:hover {
    transform: translateY(-1px);
  }
}

/* ==================================================
   SLIDER / HERO PERFORMANCE
   ================================================== */

.hero-slide {
  opacity: 0;
  transition: opacity 360ms var(--ease-smooth);
  will-change: opacity;
}

.hero-slide.active {
  opacity: 1;
}

.hero-slide-image {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* ==================================================
   ADMIN PANEL SMOOTH
   ================================================== */

.admin-main {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.admin-nav-item {
  transition:
    transform 140ms var(--ease-smooth),
    background 200ms var(--ease-smooth),
    border-color 200ms var(--ease-smooth),
    color 200ms var(--ease-smooth);
}

.admin-nav-item:active {
  transform: scale(0.98);
}

.admin-section-card {
  contain: layout paint;
}

/* ==================================================
   INPUT FORM JANGAN LAG
   ================================================== */

input,
textarea,
select {
  transition:
    border-color 160ms var(--ease-smooth),
    box-shadow 160ms var(--ease-smooth),
    background 160ms var(--ease-smooth),
    color 160ms var(--ease-smooth) !important;
}

input:focus,
textarea:focus,
select:focus {
  transform: none !important;
}

/* ==================================================
   RESPONSIVE PERFORMANCE UNTUK HP RENDAH
   ================================================== */

@media (max-width: 480px) {
  .product-card,
  .category-card,
  .admin-card,
  .admin-section-card {
    box-shadow: 0 10px 24px var(--theme-shadow, rgba(0,0,0,0.18)) !important;
  }

  .hero-slide-glow,
  .banner-glow,
  .decorative-glow {
    opacity: 0.35 !important;
    filter: blur(24px) !important;
  }

  .main-menu-drawer,
  .chat-drawer,
  .modal-card,
  .popup-card {
    transition-duration: 190ms !important;
  }
}

/* ==================================================
   RESPECT REDUCED MOTION
   ================================================== */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
`;
fs.appendFileSync('src/index.css', '\n' + content);
console.log('Appended CSS to src/index.css');
