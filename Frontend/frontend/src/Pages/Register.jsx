import { useState } from "react";
import { registerWithEmail } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);

      // after register → force role selection
      navigate("/select-role");

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 shadow-lg rounded-lg bg-white w-80 text-center">

        <h1 className="text-2xl font-bold mb-6">Register</h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Create Account
        </button>

        <p
          onClick={() => navigate("/")}
          className="text-sm mt-4 text-blue-600 cursor-pointer"
        >
          Already have an account? Login
        </p>

      </div>
    </div>
  );
}