import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";
import { createUserProfile } from "./userService";

// GOOGLE LOGIN
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// EMAIL LOGIN (NO PROFILE CREATION HERE)
export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email login error:", error);
    throw error;
  }
};

// EMAIL REGISTER (ONLY HERE CREATE USER DOC)
export const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await createUserProfile(user);

    return user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};