// components/Chat.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

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
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div>
      <div style={{ maxHeight: "300px", overflowY: "scroll", border: "1px solid black", padding: "10px" }}>
        {messages.map(msg => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="اكتب رسالة..."
      />
      <button onClick={sendMessage}>إرسال</button>
    </div>
  );
}
