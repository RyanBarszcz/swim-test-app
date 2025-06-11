import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Wait until Firebase confirms auth status

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-blue-500 font-semibold text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/home" replace /> : <Register />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
