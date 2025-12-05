/**
 * Arduino Serial Communication API with Database Integration
 *
 * This API endpoint handles all communication between the Next.js website
 * and the Arduino via Serial port (USB connection) + stores user data in PostgreSQL.
 *
 * How it works:
 * 1. Client (browser) sends HTTP request to this API
 * 2. API authenticates user from session
 * 3. API reads/writes user's alarms from/to PostgreSQL database
 * 4. If physical Arduino connected (USE_MOCK = false):
 *    - API opens serial connection to Arduino
 *    - API sends command via Serial (e.g., "GET_ALARMS")
 *    - Arduino processes command and responds
 *    - API syncs database with Arduino
 * 5. API sends JSON response back to client
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Configuration
const USE_MOCK = true; // Set to false when using real Arduino hardware
const BAUD_RATE = 9600;
const COMMAND_TIMEOUT = 5000;

/**
 * Type definitions for better code understanding
 */
interface Alarm {
  hour: number;
  minute: number;
  enabled: boolean;
}

interface ArduinoStatus {
  powered: boolean;
  hour: number;
  minute: number;
  dayOfWeek: number;
}

/**
 * Mock Arduino Communication (for testing without hardware)
 */
async function mockSendCommand(command: string, userId: string): Promise<string> {
  // Simulate Arduino delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get user's alarms from database
  const userAlarms = await prisma.alarm.findMany({
    where: { userId },
    orderBy: { index: 'asc' }
  });

  if (command === 'GET_ALARMS') {
    if (userAlarms.length === 0) {
      // Create default alarms for new user
      const defaultAlarms = [
        { index: 0, hour: 8, minute: 0, enabled: true },
        { index: 1, hour: 13, minute: 0, enabled: true },
        { index: 2, hour: 20, minute: 0, enabled: true },
      ];

      await prisma.alarm.createMany({
        data: defaultAlarms.map(alarm => ({
          ...alarm,
          userId
        }))
      });

      return `ALARMS:8:0:1:13:0:1:20:0:1`;
    }

    return `ALARMS:${userAlarms[0].hour}:${userAlarms[0].minute}:${userAlarms[0].enabled ? 1 : 0}:${userAlarms[1].hour}:${userAlarms[1].minute}:${userAlarms[1].enabled ? 1 : 0}:${userAlarms[2].hour}:${userAlarms[2].minute}:${userAlarms[2].enabled ? 1 : 0}`;
  }

  if (command.startsWith('SET_ALARM:')) {
    const parts = command.split(':');
    const index = parseInt(parts[1]);
    const hour = parseInt(parts[2]);
    const minute = parseInt(parts[3]);

    if (index >= 0 && index < 3) {
      // Update alarm in database
      await prisma.alarm.upsert({
        where: {
          userId_index: {
            userId,
            index
          }
        },
        update: {
          hour,
          minute
        },
        create: {
          userId,
          index,
          hour,
          minute,
          enabled: true
        }
      });

      return `OK:${index}:${hour}:${minute}`;
    }
  }

  if (command.startsWith('TOGGLE_ALARM:')) {
    const index = parseInt(command.split(':')[1]);
    if (index >= 0 && index < 3) {
      const alarm = await prisma.alarm.findUnique({
        where: {
          userId_index: {
            userId,
            index
          }
        }
      });

      if (alarm) {
        const updated = await prisma.alarm.update({
          where: {
            userId_index: {
              userId,
              index
            }
          },
          data: {
            enabled: !alarm.enabled
          }
        });

        return `OK:${index}:${updated.enabled ? 1 : 0}`;
      }
    }
  }

  if (command === 'GET_STATUS') {
    const now = new Date();
    return `STATUS:1:${now.getHours()}:${now.getMinutes()}:${now.getDay()}`;
  }

  return 'ERROR:UNKNOWN_COMMAND';
}

/**
 * Send command to Arduino (or mock)
 */
