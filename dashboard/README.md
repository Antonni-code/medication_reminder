# Medication Reminder Dashboard

A Next.js web dashboard for managing and monitoring the Arduino-based Medication Reminder system.

## Features

- **Real-time Device Monitoring** - View online/offline status of your Arduino device
- **Alarm Management** - Configure medication reminder times remotely
- **History Tracking** - View detailed logs of all medication doses
- **Statistics & Analytics** - Analyze adherence patterns and trends
- **Mobile Responsive** - Access from any device (desktop, tablet, mobile)
- **Cloud Sync** - Automatically syncs with Arduino via Firebase

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase Realtime Database
- **Deployment**: Vercel

## Project Structure

```
dashboard/
├── app/
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Home dashboard
│   ├── alarms/              # Alarm configuration page
│   ├── history/             # Medication log history
│   ├── stats/               # Statistics and charts
│   ├── settings/            # Device settings
│   └── api/                 # API routes (to be implemented)
│       ├── alarms/
│       ├── logs/
│       └── status/
├── components/              # Reusable React components
├── lib/                     # Utility functions and Firebase config
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the dashboard folder:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

### Phase 1: Current (Dashboard Development)

- [x] Set up Next.js project structure
- [x] Create all main pages (Dashboard, Alarms, History, Stats, Settings)
- [x] Implement responsive UI with Tailwind CSS
- [ ] Set up Firebase project
- [ ] Implement API routes
- [ ] Connect frontend to Firebase
- [ ] Deploy to Vercel

### Phase 2: Firebase Integration

1. Create Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Generate service account credentials
4. Add Firebase configuration to project
5. Implement API routes in `app/api/`
6. Test with manual Firebase data

### Phase 3: Arduino Connection (ESP32)

1. Migrate Arduino code to ESP32
2. Add WiFi connectivity
3. Implement Firebase HTTP requests
4. Test end-to-end synchronization

## Environment Variables

Create a `.env.local` file in the dashboard directory:

```env
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
```

## Firebase Database Structure

```json
{
  "devices": {
    "arduino_001": {
      "alarms": [
        { "hour": 8, "minute": 0, "enabled": true, "label": "Morning" },
        { "hour": 13, "minute": 0, "enabled": true, "label": "Afternoon" },
        { "hour": 20, "minute": 0, "enabled": true, "label": "Evening" }
      ],
      "status": {
        "online": true,
        "lastSeen": "2025-12-03T10:30:00Z",
        "currentAlarmActive": false
      },
      "logs": {
        "20251203_080200": {
          "doseIndex": 0,
          "status": "taken",
          "scheduledTime": "08:00",
          "actualTime": "08:02"
        }
      }
    }
  }
}
```

## Deployment to Vercel

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy!

Your dashboard will be live at: `https://your-project.vercel.app`

## API Endpoints (To Be Implemented)

- `GET /api/alarms` - Fetch current alarms
- `PUT /api/alarms` - Update alarm settings
- `GET /api/logs` - Fetch medication history
- `POST /api/logs` - Create new log entry (from Arduino)
- `GET /api/status` - Get device status

## Contributing

This is a personal medication reminder project. For issues or suggestions, refer to the main project documentation.

## License

ISC
