import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

          

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clubName, setClubName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "clubs", userCred.user.uid), {
        clubName,
        swimRules: "Enter your club's swim test rules in settings."
      });
      toast.success("Club registered successfully!");
      onRegister();
    } catch (err) {
      toast.error("Registration failed: " + err.message);
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/pool.jpg')" }} // match login
    >
      <form
        onSubmit={handleRegister}
        className="bg-white/20 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md text-blue-500 border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Register Your Club</h2>
        <p className="text-center text-sm mb-6 text-blue-500/70">
          Create an account to get started!
        </p>

        <input
          type="text"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          placeholder="Club Name"
          className="w-full p-3 mb-4 rounded-md bg-white/75 placeholder-blue-500/70 text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-md bg-white/75 placeholder-blue-500/70 text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded font-semibold hover:bg-blue-600 transition"
        >
          Register
        </button>

        <p className="text-center text-white mt-5 text-sm">
            Already registered?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in.
            </Link>
        </p>
      </form>
    </div>
  );
}
