import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const logScan = async (data) => {
  await addDoc(collection(db, "scanLogs"), {
    ...data,
    scannedAt: serverTimestamp()
  });
};