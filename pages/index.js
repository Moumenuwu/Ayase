import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Home() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  // الاستماع للرسائل في الوقت الحقيقي
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("time", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMsgs(snap.docs.map(doc => doc.data()));
    });

    return () => unsub(); // تنظيف عند الخروج
  }, []);

  // إرسال رسالة جديدة
  const send = async () => {
    if (!auth.currentUser) return alert("سجّل دخول أولاً");

    await addDoc(collection(db, "messages"), {
      user: auth.currentUser.displayName,
      text,
      time: serverTimestamp() // وقت السيرفر لضمان الترتيب الصحيح
    });

    setText("");
  };

  // تسجيل الدخول عبر Google
  const login = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>مرحبا في الدردشة!</h1>
      <button onClick={login} style={{ marginBottom: 20 }}>
        تسجيل دخول Google
      </button>

      <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{ flex: 1, padding: 5 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالة..."
        />
        <button onClick={send} style={{ padding: "5px 10px" }}>
          إرسال
        </button>
      </div>
    </div>
  );
}

