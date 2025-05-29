"use server";

import {
  createAccessToken,
  validateToken,
  recordTokenUsage,
  getTokenUsageStats,
  cleanupExpiredTokens,
} from "@/lib/token";
import { createSession } from "@/lib/session";
import { headers, cookies } from "next/headers";

export async function generateNewToken() {
  try {
    const token = await createAccessToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${appUrl}/agent?token=${token}`;

    return {
      success: true,
      token,
      shareUrl,
      message:
        "Token generated successfully. Single-use only - creates 24-hour session when used.",
    };
  } catch (error) {
    console.error("Error generating token:", error);
    return {
      success: false,
      message: "Failed to generate token",
    };
  }
}

export async function validateAccessToken(token: string) {
  try {
    const validation = await validateToken(token);
    return validation;
  } catch (error) {
    console.error("Error validating token:", error);
    return {
      valid: false,
      message: "Error validating token",
    };
  }
}

export async function useToken(token: string) {
  try {
    // First validate the token
    const validation = await validateToken(token);

    if (!validation.valid) {
      return validation;
    }

    // Get request headers for tracking
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ipAddress = forwardedFor || realIp || undefined;

    // Record the token usage (this will mark it as used)
    const usageResult = await recordTokenUsage(token, userAgent, ipAddress);

    if (!usageResult.success) {
      return {
        valid: false,
        message: usageResult.message || "Failed to record token usage",
      };
    }

    // Create a new session for the user
    const sessionId = await createSession(token, userAgent, ipAddress);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return {
      valid: true,
      message: "Token consumed successfully. Session created for 24 hours.",
      sessionId,
      tokenInfo: validation.tokenInfo,
    };
  } catch (error) {
    console.error("Error using token:", error);
    return {
      valid: false,
      message: "Error processing token",
    };
  }
}

export async function getTokenStats(token: string) {
  try {
    const stats = await getTokenUsageStats(token);
    return stats;
  } catch (error) {
    console.error("Error getting token stats:", error);
    return {
      success: false,
      message: "Error retrieving token statistics",
    };
  }
}

export async function cleanupTokens() {
  try {
    const result = await cleanupExpiredTokens();
    return result;
  } catch (error) {
    console.error("Error cleaning up tokens:", error);
    return {
      success: false,
      message: "Failed to cleanup expired tokens",
    };
  }
}
