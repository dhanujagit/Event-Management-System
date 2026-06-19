import { useState } from "react";
import { signInWithGoogle, loginWithEmail, registerWithEmail } from "../auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [msg, setMsg] = useState("");

  const checkUser = async (uid) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  };

  const handleAuth = async () => {
    try {
      let user;

      if (isRegister) {
        user = await registerWithEmail(email, password);
        navigate("/select-role");
        return;
      } else {
        user = await loginWithEmail(email, password);
      }

      const userData = await checkUser(user.uid);

      if (!userData) {
        setMsg("You must register first ❌");
        return;
      }

      if (!userData.role) {
        navigate("/select-role");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setMsg("Auth failed");
    }
  };

  const handleGoogle = async () => {
    try {
      const user = await signInWithGoogle();

      const userData = await checkUser(user.uid);

      if (!userData) {
        setMsg("You must register first ❌");
        return;
      }

      if (!userData.role) {
        navigate("/select-role");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setMsg("Google login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 shadow-lg rounded-lg bg-white w-80 text-center">

        <h1 className="text-2xl font-bold mb-4">
          {isRegister ? "Register" : "Login"}
        </h1>

        {/* GOOGLE */}
        <button
          onClick={handleGoogle}
          className="bg-blue-500 text-white w-full py-2 rounded mb-4"
        >
          Continue with Google
        </button>

        <hr className="my-4" />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className={`w-full py-2 rounded text-white ${
            isRegister ? "bg-purple-500" : "bg-green-500"
          }`}
        >
          {isRegister ? "Create Account" : "Login"}
        </button>

        <p className="text-red-500 mt-3">{msg}</p>

        {/* TOGGLE */}
        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-600 text-sm mt-4 cursor-pointer"
        >
          {isRegister
            ? "Already have an account? Login"
            : "New user? Register here"}
        </p>

      </div>
    </div>
  );
}