import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, Scale, Clock } from "lucide-react";

export default function TermsPage() {
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
                  <FileText className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Terms & Conditions
              </h1>
              <p className="text-lg text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Scale className="w-6 h-6 mr-2 text-blue-500" />
                  Acceptance of Terms
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    By accessing and using Voice Agent (&quot;the
                    Service&quot;), you accept and agree to be bound by the
                    terms and provision of this agreement. If you do not agree
                    to abide by the above, please do not use this service.
                  </p>
                  <p>
                    These Terms of Service (&quot;Terms&quot;) govern your use
                    of our voice assistant application and related services
                    provided by Voice Agent (&quot;we&quot;, &quot;us&quot;, or
                    &quot;our&quot;).
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-green-500" />
                  Service Description
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Voice Agent provides:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>AI-powered voice assistant capabilities</li>
                    <li>Speech recognition and text-to-speech synthesis</li>
                    <li>Token-based secure access system</li>
                    <li>Natural language conversation interface</li>
                    <li>Real-time voice interaction processing</li>
                  </ul>
                  <p>
                    The service is provided &quot;as is&quot; and we reserve the
                    right to modify, suspend, or discontinue any aspect of the
                    service at any time.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-purple-500" />
                  Access Tokens & Usage
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our token-based access system operates under the following
                    terms:
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Token Validity
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>
                        Each access token is valid for 24 hours from creation
                      </li>
                      <li>
                        Tokens can be used multiple times within their 24-hour
                        validity period
                      </li>
                      <li>Used or expired tokens cannot be reactivated</li>
                      <li>
                        You are responsible for keeping your tokens secure
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Usage Restrictions
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700">
                      <li>Do not share tokens with unauthorized parties</li>
                      <li>
                        Do not attempt to reverse engineer or hack the system
                      </li>
                      <li>
                        Do not use the service for illegal or harmful purposes
                      </li>
                      <li>Respect rate limits and fair usage policies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
                  Prohibited Uses
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    You agree not to use the Service for any of the following
                    prohibited activities:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violating any applicable laws or regulations</li>
                    <li>
                      Transmitting harmful, offensive, or inappropriate content
                    </li>
                    <li>
                      Attempting to gain unauthorized access to our systems
                    </li>
                    <li>Interfering with or disrupting the service</li>
                    <li>Using the service to harass, abuse, or harm others</li>
                    <li>Generating spam or unsolicited communications</li>
                    <li>Impersonating others or providing false information</li>
                    <li>Commercial use without explicit permission</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Intellectual Property Rights
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    The Service and its original content, features, and
                    functionality are and will remain the exclusive property of
                    Voice Agent and its licensors. The Service is protected by
                    copyright, trademark, and other laws.
                  </p>
                  <p>
                    You retain ownership of any content you provide to the
                    Service, but you grant us a limited license to use, process,
                    and respond to your inputs for the purpose of providing the
                    voice assistant service.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Privacy & Data Protection
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Your privacy is important to us. Please review our Privacy
                    Policy, which also governs your use of the Service, to
                    understand our practices.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Key Privacy Points
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-green-700">
                      <li>Voice processing happens locally in your browser</li>
                      <li>Conversation data is not permanently stored</li>
                      <li>
                        Access tokens automatically expire and are deleted
                      </li>
                      <li>You can request data deletion at any time</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Disclaimers & Limitations
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">
                      Service Availability
                    </h3>
                    <p className="text-red-700">
                      We do not guarantee that the Service will be available at
                      all times. The Service may be subject to interruptions,
                      delays, or errors.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      AI Response Accuracy
                    </h3>
                    <p className="text-yellow-700">
                      While we strive for accuracy, AI responses may not always
                      be correct, complete, or appropriate. Use the information
                      provided at your own discretion.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Limitation of Liability
                    </h3>
                    <p className="text-gray-700">
                      To the maximum extent permitted by law, Voice Agent shall
                      not be liable for any indirect, incidental, special,
                      consequential, or punitive damages.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Termination
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may terminate or suspend your access immediately, without
                    prior notice or liability, for any reason whatsoever,
                    including without limitation if you breach the Terms.
                  </p>
                  <p>
                    Upon termination, your right to use the Service will cease
                    immediately. All provisions of the Terms which by their
                    nature should survive termination shall survive termination.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Changes to Terms
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material,
                    we will try to provide at least 30 days notice prior to any
                    new terms taking effect.
                  </p>
                  <p>
                    What constitutes a material change will be determined at our
                    sole discretion. By continuing to access or use our Service
                    after those revisions become effective, you agree to be
                    bound by the revised terms.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Governing Law
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    These Terms shall be interpreted and governed by the laws of
                    the jurisdiction in which Voice Agent operates, without
                    regard to its conflict of law provisions.
                  </p>
                  <p>
                    Our failure to enforce any right or provision of these Terms
                    will not be considered a waiver of those rights.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions about these Terms & Conditions,
                    please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      <li>
                        <strong>Email:</strong> legal@voiceagent.com
                      </li>
                      <li>
                        <strong>Terms Questions:</strong> terms@voiceagent.com
                      </li>
                      <li>
                        <strong>Response Time:</strong> Within 7 business days
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
