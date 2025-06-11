import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SwimRulesModal from "./SwimRulesModal";
import SearchChildModal from "./SearchChildModal";
import TakeSwimTestModal from "./TakeSwimTestModal";
import profileImg from "../components/assets/profile.jpg";
import QuickStatsPanel from "./QuickStatsPanel";
import ProfileModal from "./ProfileModal";
import dayjs from "dayjs";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";


export default function Home() {
  const [showRules, setShowRules] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [clubName, setClubName] = useState("Loading...");
  const [profilePhoto, setProfilePhoto] = useState(profileImg);
  const [rules, setRules] = useState("");
  const [recentKids, setRecentKids] = useState([]);
  const [testsToday, setTestsToday] = useState(0);
  const [checkInsToday, setCheckInsToday] = useState(0);

  const db = getFirestore();

  // Get start of today
  const startOfToday = dayjs().startOf("day").toDate();

  const fetchRecentKids = async (uid) => {
    const childrenRef = collection(db, "clubs", uid, "children");
    const q = query(childrenRef, where("lastCheckedIn", ">=", startOfToday));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };


  // Get club data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const clubDoc = await getDoc(doc(db, "clubs", user.uid));
        if (clubDoc.exists()) {
          const clubData = clubDoc.data();
          setClubName(clubData.clubName || "Your Club");
          setProfilePhoto(clubData.clubImg || profileImg);
          setRules(clubData.swimRules || "Enter your club rules in settings.");
          
          // Fetch kids here now that we have user.uid
          const kids = await fetchRecentKids(user.uid);
          setRecentKids(kids);
          setCheckInsToday(kids.length);
          setTestsToday(kids.filter(k => {
            const ts = k.testTakenAt?.toDate?.();
            return ts && dayjs(ts).isAfter(startOfToday);
          }).length);
        } else {
          console.warn("No club data found for this user.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col z-10"
      style={{ backgroundImage: "url('/pool.jpg')" }}
    >
      {/* Top Bar */}
      <div className="flex justify-end items-center p-[10px] text-white text-lg font-semibold w-full relative group">
        <div className="flex items-center gap-3 mr-2 cursor-pointer">
          <span className="text-right max-w-[200px] break-words"
          onClick={() => setShowProfileModal(true)}
          >
            {clubName || "Club Name"} 
          </span>
          <img
            // Use profileImg if one is not set
            src={profilePhoto || profileImg}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
            onClick={() => setShowProfileModal(true)}
          />
        </div>
      </div>


      {/* Main Content Split in Two */}
      <div className="flex flex-grow">
        {/* Left Side - Buttons */}
        <div className="w-1/2 flex flex-col justify-center items-center gap-12 p-2">
          <button
            className="w-4/5 py-20 text-4xl font-bold text-white bg-blue-600 rounded-2xl shadow-xl hover:bg-blue-700 transition"
            onClick={() => setShowSearch(true)}
          >
            🔍 Search for Child
          </button>
          <button
            className="w-4/5 py-20 text-4xl font-bold text-white bg-green-600 rounded-2xl shadow-xl hover:bg-green-700 transition"
            onClick={() => setShowTest(true)}
          >
            🏊‍♂️ Take Swim Test
          </button>

          <button
            className="mt-4 text-white underline hover:text-blue-300 transition"
            onClick={() => setShowRules(true)}
          >
            Swim Test Rules
          </button>
        </div>

        {/* Right Side - Stats Panel */}
        <div className="w-1/2 flex justify-center items-center p-6 z-0">
          <QuickStatsPanel
            testsToday={testsToday}
            checkInsToday={checkInsToday}
            recent={recentKids}
          />
        </div>
      </div>

      {/* Modals */}
      {showSearch && <SearchChildModal onClose={() => setShowSearch(false)} 
        setCheckInsToday={setCheckInsToday}
        setRecentKids={setRecentKids}
        />}

      {showTest && <TakeSwimTestModal onClose={() => setShowTest(false)} 
        setRecentKids={setRecentKids}
        setTestsToday={setTestsToday}
        setCheckInsToday={setCheckInsToday}
        />}

      {showProfileModal && (<ProfileModal onClose={() => setShowProfileModal(false)}
        setClubName={setClubName}
        setProfilePhoto={setProfilePhoto}
        setRules={setRules} 
        />
      )}

      {showRules && (
        <SwimRulesModal title="Swim Test Rules" onClose={() => setShowRules(false)}>
          <p className="whitespace-pre-wrap">{rules}</p>
        </SwimRulesModal>
      )}
    </div>
  );
}
