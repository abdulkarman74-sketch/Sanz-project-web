import React, { useState, useEffect } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

function getAdminLoginConfig() {
  const globalConfig: any = (globalThis as any)?.adminLogin || {};
  return {
    username: globalConfig?.username || (globalThis as any)?.adminUsername || "Sanz_1701",
    password: globalConfig?.password || (globalThis as any)?.adminPassword || "sanzstore"
  };
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [adminUsernameInput, setAdminUsernameInput] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [isAdminLoginLoading, setIsAdminLoginLoading] = useState(false);

  function handleAdminLogin() {
    const usernameInput = adminUsernameInput.trim();
    const passwordInput = adminPasswordInput.trim();

    setAdminLoginError("");
    setIsAdminLoginLoading(true);

    try {
      const config = getAdminLoginConfig();

      const correctUsername = String(config.username || "").trim();
      const correctPassword = String(config.password || "").trim();

      if (!usernameInput) {
        setAdminLoginError("Username wajib diisi.");
        return;
      }

      if (!passwordInput) {
        setAdminLoginError("Password wajib diisi.");
        return;
      }

      if (!correctUsername || !correctPassword) {
        setAdminLoginError("Konfigurasi admin belum lengkap di setting.js.");
        return;
      }

      if (usernameInput !== correctUsername || passwordInput !== correctPassword) {
        setAdminLoginError("Username atau password salah.");
        return;
      }

      const adminSession = {
        loggedIn: true,
        username: usernameInput,
        loginAt: Date.now()
      };

      localStorage.setItem("adminSession", JSON.stringify(adminSession));
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminUsername", usernameInput);

      setAdminUsernameInput("");
      setAdminPasswordInput("");
      setAdminLoginError("");
      
      onLoginSuccess();
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);
      setAdminLoginError("Terjadi kesalahan saat login admin.");
    } finally {
      setIsAdminLoginLoading(false);
    }
  }

  // Allow closing the background if clicked outside
  return (
    <div className="admin-login-clean-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="admin-login-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", zIndex: 10000 }}
      >
        <button 
          type="button" 
          onClick={onClose}
          style={{ position: "absolute", top: 15, right: 15, background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: 20 }}
        >
          ✕
        </button>

        <div className="admin-login-badge">
          🔐 Admin Area
        </div>

        <h2>Login Admin</h2>
        <p>Masukkan username dan password admin untuk mengelola website.</p>

        <div className="admin-login-field">
          <label>Username</label>
          <input
            type="text"
            value={adminUsernameInput}
            onChange={(e) => {
              setAdminUsernameInput(e.target.value);
              setAdminLoginError("");
            }}
            placeholder="Masukkan username admin"
            autoComplete="username"
            autoFocus
          />
        </div>

        <div className="admin-login-field">
          <label>Password</label>
          <input
            type="password"
            value={adminPasswordInput}
            onChange={(e) => {
              setAdminPasswordInput(e.target.value);
              setAdminLoginError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdminLogin();
              }
            }}
            placeholder="Masukkan password admin"
            autoComplete="current-password"
          />
        </div>

        {adminLoginError && (
          <div className="admin-login-error">
            {adminLoginError}
          </div>
        )}

        <button
          type="button"
          className="admin-login-button"
          onClick={handleAdminLogin}
          disabled={isAdminLoginLoading}
        >
          {isAdminLoginLoading ? "Memeriksa..." : "Masuk Admin"}
        </button>
      </div>
    </div>
  );
};
export default LoginModal;
