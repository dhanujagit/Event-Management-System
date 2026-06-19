import { useState } from "react";
import { signInWithGoogle, loginWithEmail, registerWithEmail } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    navigate("/select-role");
  };

  const handleLogin = async () => {
    await loginWithEmail(email, password);
    navigate("/dashboard");
  };

  const handleSignup = async () => {
    await registerWithEmail(email, password);
    navigate("/select-role");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 shadow-lg rounded-lg text-center bg-white w-80">

        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
        >
          Sign in with Google
        </button>

        <hr className="my-4" />

        {/* EMAIL LOGIN */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={handleLogin}
          className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="bg-gray-700 text-white px-4 py-2 rounded w-full"
        >
          Sign Up
        </button>

      </div>
    </div>
  );
}