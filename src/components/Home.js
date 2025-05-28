import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SwimRulesModal from "./SwimRulesModal";
import SearchChildModal from "./SearchChildModal";
import TakeSwimTestModal from "./TakeSwimTestModal";
import profileImg from "../components/assets/profile.jpg"; 
import QuickStatsPanel from "./QuickStatsPanel";
import dayjs from "dayjs";





export default function Home() {
  const { clubId } = useParams();
  const [showRules, setShowRules] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTest, setShowTest] = useState(false);

  // Placeholder club name
  const clubName = "Liberty Athletic Club";
  const allTests = [
  { childName: "Ava Thompson", timestamp: dayjs().subtract(2, "hours").toISOString() },
  { childName: "Liam Johnson", timestamp: dayjs().subtract(1, "hours").toISOString() },
  { childName: "Noah Lee", timestamp: dayjs().subtract(50, "minutes").toISOString() },
  { childName: "Emma Davis", timestamp: dayjs().subtract(40, "minutes").toISOString() },
  { childName: "Olivia Smith", timestamp: dayjs().subtract(35, "minutes").toISOString() },
  { childName: "Sophia Brown", timestamp: dayjs().subtract(30, "minutes").toISOString() },
  { childName: "Mason Garcia", timestamp: dayjs().subtract(25, "minutes").toISOString() },
  { childName: "Lucas Martinez", timestamp: dayjs().subtract(20, "minutes").toISOString() },
  { childName: "Mia Hernandez", timestamp: dayjs().subtract(15, "minutes").toISOString() },
  { childName: "Isabella Wilson", timestamp: dayjs().subtract(10, "minutes").toISOString() },
  { childName: "Elijah Anderson", timestamp: dayjs().subtract(5, "minutes").toISOString() },
  { childName: "James Robinson", timestamp: dayjs().toISOString() },
  ];

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/water-bg.jpg')" }}
    >
      {/* Welcome message and profile icon */}
      <div className="absolute top-4 right-4 flex items-center gap-3 text-blue-500 text-lg sm:text-xl font-semibold">
        <span className="max-w-[200px] break-words text-right">
          {clubName}
        </span>
        <img
          src={profileImg}
          alt="Profile"
          className="w-14 h-14 rounded-full cursor-pointer"
        />
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-10 shadow-lg flex flex-col items-center gap-6 w-full max-w-md">
        {/* Main Buttons */}
        <div className="flex flex-col gap-8 text-center">
          <button 
          className="px-8 py-6 text-3xl font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition"
          onClick={() => setShowSearch(true)}
          >
            🔍 Search for Child
          </button>
          <button 
          className="px-8 py-6 text-3xl font-bold text-white bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition"
          onClick={() => setShowTest(true)}
          >
            🏊‍♂️ Take Swim Test
          </button>
        </div>
      </div>

      <QuickStatsPanel
        testsToday={12}
        checkInsToday={8}
        recent={[
          { childName: "Ava Thompson", timestamp: dayjs().subtract(2, "hours").toISOString() },
          { childName: "Liam Johnson", timestamp: dayjs().subtract(1, "hours").toISOString() },
          { childName: "Noah Lee", timestamp: dayjs().subtract(50, "minutes").toISOString() },
          { childName: "Emma Davis", timestamp: dayjs().subtract(40, "minutes").toISOString() },
          { childName: "Olivia Smith", timestamp: dayjs().subtract(35, "minutes").toISOString() },
          { childName: "Sophia Brown", timestamp: dayjs().subtract(30, "minutes").toISOString() },
          { childName: "Mason Garcia", timestamp: dayjs().subtract(25, "minutes").toISOString() },
          { childName: "Lucas Martinez", timestamp: dayjs().subtract(20, "minutes").toISOString() },
          { childName: "Mia Hernandez", timestamp: dayjs().subtract(15, "minutes").toISOString() },
          { childName: "Isabella Wilson", timestamp: dayjs().subtract(10, "minutes").toISOString() },
          { childName: "Elijah Anderson", timestamp: dayjs().subtract(5, "minutes").toISOString() },
          { childName: "James Robinson", timestamp: dayjs().toISOString() },
        ]}
      />

      {/* Swim Rules Trigger */}
      <button
        className="absolute bottom-6 text-white underline hover:text-blue-300 transition"
        onClick={() => setShowRules(true)}
      >
        Swim Test Rules
      </button>

      {showRules && <SwimRulesModal onClose={() => setShowRules(false)} />}
      {showSearch && <SearchChildModal onClose={() => setShowSearch(false)} />}
      {showTest && <TakeSwimTestModal onClose={() => setShowTest(false)} />}
    </div>
  );
}
