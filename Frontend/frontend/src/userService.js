import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createUserProfile = async (user) => {
  if (!user) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",

      role: null,

      createdAt: new Date()
    },
    { merge: true }
  );
};