async function sendCommand(command: string, userId: string): Promise<string> {
  if (USE_MOCK) {
    console.log(`[MOCK] User: ${userId} - Sending command: ${command}`);
    const response = await mockSendCommand(command, userId);
    console.log(`[MOCK] Response: ${response}`);
    return response;
  }

  // Real Arduino communication would go here
  // For now, since serialport doesn't work in browser environments,
  // we'll use mock mode
  throw new Error('Real Arduino communication not implemented yet. Set USE_MOCK = true');
}

/**
 * Parse alarm data from Arduino's response
 */
function parseAlarms(response: string): Alarm[] {
  const data = response.replace('ALARMS:', '');
  const values = data.split(':').map(v => parseInt(v, 10));

  const alarms: Alarm[] = [];
  for (let i = 0; i < values.length; i += 3) {
    alarms.push({
      hour: values[i],
      minute: values[i + 1],
      enabled: values[i + 2] === 1,
    });
  }

  return alarms;
}

/**
 * Parse status data from Arduino's response
 */
function parseStatus(response: string): ArduinoStatus {
  const data = response.replace('STATUS:', '');
  const values = data.split(':').map(v => parseInt(v, 10));

  return {
    powered: values[0] === 1,
    hour: values[1],
    minute: values[2],
    dayOfWeek: values[3],
  };
}

/**
 * GET /api/arduino?action=get_alarms
 * GET /api/arduino?action=get_status
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'get_alarms') {
      // Send GET_ALARMS command to Arduino (or database in mock mode)
      const response = await sendCommand('GET_ALARMS', user.id);
      const alarms = parseAlarms(response);

      return NextResponse.json({
        success: true,
        alarms,
      });
    }

    if (action === 'get_status') {
      const response = await sendCommand('GET_STATUS', user.id);
      const status = parseStatus(response);

      return NextResponse.json({
        success: true,
        status,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use ?action=get_alarms or ?action=get_status' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/arduino
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action, index, hour, minute } = body;

    if (action === 'set_alarm') {
      // Validate input
      if (typeof index !== 'number' || typeof hour !== 'number' || typeof minute !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Missing or invalid parameters: index, hour, minute' },
          { status: 400 }
        );
      }

      if (index < 0 || index > 2) {
        return NextResponse.json(
          { success: false, error: 'Index must be 0, 1, or 2' },
          { status: 400 }
        );
      }

      if (hour < 0 || hour > 23) {
        return NextResponse.json(
          { success: false, error: 'Hour must be 0-23' },
          { status: 400 }
        );
      }

      if (minute < 0 || minute > 59) {
        return NextResponse.json(
          { success: false, error: 'Minute must be 0-59' },
          { status: 400 }
        );
      }

      // Send SET_ALARM command (updates database in mock mode, sends to Arduino in real mode)
      const command = `SET_ALARM:${index}:${hour}:${minute}`;
      const response = await sendCommand(command, user.id);

      if (response.startsWith('OK:')) {
        return NextResponse.json({
          success: true,
          message: `Alarm ${index} set to ${hour}:${minute}`,
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Unexpected response: ' + response },
          { status: 500 }
        );
      }
    }

    if (action === 'toggle_alarm') {
      // Validate input
      if (typeof index !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Missing or invalid parameter: index' },
          { status: 400 }
        );
      }

      if (index < 0 || index > 2) {
        return NextResponse.json(
          { success: false, error: 'Index must be 0, 1, or 2' },
          { status: 400 }
        );
      }

      // Send TOGGLE_ALARM command
      const command = `TOGGLE_ALARM:${index}`;
      const response = await sendCommand(command, user.id);

      if (response.startsWith('OK:')) {
        const parts = response.split(':');
        const enabled = parts[2] === '1';

        return NextResponse.json({
          success: true,
          enabled,
          message: `Alarm ${index} is now ${enabled ? 'enabled' : 'disabled'}`,
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Unexpected response: ' + response },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "set_alarm" or "toggle_alarm"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
