import { signInWithGoogle } from "../auth";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}