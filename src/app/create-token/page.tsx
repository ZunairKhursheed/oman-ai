"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Clock,
  Link as LinkIcon,
} from "lucide-react";
import { generateNewToken } from "@/app/actions/token-actions";

export default function CreateTokenPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenData, setTokenData] = useState<{
    token: string;
    shareUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateNewToken();

      if (result.success && result.token && result.shareUrl) {
        setTokenData({
          token: result.token,
          shareUrl: result.shareUrl,
        });
      } else {
        setError(result.message || "Failed to generate token");
      }
    } catch (error) {
      console.error("Error generating token:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-green-500 p-4 rounded-full">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Access Token
            </h1>
            <p className="text-lg text-gray-600">
              Generate a secure access token for the Voice Agent (single-use
              only, creates 24-hour session)
            </p>
          </div>

          {/* Token Generation */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {!tokenData ? (
              <div className="text-center">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Generate New Token
                  </h2>
                  <div className="space-y-4 text-left">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Single-Use Only
                        </p>
                        <p className="text-sm text-gray-600">
                          Token can only be used once to create a session
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          24-Hour Session
                        </p>
                        <p className="text-sm text-gray-600">
                          Creates a 24-hour session after token consumption
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <LinkIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Shareable Link
                        </p>
                        <p className="text-sm text-gray-600">
                          Get a direct link to share with others
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerateToken}
                  disabled={isGenerating}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Generating..." : "Generate Access Token"}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Token Generated Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Your access token has been created and is ready to use.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Token */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Token
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tokenData.token}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(tokenData.token)}
                        className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Share URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shareable URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tokenData.shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(tokenData.shareUrl)}
                        className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4 pt-4">
                    <Link
                      href={tokenData.shareUrl}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-6 rounded-lg transition-colors"
                    >
                      Test Token
                    </Link>
                    <button
                      onClick={() => {
                        setTokenData(null);
                        setError(null);
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>

                {/* Warning */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Save this token and URL now.
                    Once you leave this page, you won&apos;t be able to retrieve
                    them again. The token is single-use only and will create a
                    24-hour session when used.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
