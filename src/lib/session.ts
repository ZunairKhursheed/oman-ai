import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "./mongodb";

export interface UserSession {
  _id?: string;
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date;
  tokenUsed: string; // The original token that created this session
  userAgent?: string;
  ipAddress?: string;
}

export async function createSession(
  tokenUsed: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  const sessionId = uuidv4();
  const db = await getDatabase();

  // Session expires in 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const session: UserSession = {
    sessionId,
    createdAt: new Date(),
    expiresAt,
    lastAccessedAt: new Date(),
    tokenUsed,
    userAgent,
    ipAddress,
  };

  await db.collection("user_sessions").insertOne({
    ...session,
    _id: undefined,
  });

  return sessionId;
}

export async function validateSession(sessionId: string): Promise<{
  valid: boolean;
  message?: string;
  sessionInfo?: {
    createdAt: Date;
    expiresAt: Date;
    lastAccessedAt: Date;
  };
}> {
  if (!sessionId) {
    return { valid: false, message: "Session ID is required" };
  }

  const db = await getDatabase();
  const sessionDoc = await db
    .collection("user_sessions")
    .findOne({ sessionId });

  if (!sessionDoc) {
    return { valid: false, message: "Invalid session" };
  }

  if (new Date() > sessionDoc.expiresAt) {
    // Clean up expired session
    await db.collection("user_sessions").deleteOne({ sessionId });
    return { valid: false, message: "Session has expired" };
  }

  // Update last accessed time
  await db
    .collection("user_sessions")
    .updateOne({ sessionId }, { $set: { lastAccessedAt: new Date() } });

  return {
    valid: true,
    message: "Session is valid",
    sessionInfo: {
      createdAt: sessionDoc.createdAt,
      expiresAt: sessionDoc.expiresAt,
      lastAccessedAt: new Date(),
    },
  };
}

export async function deleteSession(sessionId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const db = await getDatabase();
    const result = await db
      .collection("user_sessions")
      .deleteOne({ sessionId });

    return {
      success: result.deletedCount > 0,
      message:
        result.deletedCount > 0 ? "Session deleted" : "Session not found",
    };
  } catch (error) {
    console.error("Error deleting session:", error);
    return {
      success: false,
      message: "Failed to delete session",
    };
  }
}

export async function cleanupExpiredSessions(): Promise<{
  success: boolean;
  deletedCount?: number;
  message?: string;
}> {
  try {
    const db = await getDatabase();
    const result = await db.collection("user_sessions").deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} expired sessions`,
    };
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
    return {
      success: false,
      message: "Failed to cleanup expired sessions",
    };
  }
}
