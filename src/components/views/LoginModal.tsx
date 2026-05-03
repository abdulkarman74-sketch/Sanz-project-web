import React, { useState } from 'react';
import { APP_SETTINGS } from '../../setting';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const correctPassword = String(APP_SETTINGS?.adminPassword || "6285814369350").trim();
    const inputPassword = String(password || "").trim();

    console.log("INPUT PIN:", inputPassword);
    console.log("CORRECT PIN:", correctPassword);

    if (inputPassword === correctPassword) {
      console.log("PIN BENAR, CALL ONSUCCESS");
      onLoginSuccess();
      return;
    }

    alert("PIN admin salah");
  }

  return (
    <div className="admin-login-clean-backdrop">
      <form className="admin-login-clean-card" onSubmit={handleSubmit}>
        <h2>Login Admin</h2>
        <p>Masukkan PIN admin untuk membuka panel.</p>

        <input
          type="password"
          placeholder="PIN Admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />

        <button type="submit">Masuk Admin</button>
        <button type="button" onClick={onClose}>Batal</button>
      </form>
    </div>
  );
};
export default LoginModal;
