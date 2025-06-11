import React, { useState, useEffect } from "react";
import { addDoc, collection, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function TakeSwimTestModal({ onClose, setCheckInsToday, setTestsToday, setRecentKids }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !uid) return;

    const now = new Date();
    const newKid = {
      firstName,
      lastName,
      lastCheckedIn: serverTimestamp(),
      testTakenAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "clubs", uid, "children"), newKid);

      toast.success("Child added! 🎉");

      // Refetch from firestore to get actual timestamp
      await new Promise((res) => setTimeout(res, 300));
      const docSnap = await getDoc(docRef);
      const addedKid = { id: docRef.id, ...docSnap.data() };

      // Optimistically update UI
      setRecentKids((prev) => [addedKid, ...prev]);
      setCheckInsToday((prev) => prev + 1);
      setTestsToday((prev) => prev + 1);

      onClose();
    } catch (err) {
      console.error("Error adding child:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Take Swim Test</h2>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Child's First Name"
          className="capitalize w-full mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Child's Last Name"
          className="capitalize w-full mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
