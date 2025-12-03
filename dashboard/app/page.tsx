export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Medication Reminder Dashboard
      </h1>

      {/* Device Status */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Device Status
            </h2>
            <p className="text-sm text-gray-500">Arduino Medication Reminder</p>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm font-medium text-green-700">Online</span>
          </div>
        </div>
      </div>

      {/* Today's Alarms */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Medication Schedule
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
            <div>
              <p className="font-medium text-gray-900">Morning Dose</p>
              <p className="text-sm text-gray-500">8:00 AM</p>
            </div>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
              Upcoming
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium text-gray-900">Afternoon Dose</p>
              <p className="text-sm text-gray-500">1:00 PM</p>
            </div>
            <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded">
              Scheduled
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium text-gray-900">Evening Dose</p>
              <p className="text-sm text-gray-500">8:00 PM</p>
            </div>
            <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded">
              Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-gray-900">95%</p>
          <p className="text-xs text-green-600">Adherence Rate</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Streak</p>
          <p className="text-2xl font-bold text-gray-900">7 Days</p>
          <p className="text-xs text-blue-600">No Missed Doses</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Average Delay</p>
          <p className="text-2xl font-bold text-gray-900">2 min</p>
          <p className="text-xs text-gray-600">Last 7 Days</p>
        </div>
      </div>
    </div>
  );
}
