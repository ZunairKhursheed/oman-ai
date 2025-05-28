"use client";

import { useToken as processToken } from "@/app/actions/token-actions";
import { FullScreenWidget } from "@/components/ElevenLabsWidget";
import { AlertCircle, ArrowLeft, Clock, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function AgentContent() {
  const [tokenInput, setTokenInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<{
    createdAt: Date;
    expiresAt: Date;
    usageCount: number;
    lastUsedAt?: Date;
  } | null>(null);
  const [usageCount, setUsageCount] = useState<number>(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTokenValidation = useCallback(
    async (token: string) => {
      setIsValidating(true);
      setError(null);

      try {
        const result = await processToken(token);

        if (result.valid) {
          setIsAuthenticated(true);
          setTokenInfo(result.tokenInfo || null);
          setUsageCount("usageCount" in result ? result.usageCount || 0 : 0);
          // Remove token from URL for security
          if (tokenFromUrl) {
            router.replace("/agent", { scroll: false });
          }
        } else {
          setError(result.message || "Invalid token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setError("An error occurred while validating the token");
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    },
    [router, tokenFromUrl]
  );

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setTokenFromUrl(urlToken);
      handleTokenValidation(urlToken);
    }
  }, [searchParams, handleTokenValidation]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      handleTokenValidation(tokenInput.trim());
    }
  };

  const formatTimeRemaining = (expiresAt: Date | string) => {
    const now = new Date();
    const expiry =
      typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>

              {/* Token Status */}
              <div className="flex items-center space-x-4">
                {tokenInfo && (
                  <>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Uses: {usageCount}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatTimeRemaining(tokenInfo.expiresAt)}</span>
                    </div>
                  </>
                )}
                <div className="text-sm text-green-600 font-medium">
                  Session Active
                </div>
              </div>
            </div>

            {/* Token Info Banner */}
            {tokenInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Token Status:</span> Active
                    </div>
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Total Uses:</span>{" "}
                      {usageCount}
                    </div>
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Expires:</span>{" "}
                      {formatTimeRemaining(tokenInfo.expiresAt)}
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    You can use this token multiple times until it expires
                  </div>
                </div>
              </div>
            )}

            {/* Voice Call Interface */}
            <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-280px)] flex items-center justify-center">
              {/* <VoiceAgent onTokenExpired={handleTokenExpired} /> */}
              <FullScreenWidget agentId={"agent_01jwb1w01nf2n88f5spzfdjwkp"} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Access Voice Call
              </h1>
              <p className="text-gray-600">
                Enter your access token to start using the voice call feature
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Tokens are valid for 24 hours and can be used multiple times
              </p>
            </div>

            {isValidating ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Validating token...</p>
              </div>
            ) : (
              <form onSubmit={handleTokenSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Access Denied</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Access Token
                  </label>
                  <input
                    type="text"
                    id="token"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter your access token"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Token can be reused multiple times within 24 hours
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!tokenInput.trim() || isValidating}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Access Voice Call
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have a token?{" "}
                <Link
                  href="/create-token"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Generate one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      }
    >
      <AgentContent />
    </Suspense>
  );
}
