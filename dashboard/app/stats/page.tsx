export default function StatsPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600 mt-2">
          Analyze your medication adherence patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Weekly Adherence</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">95%</p>
          <p className="text-xs text-green-600 mt-1">+5% from last week</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Monthly Adherence</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">92%</p>
          <p className="text-xs text-green-600 mt-1">Above target</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">7</p>
          <p className="text-xs text-blue-600 mt-1">Days perfect</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Avg Delay</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">2.5</p>
          <p className="text-xs text-gray-600 mt-1">Minutes</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Adherence Trend
        </h2>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[100, 100, 90, 95, 100, 85, 100].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-t" style={{ height: `${value}%` }}></div>
              <p className="text-xs text-gray-500 mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dose Time Analysis
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Morning Dose</span>
              <span className="text-sm text-gray-500">98% on time</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "98%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Afternoon Dose</span>
              <span className="text-sm text-gray-500">85% on time</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Evening Dose</span>
              <span className="text-sm text-gray-500">93% on time</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "93%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
