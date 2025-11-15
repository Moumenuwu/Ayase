const send = async () => {
  if (!auth.currentUser) return alert("سجّل دخول أولاً");
  if (!text.trim()) return alert("لا يمكن إرسال رسالة فارغة");

  try {
    await addDoc(collection(db, "messages"), {
      user: auth.currentUser.displayName,
      text: text,
      time: serverTimestamp() // الوقت من السيرفر
    });
    setText("");
  } catch (error) {
    console.error("خطأ أثناء الإرسال:", error);
    alert("حدث خطأ أثناء الإرسال، تحقق من إعدادات Firebase");
  }
};

