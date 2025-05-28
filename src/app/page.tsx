import Link from "next/link";
import { Mic, Shield, FileText, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full">
              <Mic className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Voice Agent</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of AI conversation with our intelligent voice
            assistant. Powered by advanced AI and natural voice synthesis.
          </p>
        </header>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Voice Agent?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Natural Voice Interaction
              </h3>
              <p className="text-gray-600">
                Speak naturally and get human-like responses with advanced voice
                synthesis technology.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Access
              </h3>
              <p className="text-gray-600">
                Time-limited tokens ensure secure access with automatic
                expiration for enhanced privacy.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-pink-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Sharing
              </h3>
              <p className="text-gray-600">
                Generate shareable links with tokens for seamless access
                management.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="text-center">
          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <Link
              href="/privacy"
              className="hover:text-blue-500 transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-blue-500 transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Terms & Conditions
            </Link>
          </div>
          <p className="text-gray-500 mt-4">
            © 2024 Voice Agent. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
