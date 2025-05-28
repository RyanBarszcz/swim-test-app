import React from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export default function QuickStatsPanel({ testsToday = 0, checkInsToday = 0, recent = [] }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-md mt-10">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Quick Stats</h2>

      <div className="flex justify-between text-center mb-6">
        <div className="flex-1">
          <p className="text-3xl font-semibold text-blue-700">{testsToday}</p>
          <p className="text-sm text-gray-700">Tests Today</p>
        </div>
        <div className="flex-1">
          <p className="text-3xl font-semibold text-green-700">{checkInsToday}</p>
          <p className="text-sm text-gray-700">Check-ins Today</p>
        </div>
      </div>

      <h3 className="text-md font-medium text-gray-800 mb-2">Recent Activity</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No recent activity</p>
        ) : (
          recent.map((kid, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white rounded-full px-4 py-2 shadow text-sm"
            >
              <span className="font-medium text-gray-800">{kid.childName}</span>
              <span className="text-gray-600">{dayjs(kid.timestamp).format("h:mm A")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
