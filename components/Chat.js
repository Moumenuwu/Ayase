import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function Chat() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  // الاستماع للرسائل الجديدة مباشرة من Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("time", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMsgs(snap.docs.map(doc => doc.data()));
    });

    return () => unsub();
  }, []);

  const send = async () => {
    if (!auth.currentUser) return alert("سجّل دخول أولاً");
    if (!text.trim()) return;

    // إضافة رسالة جديدة
    await addDoc(collection(db, "messages"), {
      user: auth.currentUser.displayName,
      text,
      time: serverTimestamp() // Timestamp من السيرفر لضمان ترتيب الرسائل
    });

    setText("");
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
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
        <button onClick={send} style={{ padding: "5px 10px" }}>إرسال</button>
      </div>
    </div>
  );
}
