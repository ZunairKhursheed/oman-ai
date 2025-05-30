import bcrypt from "bcryptjs";
import type { Document, UpdateFilter } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { getDatabase } from "./mongodb";

export interface TokenUsage {
  usedAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface AccessToken {
  _id?: string;
  token: string;
  hashedToken: string;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  usageHistory: TokenUsage[];
  lastUsedAt?: Date;
  usageCount: number;
}

export async function generateAccessToken(): Promise<{
  token: string;
  hashedToken: string;
}> {
  const token = uuidv4();
  const hashedToken = await bcrypt.hash(token, 12);

  return { token, hashedToken };
}

export async function createAccessToken(): Promise<string> {
  const { token, hashedToken } = await generateAccessToken();
  const db = await getDatabase();

  const expiryHours = Number.parseInt(process.env.TOKEN_EXPIRY_HOURS || "24");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);

  const accessToken: AccessToken = {
    token,
    hashedToken,
    createdAt: new Date(),
    expiresAt,
    isUsed: false,
    usageHistory: [],
    usageCount: 0,
  };

  await db.collection("access_tokens").insertOne({
    ...accessToken,
    _id: undefined, // Explicitly set _id to undefined to let MongoDB generate it
  });

  return token;
}

export async function validateToken(token: string): Promise<{
  valid: boolean;
  message?: string;
  tokenInfo?: {
    createdAt: Date;
    expiresAt: Date;
    usageCount: number;
    lastUsedAt?: Date;
  };
}> {
  if (!token) {
    return { valid: false, message: "Token is required" };
  }

  const db = await getDatabase();
  const tokenDoc = await db.collection("access_tokens").findOne({ token });

  if (!tokenDoc) {
    return { valid: false, message: "Invalid token" };
  }

  if (new Date() > tokenDoc.expiresAt) {
    return { valid: false, message: "Token has expired" };
  }

  // Check if token has already been used (single-use only)
  if (tokenDoc.isUsed) {
    return { valid: false, message: "Token has already been used" };
  }

  return {
    valid: true,
    message: "Token is valid",
    tokenInfo: {
      createdAt: tokenDoc.createdAt,
      expiresAt: tokenDoc.expiresAt,
      usageCount: tokenDoc.usageCount || 0,
      lastUsedAt: tokenDoc.lastUsedAt,
    },
  };
}

export async function recordTokenUsage(
  token: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ success: boolean; message?: string; usageCount?: number }> {
  try {
    const db = await getDatabase();
    const now = new Date();

    // First check if token is already used
    const tokenDoc = await db.collection("access_tokens").findOne({ token });

    if (!tokenDoc) {
      return { success: false, message: "Token not found" };
    }

    if (tokenDoc.isUsed) {
      return { success: false, message: "Token has already been used" };
    }

    const usage: TokenUsage = {
      usedAt: now,
      userAgent,
      ipAddress,
    };

    // Mark token as used (single-use only)
    const updateOperation = {
      $push: { usageHistory: usage },
      $set: {
        lastUsedAt: now,
        isUsed: true, // Mark as used - no further uses allowed
        usedAt: now,
      },
      $inc: { usageCount: 1 },
    } as unknown as UpdateFilter<Document>;

    const result = await db
      .collection("access_tokens")
      .updateOne({ token }, updateOperation);

    if (result.matchedCount === 0) {
      return { success: false, message: "Token not found" };
    }

    return {
      success: true,
      message: "Token consumed successfully",
      usageCount: 1, // Always 1 since it's single-use
    };
  } catch (error) {
    console.error("Error recording token usage:", error);
    return { success: false, message: "Failed to record token usage" };
  }
}

// Deprecated function - kept for backward compatibility
export async function markTokenAsUsed(token: string): Promise<void> {
  console.warn("markTokenAsUsed is deprecated. Use recordTokenUsage instead.");
  await recordTokenUsage(token);
}

export async function getTokenUsageStats(token: string): Promise<{
  success: boolean;
  stats?: {
    createdAt: Date;
    expiresAt: Date;
    usageCount: number;
    lastUsedAt?: Date;
    usageHistory: TokenUsage[];
    isExpired: boolean;
    timeRemaining: string;
  };
  message?: string;
}> {
  try {
    const db = await getDatabase();
    const tokenDoc = await db.collection("access_tokens").findOne({ token });

    if (!tokenDoc) {
      return { success: false, message: "Token not found" };
    }

    const now = new Date();
    const isExpired = now > tokenDoc.expiresAt;
    const timeRemaining = isExpired
      ? "Expired"
      : formatTimeRemaining(tokenDoc.expiresAt.getTime() - now.getTime());

    return {
      success: true,
      stats: {
        createdAt: tokenDoc.createdAt,
        expiresAt: tokenDoc.expiresAt,
        usageCount: tokenDoc.usageCount || 0,
        lastUsedAt: tokenDoc.lastUsedAt,
        usageHistory: tokenDoc.usageHistory || [],
        isExpired,
        timeRemaining,
      },
    };
  } catch (error) {
    console.error("Error getting token stats:", error);
    return { success: false, message: "Failed to get token statistics" };
  }
}

function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export async function cleanupExpiredTokens(): Promise<{
  success: boolean;
  deletedCount?: number;
  message?: string;
}> {
  try {
    const db = await getDatabase();
    const result = await db.collection("access_tokens").deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleaned up ${result.deletedCount} expired tokens`,
    };
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    return {
      success: false,
      message: "Failed to cleanup expired tokens",
    };
  }
}
