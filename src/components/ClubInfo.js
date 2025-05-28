import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function ClubInfo({ user }) {
  const [rules, setRules] = useState("");

  useEffect(() => {
    const fetchRules = async () => {
      const ref = doc(db, "clubs", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRules(snap.data().swimRules);
      }
    };
    fetchRules();
  }, [user.uid]);

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-2">Swim Test Rules</h3>
      <p>{rules}</p>
    </div>
  );
}