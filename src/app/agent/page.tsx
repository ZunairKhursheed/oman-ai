"use client";

import { useToken as processToken } from "@/app/actions/token-actions";
import { validateUserSession, logoutUser } from "@/app/actions/session-actions";
import { FullScreenWidget } from "@/components/ElevenLabsWidget";
import { AlertCircle, Loader2, LogOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function AgentContent() {
  const [tokenInput, setTokenInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const sessionResult = await validateUserSession();
        if (sessionResult.valid) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleTokenValidation = useCallback(
    async (token: string) => {
      setIsValidating(true);
      setError(null);

      try {
        const result = await processToken(token);

        if (result.valid) {
          setIsAuthenticated(true);
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
    // Only check for URL token if not already authenticated
    if (!isAuthenticated && !isCheckingSession) {
      const urlToken = searchParams.get("token");
      if (urlToken) {
        setTokenFromUrl(urlToken);
        handleTokenValidation(urlToken);
      }
    }
  }, [searchParams, handleTokenValidation, isAuthenticated, isCheckingSession]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      handleTokenValidation(tokenInput.trim());
    }
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Checking session...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="w-screen h-screen relative bg-white rounded-xl shadow-lg flex items-center justify-center flex-col">
        {/* Logout button */}

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="195"
            height="71"
            viewBox="0 0 195 71"
            fill="none"
          >
            <path
              d="M1.45 53L0.75 49.15L28.26 7.85H6L5.16 14.64L1.66 14.08L2.57 4H33.02L33.72 7.85L6.21 49.15H33.16L34.21 40.4L37.64 40.75L36.59 53H1.45ZM51.5935 53.28C45.3868 53.28 42.0968 50.83 41.7235 45.93C41.6768 45.6033 41.6535 45.2767 41.6535 44.95C41.6535 41.03 44.0102 38.4167 48.7235 37.11C51.3368 36.4567 56.3769 35.71 63.8435 34.87V29.48C63.8435 24.3933 61.1835 21.85 55.8635 21.85C52.0368 21.8967 47.9768 22.7833 43.6835 24.51L42.4935 21.5L43.1935 21.22C46.8335 19.6333 49.6102 18.6767 51.5235 18.35C53.4369 18.0233 54.8369 17.86 55.7235 17.86C56.6102 17.8133 57.4502 17.8133 58.2435 17.86C59.0835 17.9067 60.1569 18.1167 61.4635 18.49C62.7702 18.8633 63.8902 19.4 64.8235 20.1C65.8035 20.7533 66.6435 21.7567 67.3435 23.11C68.0435 24.4633 68.3935 26.0733 68.3935 27.94V49.5H73.7835V53H64.5435L63.8435 50.34C59.6435 52.3 55.5602 53.28 51.5935 53.28ZM52.8535 50.06C56.4002 50.06 60.0635 49.2667 63.8435 47.68V37.67C56.8435 37.9033 52.3168 38.37 50.2635 39.07C48.6768 39.49 47.5568 40.26 46.9035 41.38C46.2502 42.4533 45.9235 43.3167 45.9235 43.97C45.9235 44.6233 45.9235 45.0667 45.9235 45.3C46.0635 46.98 46.7868 48.1933 48.0935 48.94C49.4002 49.6867 50.9868 50.06 52.8535 50.06ZM84.2316 21.5H79.5416V18H88.7816V53C88.7816 53.14 88.7816 53.2567 88.7816 53.35C88.7816 55.2167 88.4316 57.06 87.7316 58.88C87.0782 60.7467 86.2616 62.3333 85.2816 63.64C83.2749 66.3467 81.4316 68.33 79.7516 69.59L78.7016 70.36L76.6016 67.63C81.7349 62.73 84.2782 57.8533 84.2316 53V21.5ZM86.4016 8.62C85.4682 8.62 84.7216 8.34 84.1616 7.78C83.6482 7.17333 83.3916 6.40333 83.3916 5.47C83.3916 4.49 83.6716 3.72 84.2316 3.16C84.7916 2.55333 85.5382 2.25 86.4716 2.25C87.4049 2.25 88.1516 2.55333 88.7116 3.16C89.2716 3.72 89.5516 4.51333 89.5516 5.54C89.5516 6.52 89.2482 7.29 88.6416 7.85C88.0816 8.36333 87.3349 8.62 86.4016 8.62ZM96.1671 21.5V18H105.407V49.5H110.657V53H96.5171V49.5H100.857V21.5H96.1671ZM103.027 8.62C102.094 8.62 101.37 8.34 100.857 7.78C100.344 7.17333 100.087 6.40333 100.087 5.47C100.087 4.49 100.344 3.72 100.857 3.16C101.417 2.55333 102.164 2.25 103.097 2.25C104.03 2.25 104.777 2.55333 105.337 3.16C105.944 3.72 106.247 4.51333 106.247 5.54C106.247 6.52 105.944 7.29 105.337 7.85C104.73 8.36333 103.96 8.62 103.027 8.62ZM114.079 4V0.499996H123.319V49.5H128.569V53H114.429V49.5H118.769V4H114.079ZM133.724 50.97C133.724 50.0833 133.934 49.3833 134.354 48.87C134.82 48.3567 135.427 48.1 136.174 48.1C137.807 48.1 138.624 49.0567 138.624 50.97C138.624 51.7633 138.39 52.3933 137.924 52.86C137.457 53.3267 136.874 53.56 136.174 53.56C134.54 53.56 133.724 52.6967 133.724 50.97ZM154.064 53.28C147.858 53.28 144.568 50.83 144.194 45.93C144.148 45.6033 144.124 45.2767 144.124 44.95C144.124 41.03 146.481 38.4167 151.194 37.11C153.808 36.4567 158.848 35.71 166.314 34.87V29.48C166.314 24.3933 163.654 21.85 158.334 21.85C154.508 21.8967 150.448 22.7833 146.154 24.51L144.964 21.5L145.664 21.22C149.304 19.6333 152.081 18.6767 153.994 18.35C155.908 18.0233 157.308 17.86 158.194 17.86C159.081 17.8133 159.921 17.8133 160.714 17.86C161.554 17.9067 162.628 18.1167 163.934 18.49C165.241 18.8633 166.361 19.4 167.294 20.1C168.274 20.7533 169.114 21.7567 169.814 23.11C170.514 24.4633 170.864 26.0733 170.864 27.94V49.5H176.254V53H167.014L166.314 50.34C162.114 52.3 158.031 53.28 154.064 53.28ZM155.324 50.06C158.871 50.06 162.534 49.2667 166.314 47.68V37.67C159.314 37.9033 154.788 38.37 152.734 39.07C151.148 39.49 150.028 40.26 149.374 41.38C148.721 42.4533 148.394 43.3167 148.394 43.97C148.394 44.6233 148.394 45.0667 148.394 45.3C148.534 46.98 149.258 48.1933 150.564 48.94C151.871 49.6867 153.458 50.06 155.324 50.06ZM179.702 21.5V18H188.942V49.5H194.192V53H180.052V49.5H184.392V21.5H179.702ZM186.562 8.62C185.629 8.62 184.906 8.34 184.392 7.78C183.879 7.17333 183.622 6.40333 183.622 5.47C183.622 4.49 183.879 3.72 184.392 3.16C184.952 2.55333 185.699 2.25 186.632 2.25C187.566 2.25 188.312 2.55333 188.872 3.16C189.479 3.72 189.782 4.51333 189.782 5.54C189.782 6.52 189.479 7.29 188.872 7.85C188.266 8.36333 187.496 8.62 186.562 8.62Z"
              fill="#000000"
            />
          </svg>
        </div>
        <FullScreenWidget agentId={"agent_01jwb1w01nf2n88f5spzfdjwkp"} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Access Voice Call
              </h1>
              <p className="text-gray-600">
                Enter your access token to start using the voice call feature
              </p>
              <p className="text-sm text-orange-600 mt-2 font-medium">
                Tokens are single-use only and create a 24-hour session
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
                    Token will be consumed and create a 24-hour session
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
