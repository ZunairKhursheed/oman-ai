"use server";

import {
  createAccessToken,
  validateToken,
  recordTokenUsage,
  getTokenUsageStats,
  cleanupExpiredTokens,
} from "@/lib/token";
import { headers } from "next/headers";

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
        "Token generated successfully. Valid for 24 hours with unlimited uses.",
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

    // Record the token usage (multiple uses allowed)
    const usageResult = await recordTokenUsage(token, userAgent, ipAddress);

    if (!usageResult.success) {
      return {
        valid: false,
        message: usageResult.message || "Failed to record token usage",
      };
    }

    return {
      valid: true,
      message: `Token validated successfully. Usage count: ${usageResult.usageCount}`,
      usageCount: usageResult.usageCount,
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
