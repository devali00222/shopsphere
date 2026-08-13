import { getDb } from '../../infra/mongo';
import type { ActivityLog } from './activity.types';

const COLLECTION = 'activity_logs';

// Activity logging should not block or fail the user's request.
export async function logActivity(
  entry: ActivityLog,
): Promise<void> {
  const collection = getDb().collection<ActivityLog>(COLLECTION);

  try {
    await collection.insertOne(entry);
  } catch (error) {
    // Logging failures should not affect the user's request.
    console.error('Failed to log activity:', error);
  }
}

// Index user activity lookups by user and newest timestamp.
export async function ensureActivityIndexes(): Promise<void> {
  const collection = getDb().collection<ActivityLog>(COLLECTION);

  await collection.createIndex({
    userId: 1,
    timestamp: -1,
  });

  // Automatically delete activity logs after 90 days.
  await collection.createIndex(
    { timestamp: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 90 },
  );
}