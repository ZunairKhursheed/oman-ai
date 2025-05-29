"use server";

import {
  validateSession,
  deleteSession,
  cleanupExpiredSessions,
} from "@/lib/session";
import { cookies } from "next/headers";
import { cleanupExpiredTokens } from "@/lib/token";

export async function validateUserSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
      return {
        valid: false,
        message: "No session found",
      };
    }

    const validation = await validateSession(sessionId);
    return validation;
  } catch (error) {
    console.error("Error validating session:", error);
    return {
      valid: false,
      message: "Error validating session",
    };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Clear the session cookie
    cookieStore.delete("session_id");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      success: false,
      message: "Error logging out",
    };
  }
}

export async function cleanupExpiredData() {
  try {
    // Cleanup expired sessions
    const sessionCleanup = await cleanupExpiredSessions();

    // Cleanup expired tokens
    const tokenCleanup = await cleanupExpiredTokens();

    return {
      success: true,
      message: `Cleanup completed. ${
        sessionCleanup.deletedCount || 0
      } sessions and ${tokenCleanup.deletedCount || 0} tokens removed.`,
      sessionsDeleted: sessionCleanup.deletedCount || 0,
      tokensDeleted: tokenCleanup.deletedCount || 0,
    };
  } catch (error) {
    console.error("Error during cleanup:", error);
    return {
      success: false,
      message: "Error during cleanup process",
    };
  }
}
