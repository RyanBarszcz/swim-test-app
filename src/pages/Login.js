import React, { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Auto-login if already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful! 🎉");
      navigate("/home");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/pool.jpg')" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white/20 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md text-blue-500 border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Club Login</h2>
        <p className="text-center text-sm mb-6 text-blue-500/70">
          Welcome back! 😊
        </p>

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-white/75 placeholder-blue-500/70 text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-white/75 placeholder-blue-500/70 text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500/70 hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex justify-between items-center text-sm text-white mb-6">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-blue-500" />
            <span>Keep me signed in</span>
          </label>
          <Link to="/register" className="hover:underline cursor-pointer text-white">
            Register here
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded font-semibold hover:bg-blue-600 transition"
        >
          Log In
        </button>

        <p className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-white hover:underline"
            onClick={() => {
              // TODO: Add password reset logic
            }}
          >
            Forgot password?
          </button>
        </p>
      </form>
    </div>
  );
}
