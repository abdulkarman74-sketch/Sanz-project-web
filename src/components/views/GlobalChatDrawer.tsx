import React, { useState, useEffect, useRef } from 'react';
import { db, firebaseReady } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';

interface GlobalChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalChatDrawer: React.FC<GlobalChatDrawerProps> = ({ isOpen, onClose }) => {
  const [globalChatUser, setGlobalChatUser] = useState<{userId: string, userName: string} | null>(null);
  const [globalChatNameInput, setGlobalChatNameInput] = useState("");
  const [globalChatMessages, setGlobalChatMessages] = useState<any[]>([]);
  const [globalChatInput, setGlobalChatInput] = useState("");
  const [sendingGlobalChat, setSendingGlobalChat] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const globalChatEndRef = useRef<HTMLDivElement>(null);

  // Read saved user
  useEffect(() => {
    const saved = localStorage.getItem("globalChatUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.userId && parsed?.userName) {
          setGlobalChatUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem("globalChatUser");
      }
    }
  }, []);

  // Update presence heartbeat
  useEffect(() => {
    if (!globalChatUser?.userId || !globalChatUser?.userName || !firebaseReady || !db) return;

    const updatePresence = async () => {
      try {
        await setDoc(doc(db, "globalChatPresence", globalChatUser.userId), {
          userId: globalChatUser.userId,
          userName: globalChatUser.userName,
          online: true,
          lastSeen: serverTimestamp(),
          clientLastSeen: Date.now()
        }, { merge: true });
      } catch (error) {
        console.error("UPDATE GLOBAL CHAT PRESENCE ERROR:", error);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000);

    return () => clearInterval(interval);
  }, [globalChatUser, firebaseReady, db]);

  // Read active users count
  useEffect(() => {
    if (!firebaseReady || !db) return;

    const unsub = onSnapshot(collection(db, "globalChatPresence"), (snapshot) => {
      const now = Date.now();
      const activeUsers = snapshot.docs
        .map((docSnap) => docSnap.data())
        .filter((user) => {
          const lastSeen = Number(user.clientLastSeen || 0);
          return user.online === true && now - lastSeen < 60000;
        });

      setOnlineUsersCount(activeUsers.length);
    }, (error) => {
      console.error("Global Chat Presence Snapshot error:", error);
    });

    return () => unsub();
  }, [firebaseReady, db]);

  // Mark offline on unmount/close
  useEffect(() => {
    if (!globalChatUser?.userId || !firebaseReady || !db) return;

    const markOffline = async () => {
      try {
        await setDoc(doc(db, "globalChatPresence", globalChatUser.userId), {
          online: false,
          clientLastSeen: Date.now(),
          lastSeen: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error("MARK OFFLINE ERROR:", error);
      }
    };

    window.addEventListener("beforeunload", markOffline);

    return () => {
      window.removeEventListener("beforeunload", markOffline);
      markOffline();
    };
  }, [globalChatUser, firebaseReady, db]);

  useEffect(() => {
    if (!isOpen || !firebaseReady || !db) return;

    try {
      const q = query(
        collection(db, "globalChats"),
        orderBy("clientCreatedAt", "asc"),
        limit(100)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));

        setGlobalChatMessages(messages);
      }, (error) => {
        console.error("Global Chat Snapshot error:", error);
      });

      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, db, firebaseReady]);

  useEffect(() => {
    if (isOpen) {
      globalChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [globalChatMessages, isOpen]);

  function getOrCreateGlobalChatUserId() {
    const saved = localStorage.getItem("globalChatUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.userId) return parsed.userId;
      } catch (e) {}
    }

    return "gc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }

  async function registerGlobalChatName() {
    const name = globalChatNameInput.trim();

    if (!name) {
      alert("Nama wajib diisi dulu.");
      return;
    }

    if (name.length < 2) {
      alert("Nama minimal 2 karakter.");
      return;
    }

    if (name.length > 20) {
      alert("Nama maksimal 20 karakter.");
      return;
    }

    const userId = getOrCreateGlobalChatUserId();

    const user = {
      userId,
      userName: name
    };

    localStorage.setItem("globalChatUser", JSON.stringify(user));
    setGlobalChatUser(user);

    if (firebaseReady && db) {
      try {
        await setDoc(doc(db, "globalChatUsers", userId), {
          ...user,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error("SAVE GLOBAL CHAT USER ERROR:", error);
      }
    }
  }

  async function sendGlobalChatMessage() {
    if (!globalChatUser?.userName) {
      alert("Daftar nama dulu sebelum chet.");
      return;
    }

    const message = globalChatInput.trim();

    if (!message) return;

    if (message.length > 500) {
      alert("Pesan maksimal 500 karakter.");
      return;
    }
    
    if (!firebaseReady || !db) return;

    try {
      setSendingGlobalChat(true);

      await addDoc(collection(db, "globalChats"), {
        userId: globalChatUser.userId,
        userName: globalChatUser.userName,
        message,
        createdAt: serverTimestamp(),
        clientCreatedAt: Date.now()
      });

      setGlobalChatInput("");
    } catch (error) {
      console.error("SEND GLOBAL CHAT ERROR:", error);
      alert("Gagal mengirim pesan.");
    } finally {
      setSendingGlobalChat(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="global-chat-overlay" onClick={onClose}>
      <div className="global-chat-panel" onClick={(e) => e.stopPropagation()}>
        <div className="global-chat-header">
          <div>
            <h2>Chet Global</h2>
            <p>Ngobrol bareng semua pengunjung website</p>
          </div>

          <button
            type="button"
            className="global-chat-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {!globalChatUser ? (
          <div className="global-chat-register">
            <h3>Daftar Nama Dulu</h3>
            <p>Masukkan nama agar kamu bisa ikut ngobrol di Chet Global.</p>

            <input
              type="text"
              value={globalChatNameInput}
              onChange={(e) => setGlobalChatNameInput(e.target.value)}
              placeholder="Masukkan nama kamu"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  registerGlobalChatName();
                }
              }}
            />

            <button type="button" onClick={registerGlobalChatName}>
              Mulai Chet
            </button>
          </div>
        ) : (
          <>
            <div className="global-chat-userbar">
              <div className="global-chat-current-user">
                <span>Masuk sebagai</span>
                <strong>{globalChatUser.userName}</strong>
              </div>

              <div className="global-chat-online-count">
                <span className="global-chat-online-dot"></span>
                <strong>{onlineUsersCount}</strong>
                <span>aktif</span>
              </div>
            </div>

            <div className="global-chat-messages">
              {globalChatMessages.map((msg) => {
                const isMe = msg.userId === globalChatUser.userId;

                return (
                  <div
                    key={msg.id}
                    className={`global-chat-message ${isMe ? "me" : "other"}`}
                  >
                    <div className="global-chat-message-name">
                      {isMe ? "Kamu" : msg.userName}
                    </div>
                    <div className="global-chat-message-bubble">
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={globalChatEndRef} />
            </div>

            <div className="global-chat-input-row">
              <textarea
                value={globalChatInput}
                onChange={(e) => setGlobalChatInput(e.target.value)}
                placeholder="Tulis pesan..."
                maxLength={500}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendGlobalChatMessage();
                  }
                }}
              />

              <button
                type="button"
                onClick={sendGlobalChatMessage}
                disabled={sendingGlobalChat || !globalChatInput.trim()}
              >
                Kirim
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
