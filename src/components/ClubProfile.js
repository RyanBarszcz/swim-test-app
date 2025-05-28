import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ClubProfile({ user }) {
  const [clubName, setClubName] = useState("");
  const [swimRules, setSwimRules] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const ref = doc(db, "clubs", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setClubName(data.clubName);
        setSwimRules(data.swimRules);
      }
    };
    fetchProfile();
  }, [user.uid]);

  const handleSave = async () => {
    const ref = doc(db, "clubs", user.uid);
    await updateDoc(ref, { clubName, swimRules });
    alert("Profile updated!");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-2">Club Profile</h3>
      <input value={clubName} onChange={(e) => setClubName(e.target.value)} className="w-full mb-2 p-2 border rounded" />
      <textarea value={swimRules} onChange={(e) => setSwimRules(e.target.value)} rows="4" className="w-full mb-2 p-2 border rounded" />
      <button onClick={handleSave} className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">Save Changes</button>
    </div>
  );
}
