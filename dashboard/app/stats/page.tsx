export default function StatsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Statistics</h1>
        <p className="text-gray-600">Track your medication adherence over time</p>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Overview</h2>

        <div className="grid grid-cols-7 gap-2 mb-5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="text-center">
              <div className="text-xs font-bold text-gray-500 mb-1">{day}</div>
              <div className={`h-16 rounded border-2 flex items-center justify-center text-lg font-bold ${
                i < 5 ? 'bg-[#0BA6DF] border-[#0BA6DF] text-white' :
                i === 5 ? 'bg-[#FAA533] border-[#FAA533] text-white' :
                'bg-white border-[#EBEBEB] text-gray-300'
              }`}>
                {i < 6 ? '3/3' : '-'}
              </div>
              <div className="text-xs text-gray-600 mt-1">{i < 6 ? '100%' : 'N/A'}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-[#F0F9FF] border border-[#0BA6DF] rounded">
            <p className="text-xs font-bold text-gray-600">DOSES TAKEN</p>
            <p className="text-2xl font-bold text-gray-900">18/21</p>
          </div>
          <div className="text-center p-3 bg-[#FFF5ED] border border-[#EF7722] rounded">
            <p className="text-xs font-bold text-gray-600">ADHERENCE</p>
            <p className="text-2xl font-bold text-gray-900">85.7%</p>
          </div>
          <div className="text-center p-3 bg-[#F0F9FF] border border-[#0BA6DF] rounded">
            <p className="text-xs font-bold text-gray-600">AVG DELAY</p>
            <p className="text-2xl font-bold text-gray-900">3.2m</p>
          </div>
        </div>
      </div>

      {/* Monthly & Time of Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Adherence</h3>
          <div className="space-y-3">
            {[
              { month: 'December', value: 95, color: '#0BA6DF' },
              { month: 'November', value: 88, color: '#EF7722' },
              { month: 'October', value: 92, color: '#0BA6DF' },
              { month: 'September', value: 85, color: '#FAA533' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                </div>
                <div className="h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Time of Day</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#FFF5ED] border border-[#EF7722] rounded">
              <div>
                <p className="font-bold text-gray-900 text-sm">Morning (8:00 AM)</p>
                <p className="text-xs text-gray-600">Best performance</p>
              </div>
              <p className="text-xl font-bold text-[#EF7722]">98%</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-[#EBEBEB] rounded">
              <div>
                <p className="font-bold text-gray-900 text-sm">Afternoon (1:00 PM)</p>
                <p className="text-xs text-gray-600">Good</p>
              </div>
              <p className="text-xl font-bold text-gray-900">90%</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F0F9FF] border border-[#0BA6DF] rounded">
              <div>
                <p className="font-bold text-gray-900 text-sm">Evening (8:00 PM)</p>
                <p className="text-xs text-gray-600">Room for improvement</p>
              </div>
              <p className="text-xl font-bold text-[#0BA6DF]">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak History */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Streak History</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-4 border-2 border-[#0BA6DF] rounded bg-[#F0F9FF]">
            <p className="text-xs font-bold text-gray-600 mb-1">CURRENT</p>
            <p className="text-3xl font-bold text-[#0BA6DF]">7</p>
            <p className="text-xs text-gray-600 mt-1">days</p>
          </div>
          <div className="text-center p-4 border-2 border-[#EBEBEB] rounded">
            <p className="text-xs font-bold text-gray-600 mb-1">LONGEST</p>
            <p className="text-3xl font-bold text-gray-900">24</p>
            <p className="text-xs text-gray-600 mt-1">days</p>
          </div>
          <div className="text-center p-4 border-2 border-[#EBEBEB] rounded">
            <p className="text-xs font-bold text-gray-600 mb-1">TOTAL</p>
            <p className="text-3xl font-bold text-gray-900">45</p>
            <p className="text-xs text-gray-600 mt-1">days</p>
          </div>
          <div className="text-center p-4 border-2 border-[#EBEBEB] rounded">
            <p className="text-xs font-bold text-gray-600 mb-1">MISSED</p>
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600 mt-1">doses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
