import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Medication Reminder Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitor your medication schedule and adherence
          </p>
        </div>
        <Badge className="w-fit bg-green-500 hover:bg-green-600">
          <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
          Arduino Online
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Adherence Rate</CardDescription>
            <CardTitle className="text-4xl">95%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">This week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-4xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Days without missing</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Delay</CardDescription>
            <CardTitle className="text-4xl">2m</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">Last 7 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Next Dose</CardDescription>
            <CardTitle className="text-4xl">8:00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">In 2 hours</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Medication Schedule</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Morning Dose */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Morning Dose</p>
                <p className="text-sm text-gray-600">8:00 AM</p>
              </div>
              <Badge className="w-fit bg-blue-500 hover:bg-blue-600">Upcoming</Badge>
            </div>

            {/* Afternoon Dose */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Afternoon Dose</p>
                <p className="text-sm text-gray-600">1:00 PM</p>
              </div>
              <Badge variant="secondary" className="w-fit">Scheduled</Badge>
            </div>

            {/* Evening Dose */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Evening Dose</p>
                <p className="text-sm text-gray-600">8:00 PM</p>
              </div>
              <Badge variant="secondary" className="w-fit">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest medication events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Dose taken on time</p>
                <p className="text-sm text-gray-500">Yesterday at 8:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Dose taken on time</p>
                <p className="text-sm text-gray-500">Yesterday at 1:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Dose taken (5 min delay)</p>
                <p className="text-sm text-gray-500">Yesterday at 8:05 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
