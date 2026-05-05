import React, { useEffect, useState } from 'react';

interface MainMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onLoginAdmin: () => void;
  onChatAi: () => void;
  onRating: () => void;
  onHome: () => void;
  onVideoGame: () => void;
  onVideo: () => void;
}

export default function MainMenuDrawer({ 
  open, 
  onClose, 
  onLoginAdmin, 
  onChatAi, 
  onRating,
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
    { id: "home", label: "Beranda", desc: "Kembali ke halaman utama", icon: "🏠", action: onHome },
    { id: "chat-ai", label: "Chet Global", desc: "Ngobrol bareng semua pengunjung", icon: "💬", action: onChatAi },
    { id: "rating", label: "Rating", desc: "Beri penilaian untuk store ini", icon: "⭐", action: onRating },
    { id: "video-game", label: "Video Game", desc: "Menu hiburan dan game", icon: "🎮", action: onVideoGame },
    { id: "video", label: "Video", desc: "Kumpulan video menarik", icon: "🎥", action: onVideo },
    { id: "login-admin", label: "Login Admin", desc: "Masuk ke panel admin", icon: "⚙️", action: onLoginAdmin }
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
    <div className={`main-drawer-overlay ${show ? "open" : ""}`} onClick={onClose}>
      <aside className={`main-drawer-panel ${show ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="main-drawer-header">
          <div>
            <h2>Menu Utama</h2>
            <p>Pilih fitur yang ingin dibuka</p>
          </div>

          <button
            type="button"
            className="main-drawer-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="main-drawer-list">
          {items.map((item) => (
            <button
              key={item.id}
              className="main-drawer-item"
              onClick={() => handleClick(item)}
              type="button"
            >
              <span className="main-drawer-icon">{item.icon}</span>
              <span className="main-drawer-text">
                <strong>{item.label}</strong>
                <small>{item.desc}</small>
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
