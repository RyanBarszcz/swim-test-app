// import React, { useState, useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase/config";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./components/Home";
// import { Toaster  } from "react-hot-toast";

// function App() {
//   // const [user, setUser] = useState(null);

//   // useEffect(() => {
//   //   const unsub = onAuthStateChanged(auth, setUser);
//   //   return () => unsub();
//   // }, []);

//   // if (!user) {
//   //   return (
//   //     <div className="flex flex-col md:flex-row justify-evenly p-4">
//   //       <Login onLogin={() => setUser(auth.currentUser)} />
//   //       <Register onRegister={() => setUser(auth.currentUser)} />
//   //     </div>
//   //   );
//   // }

//   // return <Home user={user} />;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
//       {/* <Login onLogin={() => {}} /> */}
//       <Register/>
//     </div>
//   );
// }

// export default App; 

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";

function App() {
  // return (
  //   <Router>
  //     <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
  //     <Routes>
  //       <Route path="/login" element={<Login  />} />
  //       <Route path="/register" element={<Register />} />
  //       <Route path="/home" element={<Home />} />
  //       <Route path="*" element={<Navigate to="/login" replace />} />
  //     </Routes>
  //   </Router>
  // );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Home />
    </div>
  );
}

export default App;
