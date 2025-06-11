import React, { useEffect, useState } from "react";
import profileImg from "./assets/profile.jpg";
import { doc, getDoc, updateDoc, getDocs, deleteDoc, collection, writeBatch } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

export default function ProfileModal({ onClose, setClubName, setProfilePhoto, setRules }) {
  const [localClubName, setLocalClubName] = useState("");
  const [localRules, setLocalRules] = useState("");
  const [photo, setPhoto] = useState(profileImg);
  const [fileUpload, setFileUpload] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "clubs", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLocalClubName(data.clubName || "");
          setLocalRules(data.swimRules || "");
          setPhoto(data.clubImg || profileImg);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!uid) return;

    let photoURL = photo;

    try {
      // Upload image if changed
      if (fileUpload) {
        const storage = getStorage();
        const storageRef = ref(storage, `clubs/${uid}/profile.jpg`);
        await uploadBytes(storageRef, fileUpload);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "clubs", uid), {
        clubName: localClubName,
        swimRules: localRules,
        clubImg: photoURL,
      });

      // Update parent component state
      setClubName(localClubName);
      setRules(localRules);
      setProfilePhoto(photoURL);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file || !uid) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.trim().split("\n");

      const batch = writeBatch(db);
      const childrenCollectionRef = collection(db, "clubs", uid, "children");

      rows.forEach((row) => {
        const [firstName, lastName] = row
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, ""));
        if (firstName && lastName) {
          const newDocRef = doc(childrenCollectionRef); // auto-generated ID
          batch.set(newDocRef, {
            firstName,
            lastName,
            lastCheckedIn: null,
          });
        }
      });

      try {
        await batch.commit();
        toast.success("Children imported successfully!");
      } catch (err) {
        console.error("Import failed:", err);
        toast.error("Children failed to import.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center relative">
        <button className="absolute top-2 right-4 text-gray-500" onClick={onClose}>✖</button>

        <div className="relative w-24 h-24 mx-auto mb-4">
          <img src={photo || profileImg} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full text-white cursor-pointer">
            ✏️
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
        </div>

        <input
          value={localClubName}
          onChange={(e) => setLocalClubName(e.target.value)}
          className="w-full mb-4 p-2 rounded border border-gray-300"
          placeholder="Club Name"
        />

        <textarea
          value={localRules}
          onChange={(e) => setLocalRules(e.target.value)}
          rows={4}
          className="w-full mb-4 p-2 rounded border border-gray-300"
          placeholder="Swim Test Rules"
        />

      <div className="mb-4 text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Import Children from CSV
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload a CSV file with columns: <strong>firstName</strong> and <strong>lastName</strong>. 
          Each row should represent one child.
          <br />
          Example: <code>John,Doe</code>
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVImport}
          className="block w-full text-sm text-gray-600"
        />
      </div>
        <button
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2"
          onClick={handleSave}
        >
          Save
        </button>

        <button
          className="w-full py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          onClick={handleLogout}
        >
          Log Out
        </button>

        {success && (
          <p className="mt-2 text-green-600 font-semibold transition">Changes saved successfully!</p>
        )}
      </div>
    </div>
  );
}
