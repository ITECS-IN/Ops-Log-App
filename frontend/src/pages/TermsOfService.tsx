import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/ui/AppLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service | Ops-log';
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <AppLogo size={32} className="sm:block md:hidden" />
              <AppLogo size={40} className="hidden sm:block" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">Ops-log</span>
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher size="sm" />
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg prose-gray max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Ops-log – Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: 16/11/2025</p>

            <p className="text-lg text-gray-700 mb-6">
              These Terms of Service ("Terms") govern your access to and use of the Ops-Log platform, operated by:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="font-semibold text-gray-900">ITECS – Industrial Tech Solutions</p>
              <p className="text-gray-700">Legal Entity: E.I Sanjay KUMAR</p>
              <p className="text-gray-700">Registered Address: 320 Rue des Sorbiers, 74300 Thyez, France</p>
              <p className="text-gray-700">SIRET: 924 283 799 00022</p>
              <p className="text-gray-700">Contact Email: <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a></p>
            </div>

            <p className="text-gray-700 mb-4">
              <strong>By creating an account, accessing, or using Ops-Log, you agree to these Terms.</strong>
            </p>
            <p className="text-gray-700 mb-8">
              If you do not agree, you must stop using the platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Definitions</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>"Platform" / "Service"</strong> refers to Ops-Log, including web application, APIs, storage, analytics, and all related services.</li>
              <li><strong>"Company", "We", "Us", "ITECS"</strong> refers to ITECS – Industrial Tech Solutions (E.I Sanjay Kumar).</li>
              <li><strong>"User"</strong> refers to any individual accessing or using the Platform.</li>
              <li><strong>"Customer"</strong> refers to the company or legal entity on whose behalf the User accesses the Platform.</li>
              <li><strong>"Data"</strong> refers to production data, logs, photos, videos, operator names, and any information submitted into Ops-Log.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 mb-4">You must:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Be at least 16 years old</li>
              <li>Have the authority to bind your company (if applicable)</li>
              <li>Provide accurate account information</li>
            </ul>
            <p className="text-gray-700 mb-6">ITECS may refuse or terminate accounts at its discretion.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Description of Service</h2>
            <p className="text-gray-700 mb-4">Ops-Log is a cloud-based manufacturing operations management platform providing:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Real-time production visibility</li>
              <li>Downtime logging</li>
              <li>Shift and operator management</li>
              <li>Photo/video attachments</li>
              <li>Analytics, KPIs, and dashboards</li>
              <li>Administrative tools</li>
              <li>Multi-site management</li>
              <li>Secure cloud storage</li>
            </ul>
            <p className="text-gray-700 mb-6">ITECS may modify features or update the Service at any time.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Account Registration</h2>
            <p className="text-gray-700 mb-4">Users must create an account using:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>A valid email</li>
              <li>A secure password</li>
            </ul>
            <p className="text-gray-700 mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Keeping login credentials confidential</li>
              <li>All activity under your account</li>
              <li>Ensuring your operators follow company policies</li>
            </ul>
            <p className="text-gray-700 mb-6">ITECS is not responsible for unauthorized access due to weak or shared passwords.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Upload illegal, abusive, or harmful content</li>
              <li>Attempt to hack, disrupt, or reverse-engineer the platform</li>
              <li>Interfere with server or network operations</li>
              <li>Upload malicious code</li>
              <li>Use the platform to store personal data beyond what is required for production operations</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
            <p className="text-gray-700 mb-6">ITECS reserves the right to suspend accounts violating these rules.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Customer Data</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Ownership</h3>
            <p className="text-gray-700 mb-4">
              All production data, logs, photos, videos, and operator information submitted by users remain the property of the Customer.
            </p>
            <p className="text-gray-700 mb-6"><strong>ITECS claims no ownership over your data.</strong></p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 License</h3>
            <p className="text-gray-700 mb-4">You grant ITECS a limited, revocable license to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Store your data</li>
              <li>Process it to provide the Service</li>
              <li>Generate analytics for your account</li>
              <li>Maintain backups and logs</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>ITECS will never use your data for advertising or any external purpose.</strong></p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.3 Data Protection</h3>
            <p className="text-gray-700 mb-6">All data is processed in accordance with our <Link to="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline">Privacy Policy</Link> and GDPR requirements.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Subscription, Billing & Payments</h2>
            <p className="text-gray-700 mb-4">Ops-Log is a subscription-based SaaS service.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Billing</h3>
            <p className="text-gray-700 mb-4">Unless otherwise agreed in writing:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Subscriptions are billed in advance</li>
              <li>Payments are non-refundable once the subscription period begins</li>
              <li>Late payments may result in account suspension</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Pricing</h3>
            <p className="text-gray-700 mb-6">Prices may change, but you will be notified in advance.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3 Free Trials</h3>
            <p className="text-gray-700 mb-6">ITECS may offer free trials. After expiry, continued usage requires a paid subscription.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Service Availability & Support</h2>
            <p className="text-gray-700 mb-4">ITECS aims to maintain high availability but does not guarantee:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Continuous, uninterrupted service</li>
              <li>Absence of bugs or errors</li>
              <li>Real-time access at all times</li>
            </ul>
            <p className="text-gray-700 mb-4">ITECS provides:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Technical support via email</li>
              <li>Updates, fixes, and improvements</li>
              <li>Reasonable maintenance windows</li>
            </ul>
            <p className="text-gray-700 mb-6">Planned downtime will be communicated when possible.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 By Customer</h3>
            <p className="text-gray-700 mb-6">You may cancel your subscription at any time by contacting us at <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a>.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 By ITECS</h3>
            <p className="text-gray-700 mb-4">We may terminate or suspend accounts for:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Violation of these Terms</li>
              <li>Non-payment</li>
              <li>Misuse of the platform</li>
              <li>Security or legal risks</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 Effect of Termination</h3>
            <p className="text-gray-700 mb-4">Upon termination:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access is disabled</li>
              <li>Data is deleted according to our Privacy Policy</li>
              <li>No refunds are issued for the ongoing billing cycle</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              Ops-Log, including its design, code, logos, trademarks, and content, is owned exclusively by ITECS – Industrial Tech Solutions.
            </p>
            <p className="text-gray-700 mb-4">You may not:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Copy or reproduce the platform</li>
              <li>Reverse-engineer any part of it</li>
              <li>Create derivative works</li>
              <li>Use ITECS branding without permission</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Confidentiality</h2>
            <p className="text-gray-700 mb-4">ITECS agrees to keep all customer data confidential.</p>
            <p className="text-gray-700 mb-4">Customers agree not to disclose:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Platform source code</li>
              <li>Architecture</li>
              <li>Documentation marked "confidential"</li>
              <li>Any non-public information provided by ITECS</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Security</h2>
            <p className="text-gray-700 mb-4">ITECS implements strong measures including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Encrypted databases</li>
              <li>HTTPS/TLS</li>
              <li>Firebase Authentication</li>
              <li>Role-based access</li>
              <li>Multi-tenant isolation</li>
              <li>Strict administrative controls</li>
            </ul>
            <p className="text-gray-700 mb-6">See the Security Page for details.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              <strong>Ops-Log is provided "as is" and "as available."</strong>
            </p>
            <p className="text-gray-700 mb-4">ITECS disclaims all warranties, including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Fitness for a particular purpose</li>
              <li>Error-free operation</li>
              <li>Continuous availability</li>
            </ul>
            <p className="text-gray-700 mb-6">Production decisions and operational safety remain solely the Customer's responsibility.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>ITECS is not liable for indirect, incidental, or consequential damages</li>
              <li>Total liability is limited to the amount paid by the customer in the previous 12 months</li>
              <li>ITECS is not responsible for:
                <ul className="list-circle pl-6 mt-2">
                  <li>Data loss due to customer misuse</li>
                  <li>Incorrect production entries</li>
                  <li>Network issues, operator mistakes, or misconfigurations</li>
                  <li>Third-party failures (Firebase, MongoDB, hosting providers)</li>
                </ul>
              </li>
            </ul>
            <p className="text-gray-700 mb-6">You agree to use the platform responsibly.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Governing Law</h2>
            <p className="text-gray-700 mb-4">These Terms are governed by the laws of France.</p>
            <p className="text-gray-700 mb-6">Any disputes will be handled by the Courts of France.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">16. Changes to the Terms</h2>
            <p className="text-gray-700 mb-4">ITECS may update these Terms when necessary.</p>
            <p className="text-gray-700 mb-4">We will notify users via email or in-app notifications.</p>
            <p className="text-gray-700 mb-6">Continued use of the platform constitutes acceptance.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">17. Contact</h2>
            <p className="text-gray-700 mb-4">For any questions related to these Terms:</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">📧 <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a></p>
              <p className="text-gray-700 mt-2">📍 ITECS – Industrial Tech Solutions,</p>
              <p className="text-gray-700 ml-6">320 Rue des Sorbiers, 74300 Thyez, France</p>
            </div>
          </article>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; 2024 Ops-log. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
