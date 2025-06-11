import React from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export default function QuickStatsPanel({ testsToday = 0, checkInsToday = 0, recent = [] }) {
  console.log("Recent activity list:", recent);
  return (
    <div className="flex flex-col w-full max-h-[calc(100vh-20vh)] bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-xl overflow-hidden mb-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Quick Stats</h2>

      <div className="flex justify-between text-center mb-8">
        <div className="flex-1">
          <p className="text-4xl font-bold text-green-700">{testsToday}</p>
          <p className="text-base text-gray-700">Tests Today</p>
        </div>
        <div className="flex-1">
          <p className="text-4xl font-bold text-blue-700">{checkInsToday}</p>
          <p className="text-base text-gray-700">Check-ins Today</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No recent activity</p>
        ) : (
          [...recent]
          .filter(kid => kid && typeof kid === "object" && kid.firstName && kid.lastName)
          .sort((a, b) => {
              const dateA = a.lastCheckedIn?.toDate?.() || a.lastCheckedIn;
              const dateB = b.lastCheckedIn?.toDate?.() || b.lastCheckedIn;
              return new Date(dateB) - new Date(dateA);
            })
            .map((kid) => (
            <div
              key={kid.id || `${kid.firstName}-${kid.lastName}`}
              className="flex justify-between items-center bg-white rounded-full px-5 py-3 shadow text-base"
            >
              <span className="capitalize font-medium text-gray-800">
                {String(kid.firstName)} {String(kid.lastName)}
              </span>
              <span className="text-gray-600">
                {kid.lastCheckedIn instanceof Object && typeof kid.lastCheckedIn.toDate === "function"
                  ? dayjs(kid.lastCheckedIn.toDate()).fromNow()
                  : kid.lastCheckedIn
                    ? dayjs(kid.lastCheckedIn).fromNow()
                    : "-"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
