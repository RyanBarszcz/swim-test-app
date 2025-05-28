import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, doc, setDoc } from "firebase/firestore";

export default function SwimTestForm({ user }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = `${last}_${first}`;
    try {
      await setDoc(doc(collection(db, `clubs/${user.uid}/entries`), id), {
        firstName: first,
        lastName: last,
        timestamp: Date.now()
      });
      alert("Entry submitted!");
      setFirst("");
      setLast("");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-2">Swim Test Entry</h3>
      <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First Name" className="w-full mb-2 p-2 border rounded" required />
      <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last Name" className="w-full mb-2 p-2 border rounded" required />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Submit</button>
    </form>
  );
}
