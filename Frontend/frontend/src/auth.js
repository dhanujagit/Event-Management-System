import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";
import { createUserProfile } from "./userService";



//GOOGLE LOGIN

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save/update user in Firestore
    await createUserProfile(user);

    return user;
  } catch (error) {
    console.error("Google login error:", error);
  }
};


//EMAIL LOGIN

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await createUserProfile(user);

    return user;
  } catch (error) {
    console.error("Email login error:", error);
  }
};



//EMAIL SIGNUP

export const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await createUserProfile(user);

    return user;
  } catch (error) {
    console.error("Signup error:", error);
  }
};



//LOGOUT

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};