import React, { useEffect, useState } from 'react';

interface MainMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onLoginAdmin: () => void;
  onChatAi: () => void;
  onHome: () => void;
  onVideoGame: () => void;
  onVideo: () => void;
}

export default function MainMenuDrawer({ 
  open, 
  onClose, 
  onLoginAdmin, 
  onChatAi, 
  onHome, 
  onVideoGame, 
  onVideo 
}: MainMenuDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Give browser time to process mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShow(true);
        });
      });
    } else {
      setShow(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!mounted) return null;

  const items = [
    { id: "home", label: "Beranda", icon: "🏠", action: onHome },
    { id: "chat-ai", label: "Chat AI", icon: "💬", action: onChatAi },
    { id: "video-game", label: "Video Game", icon: "🎮", action: onVideoGame },
    { id: "video", label: "Video", icon: "🎥", action: onVideo },
    { id: "login-admin", label: "Login Admin", icon: "🛡️", action: onLoginAdmin }
  ];

  function handleClick(item: typeof items[0]) {
    console.log("MAIN MENU ITEM CLICK:", item.id);
    onClose();

    setTimeout(() => {
      if (typeof item.action === "function") {
        item.action();
      }
    }, 100);
  }

  return (
    <>
      <div className={`main-menu-clean-backdrop ${show ? 'open' : ''}`} onClick={onClose} />

      <aside className={`main-menu-clean-drawer ${show ? 'open' : ''}`}>
        <div className="main-menu-clean-header">
          <div>
            <h2>Menu Utama</h2>
            <p>Pilih menu yang ingin dibuka</p>
          </div>

          <button type="button" onClick={onClose} className="main-menu-clean-close">
            ×
          </button>
        </div>

        <div className="main-menu-clean-list">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="main-menu-clean-item"
              onClick={() => handleClick(item)}
            >
              <span className="main-menu-clean-icon">{item.icon}</span>
              <span className="main-menu-clean-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="main-menu-clean-status">
          <span></span>
          Semua Sistem Normal
        </div>
      </aside>
    </>
  );
}
