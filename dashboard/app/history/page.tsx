"use client";

import { useState } from "react";

interface LogEntry {
  id: string;
  date: string;
  doseLabel: string;
  scheduledTime: string;
  actualTime: string | null;
  status: "taken" | "late" | "missed";
  delayMinutes: number | null;
}

export default function HistoryPage() {
  const [logs] = useState<LogEntry[]>([
    {
      id: "1",
      date: "2025-12-03",
      doseLabel: "Morning",
      scheduledTime: "08:00",
      actualTime: "08:02",
      status: "taken",
      delayMinutes: 2,
    },
    {
      id: "2",
      date: "2025-12-03",
      doseLabel: "Afternoon",
      scheduledTime: "13:00",
      actualTime: "13:08",
      status: "late",
      delayMinutes: 8,
    },
    {
      id: "3",
      date: "2025-12-02",
      doseLabel: "Evening",
      scheduledTime: "20:00",
      actualTime: null,
      status: "missed",
      delayMinutes: null,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Medication History</h1>
        <p className="text-gray-600 mt-2">View your medication log and adherence</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.doseLabel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.scheduledTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.actualTime || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.delayMinutes !== null
                      ? `${log.delayMinutes} min`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
