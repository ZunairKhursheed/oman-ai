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
      <div className="w-screen h-screen relative bg-white rounded-xl shadow-lg flex items-center justify-center flex-col">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="129"
            height="71"
            viewBox="0 0 129 71"
            fill="#000000"
          >
            <path
              d="M1.45 53L0.75 49.15L28.26 7.85H6L5.16 14.64L1.66 14.08L2.57 4H33.02L33.72 7.85L6.21 49.15H33.16L34.21 40.4L37.64 40.75L36.59 53H1.45ZM51.5935 53.28C45.3868 53.28 42.0968 50.83 41.7235 45.93C41.6768 45.6033 41.6535 45.2767 41.6535 44.95C41.6535 41.03 44.0102 38.4167 48.7235 37.11C51.3368 36.4567 56.3769 35.71 63.8435 34.87V29.48C63.8435 24.3933 61.1835 21.85 55.8635 21.85C52.0368 21.8967 47.9768 22.7833 43.6835 24.51L42.4935 21.5L43.1935 21.22C46.8335 19.6333 49.6102 18.6767 51.5235 18.35C53.4369 18.0233 54.8369 17.86 55.7235 17.86C56.6102 17.8133 57.4502 17.8133 58.2435 17.86C59.0835 17.9067 60.1569 18.1167 61.4635 18.49C62.7702 18.8633 63.8902 19.4 64.8235 20.1C65.8035 20.7533 66.6435 21.7567 67.3435 23.11C68.0435 24.4633 68.3935 26.0733 68.3935 27.94V49.5H73.7835V53H64.5435L63.8435 50.34C59.6435 52.3 55.5602 53.28 51.5935 53.28ZM52.8535 50.06C56.4002 50.06 60.0635 49.2667 63.8435 47.68V37.67C56.8435 37.9033 52.3168 38.37 50.2635 39.07C48.6768 39.49 47.5568 40.26 46.9035 41.38C46.2502 42.4533 45.9235 43.3167 45.9235 43.97C45.9235 44.6233 45.9235 45.0667 45.9235 45.3C46.0635 46.98 46.7868 48.1933 48.0935 48.94C49.4002 49.6867 50.9868 50.06 52.8535 50.06ZM84.2316 21.5H79.5416V18H88.7816V53C88.7816 53.14 88.7816 53.2567 88.7816 53.35C88.7816 55.2167 88.4316 57.06 87.7316 58.88C87.0782 60.7467 86.2616 62.3333 85.2816 63.64C83.2749 66.3467 81.4316 68.33 79.7516 69.59L78.7016 70.36L76.6016 67.63C81.7349 62.73 84.2782 57.8533 84.2316 53V21.5ZM86.4016 8.62C85.4682 8.62 84.7216 8.34 84.1616 7.78C83.6482 7.17333 83.3916 6.40333 83.3916 5.47C83.3916 4.49 83.6716 3.72 84.2316 3.16C84.7916 2.55333 85.5382 2.25 86.4716 2.25C87.4049 2.25 88.1516 2.55333 88.7116 3.16C89.2716 3.72 89.5516 4.51333 89.5516 5.54C89.5516 6.52 89.2482 7.29 88.6416 7.85C88.0816 8.36333 87.3349 8.62 86.4016 8.62ZM96.1671 21.5V18H105.407V49.5H110.657V53H96.5171V49.5H100.857V21.5H96.1671ZM103.027 8.62C102.094 8.62 101.37 8.34 100.857 7.78C100.344 7.17333 100.087 6.40333 100.087 5.47C100.087 4.49 100.344 3.72 100.857 3.16C101.417 2.55333 102.164 2.25 103.097 2.25C104.03 2.25 104.777 2.55333 105.337 3.16C105.944 3.72 106.247 4.51333 106.247 5.54C106.247 6.52 105.944 7.29 105.337 7.85C104.73 8.36333 103.96 8.62 103.027 8.62ZM114.079 4V0.499996H123.319V49.5H128.569V53H114.429V49.5H118.769V4H114.079Z"
              fill="#000000"
            />
          </svg>
        </div>
        {/* <VoiceAgent onTokenExpired={handleTokenExpired} /> */}
        <FullScreenWidget agentId={"agent_01jwb1w01nf2n88f5spzfdjwkp"} />
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
