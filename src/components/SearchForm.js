import React, { useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function SearchForm({ user }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [found, setFound] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const id = `${last}_${first}`;
    try {
      const ref = doc(db, `clubs/${user.uid}/entries`, id);
      const snap = await getDoc(ref);
      setFound(snap.exists());
    } catch (err) {
      alert("Search error: " + err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-2">Search for Child</h3>
      <form onSubmit={handleSearch}>
        <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First Name" className="w-full mb-2 p-2 border rounded" required />
        <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last Name" className="w-full mb-2 p-2 border rounded" required />
        <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Search</button>
      </form>
      {found !== null && (
        <div className={`mt-3 text-lg font-bold ${found ? "text-green-600" : "text-red-600"}`}>
          {found ? "✅ Child Found" : "❌ Not Found"}
        </div>
      )}
    </div>
  );
}
