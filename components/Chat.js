// components/Chat.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // الاستماع للرسائل الجديدة في الوقت الحقيقي
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe(); // تنظيف عند الخروج
  }, []);

  // إرسال رسالة جديدة
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px"
        }}
      >
        {messages.map(msg => (
          <p key={msg.id} style={{ margin: "5px 0" }}>
            {msg.text}
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالة..."
          style={{ flex: 1, padding: "5px" }}
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
          إرسال
        </button>
      </div>
    </div>
  );
}
