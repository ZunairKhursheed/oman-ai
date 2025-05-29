import Link from "next/link";
import { ArrowLeft, Shield, Eye, Trash2, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-12">
              <div className="flex justify-center items-center mb-6">
                <div className="bg-blue-500 p-4 rounded-full">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-blue-500" />
                  Information We Collect
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Voice Agent is committed to protecting your privacy. We
                    collect minimal information necessary to provide our voice
                    assistant service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Access Tokens:</strong> Single-use tokens for
                      secure access to the voice agent
                    </li>
                    <li>
                      <strong>Voice Data:</strong> Audio input processed locally
                      in your browser for speech recognition
                    </li>
                    <li>
                      <strong>Conversation Data:</strong> Text conversations
                      stored temporarily during your session
                    </li>
                    <li>
                      <strong>Usage Analytics:</strong> Basic usage statistics
                      to improve our service
                    </li>
                    <li>
                      <strong>Session Data:</strong> Temporary session
                      information stored for 24 hours after token consumption
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-green-500" />
                  How We Use Your Information
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Providing voice assistant services and processing your
                      requests
                    </li>
                    <li>
                      Generating appropriate responses to your voice and text
                      inputs
                    </li>
                    <li>
                      Maintaining secure access through token-based
                      authentication
                    </li>
                    <li>Improving our AI models and service quality</li>
                    <li>Ensuring system security and preventing abuse</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-purple-500" />
                  Data Protection & Security
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We implement robust security measures to protect your data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Token-Based Access:</strong> Single-use tokens
                      that create 24-hour sessions for secure access
                    </li>
                    <li>
                      <strong>Local Processing:</strong> Voice recognition
                      happens in your browser
                    </li>
                    <li>
                      <strong>Encrypted Storage:</strong> All stored data is
                      encrypted using industry standards
                    </li>
                    <li>
                      <strong>Minimal Data Retention:</strong> We keep data only
                      as long as necessary
                    </li>
                    <li>
                      <strong>No Permanent Voice Storage:</strong> Audio data is
                      not permanently stored
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Trash2 className="w-6 h-6 mr-2 text-red-500" />
                  User Data Deletion Policy
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We respect your right to control your personal data.
                    Here&apos;s our data deletion policy:
                  </p>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">
                      Automatic Data Deletion
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-red-700">
                      <li>Access tokens are automatically deleted after use</li>
                      <li>Used tokens are immediately marked as invalid</li>
                      <li>
                        Session data is cleared when sessions expire (24 hours)
                      </li>
                      <li>Conversation history is not permanently stored</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Manual Data Deletion Requests
                    </h3>
                    <p className="text-blue-700 mb-2">
                      You can request deletion of any remaining data by
                      contacting us at:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Email: privacy@voiceagent.com</li>
                      <li>We will respond within 30 days</li>
                      <li>All associated data will be permanently deleted</li>
                      <li>You will receive confirmation of deletion</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      What Gets Deleted
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-green-700">
                      <li>All access tokens associated with your requests</li>
                      <li>Any temporary conversation data</li>
                      <li>Usage analytics linked to your sessions</li>
                      <li>All backup copies of your data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Third-Party Services
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>We use the following third-party services:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>ElevenLabs:</strong> For voice synthesis
                      (text-to-speech)
                    </li>
                    <li>
                      <strong>MongoDB:</strong> For secure token storage
                    </li>
                    <li>
                      <strong>Browser APIs:</strong> For speech recognition
                      (processed locally)
                    </li>
                  </ul>
                  <p>
                    These services have their own privacy policies, and we
                    encourage you to review them.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Your Rights
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    You have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Right to access your personal data</li>
                    <li>Right to rectify inaccurate data</li>
                    <li>Right to delete your data (as outlined above)</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      <li>
                        <strong>Email:</strong> privacy@voiceagent.com
                      </li>
                      <li>
                        <strong>Data Protection Officer:</strong>{" "}
                        dpo@voiceagent.com
                      </li>
                      <li>
                        <strong>Response Time:</strong> Within 30 days
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Changes to This Policy
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the &quot;Last updated&quot; date.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically
                    for any changes.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
