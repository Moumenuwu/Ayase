import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Home(){
  const [msgs,setMsgs]=useState([]);
  const [text,setText]=useState("");

  useEffect(()=>{
    const q=query(collection(db,"messages"),orderBy("time"));
    const unsub=onSnapshot(q,(snap)=>{
      setMsgs(snap.docs.map(d=>d.data()));
    });
    return ()=>unsub();
  },[]);

  const send=async()=>{
    if(!auth.currentUser) return alert("سجّل دخول");
    await addDoc(collection(db,"messages"),{
      user:auth.currentUser.displayName,
      text,
      time:Date.now()
    });
    setText("");
  };

  const login=async()=>{
    await signInWithPopup(auth,new GoogleAuthProvider());
  };

  return (
    <div style={{padding:20}}>
      <button onClick={login}>تسجيل دخول Google</button>
      <div style={{height:300,overflow:"auto",border:"1px solid #ccc",marginTop:20}}>
        {msgs.map((m,i)=><div key={i}><b>{m.user}:</b> {m.text}</div>)}
      </div>
      <input value={text} onChange={e=>setText(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
// pages/index.js
import Chat from "../components/Chat";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>مرحبا في الدردشة!</h1>
      <p>يمكنك الآن إرسال الرسائل ومشاهدتها مباشرة لكل المستخدمين.</p>

      {/* هنا يظهر صندوق الدردشة */}
      <Chat />
    </div>
  );
}

