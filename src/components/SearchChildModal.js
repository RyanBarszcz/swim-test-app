import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

export default function SearchChildModal({ onClose, setCheckInsToday, setRecentKids }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clubChildren, setClubChildren] = useState([]);
  const [uid, setUid] = useState(null);
  const [clickedId, setClickedId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const childrenRef = collection(db, "clubs", user.uid, "children");
        const snapshot = await getDocs(childrenRef);

        const startOfToday = dayjs().startOf("day");

        const children = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((child) => {
            const ts = child.lastCheckedIn?.toDate?.();
            return !ts || dayjs(ts).isBefore(startOfToday);
          });

        setClubChildren(children);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredResults = clubChildren
    .filter((child) =>
      (child.firstName + " " + child.lastName).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Search for Child</h2>

        <input
          type="text"
          placeholder="Enter name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="max-h-64 min-h-[8rem] overflow-y-auto space-y-2 mb-4 border rounded-lg p-2 bg-gray-50">
          {!searchTerm ? (
            <p className="text-gray-500 italic text-center">Start typing to search...</p>
          ) : filteredResults.length === 0 ? (
            <p className="text-gray-500 italic text-center">No matches found</p>
          ) : (
            filteredResults.map((child) => (
              <div
                key={child.id}
                onClick={async () => {
                  try {
                    setClickedId(child.id);

                    await updateDoc(doc(db, "clubs", uid, "children", child.id), {
                      lastCheckedIn: serverTimestamp(),
                    });

                    const updatedSnapShot = await getDocs(collection(db, "clubs", uid, "children"));
                    const updatedDoc = updatedSnapShot.docs.find(d => d.id === child.id);
                    const updatedData = updatedDoc?.data();

                    const updatedChild = {
                      id: child.id,
                      ...updatedData,
                    };

                    toast.success(`${child.firstName} checked in!`);
                    setRecentKids((prev) => [updatedChild, ...prev]);
                    setCheckInsToday((prev) => prev + 1);

                    setTimeout(() => {
                      onClose();
                    }, 200);
                  } catch (err) {
                    console.error("Failed to check in:", err);
                    alert("Check-in failed. Try again.");
                  }
                            }}
                className={`flex justify-between items-center bg-white rounded-full px-4 py-2 cursor-pointer shadow text-sm transition-all
                ${clickedId === child.id
                  ? "bg-green-100"
                  : "bg-white hover:bg-gray-100"
                }`}
              >
                <span className="capitalize font-medium text-gray-800">
                  {child.firstName} {child.lastName}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
