export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Monitor your medication adherence and schedule</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#0BA6DF] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ADHERENCE RATE</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">95%</p>
          <p className="text-xs text-gray-500">This week</p>
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#EF7722] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CURRENT STREAK</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">7</p>
          <p className="text-xs text-gray-500">Days</p>
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#FAA533] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AVG DELAY</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">2m</p>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#0BA6DF] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">NEXT DOSE</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">8:00</p>
          <p className="text-xs text-gray-500">In 2 hours</p>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 mb-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Today's Schedule</h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF5ED] to-white border-2 border-[#EF7722] rounded-lg hover:shadow-md transition-all">
            <div>
              <p className="font-bold text-gray-900 mb-1">Morning Dose</p>
              <p className="text-sm text-gray-600 font-semibold">8:00 AM</p>
            </div>
            <div className="px-4 py-1.5 bg-[#0BA6DF] text-white font-bold text-sm rounded">
              Upcoming
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border-2 border-[#EBEBEB] rounded-lg hover:shadow-md transition-all">
            <div>
              <p className="font-bold text-gray-900 mb-1">Afternoon Dose</p>
              <p className="text-sm text-gray-600 font-semibold">1:00 PM</p>
            </div>
            <div className="px-4 py-1.5 bg-[#EBEBEB] text-gray-700 font-bold text-sm rounded">
              Scheduled
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border-2 border-[#EBEBEB] rounded-lg hover:shadow-md transition-all">
            <div>
              <p className="font-bold text-gray-900 mb-1">Evening Dose</p>
              <p className="text-sm text-gray-600 font-semibold">8:00 PM</p>
            </div>
            <div className="px-4 py-1.5 bg-[#EBEBEB] text-gray-700 font-bold text-sm rounded">
              Scheduled
            </div>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b-2 border-[#EBEBEB] last:border-0">
            <div className="h-2.5 w-2.5 rounded-full bg-[#0BA6DF] mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Dose taken on time</p>
              <p className="text-sm text-gray-600">Yesterday at 8:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pb-4 border-b-2 border-[#EBEBEB] last:border-0">
            <div className="h-2.5 w-2.5 rounded-full bg-[#0BA6DF] mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Dose taken on time</p>
              <p className="text-sm text-gray-600">Yesterday at 1:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FAA533] mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Dose taken (5 min delay)</p>
              <p className="text-sm text-gray-600">Yesterday at 8:05 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
