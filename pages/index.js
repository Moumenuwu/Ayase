import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import Chat from "../components/Chat";

export default function Home() {
  const login = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>مرحبا في الدردشة!</h1>
      <button onClick={login} style={{ marginBottom: 20 }}>تسجيل دخول Google</button>
      <Chat />  {/* هنا يظهر صندوق الدردشة */}
    </div>
  );
}
