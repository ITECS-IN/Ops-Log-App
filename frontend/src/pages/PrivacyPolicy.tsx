import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/ui/AppLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Ops-log';
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Ops-log Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: 16/11/2025</p>

            <p className="text-lg text-gray-700 mb-6">
              Ops-Log is a manufacturing operations management platform for real-time production visibility.
              It is developed and operated by:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="font-semibold text-gray-900">ITECS – Industrial Tech Solutions</p>
              <p className="text-gray-700">Legal Entity: E.I Sanjay KUMAR</p>
              <p className="text-gray-700">Registered Address: 320 Rue des Sorbiers, 74300 Thyez, France</p>
              <p className="text-gray-700">SIRET: 924 283 799 00022</p>
              <p className="text-gray-700">Email: <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a></p>
            </div>

            <p className="text-gray-700 mb-8">
              ITECS is committed to protecting your personal data in accordance with the EU General Data Protection Regulation (GDPR).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Data We Collect</h2>
            <p className="text-gray-700 mb-4">We collect only the information required to operate the Ops-Log platform.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Account & Authentication Data</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Email address</li>
              <li>Password (hashed by Firebase Authentication)</li>
              <li>Company name</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Production & Operational Data</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Operator names and assigned shifts</li>
              <li>Machine names, line identifiers</li>
              <li>Production logs, downtime events, comments</li>
              <li>Photos and videos uploaded by users (up to 12 MB)</li>
              <li>Timestamps, durations, severity levels</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Technical Data</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>IP address</li>
              <li>Browser and device information</li>
              <li>Error logs and diagnostic information</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>No financial data is collected through Ops-Log.</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Purpose of Processing</h2>
            <p className="text-gray-700 mb-4">Your data is used to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Provide and operate the Ops-Log service</li>
              <li>Authenticate users</li>
              <li>Store and display production logs</li>
              <li>Generate analysis, KPIs, and metrics</li>
              <li>Improve platform reliability and performance</li>
              <li>Provide customer support</li>
              <li>Maintain platform security and auditing</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>We never sell your data to third parties.</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Legal Basis (GDPR)</h2>
            <p className="text-gray-700 mb-4">Ops-Log processes your data based on:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Contractual necessity</strong> — to deliver the service</li>
              <li><strong>Legitimate interest</strong> — security, performance, product improvement</li>
              <li><strong>Consent</strong> — for optional file uploads (photos/videos)</li>
              <li><strong>Legal obligation</strong> — regulatory compliance</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Hosting Locations</h2>
            <p className="text-gray-700 mb-4">Your data is stored exclusively in the European Union:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Backend (NestJS): Hostinger VPS (EU datacenter)</li>
              <li>Database: MongoDB Atlas (EU region)</li>
              <li>Authentication: Firebase Authentication (EU region)</li>
              <li>Media Storage: Firebase Storage (EU region)</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>We do not transfer your data outside the EU.</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Active accounts:</strong> data retained for the duration of the subscription</li>
              <li><strong>Account deletion:</strong> data removed within 60 days</li>
              <li><strong>Media files:</strong> deleted within 30 days</li>
              <li><strong>Authentication data:</strong> removed immediately</li>
              <li><strong>Backups:</strong> encrypted and retained for up to 90 days</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. User Rights</h2>
            <p className="text-gray-700 mb-4">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Access your data</li>
              <li>Request correction</li>
              <li>Request deletion ("right to be forgotten")</li>
              <li>Restrict or object to processing</li>
              <li>Export your data ("data portability")</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise your rights, contact: <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a>
            </p>
            <p className="text-gray-700 mb-6"><strong>We respond within 30 days.</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Security Measures</h2>
            <p className="text-gray-700 mb-4">Ops-Log uses industry-standard security measures, including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Firebase JWT authentication</li>
              <li>HTTPS/TLS encryption</li>
              <li>Encrypted database storage</li>
              <li>Multi-tenant data isolation</li>
              <li>Role-based access control</li>
              <li>Secured API architecture</li>
              <li>Encrypted backups</li>
              <li>Strict administrator access control</li>
            </ul>
            <p className="text-gray-700 mb-6">See the Security Page for full technical details.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Sharing of Data</h2>
            <p className="text-gray-700 mb-4">
              We only share data with GDPR-compliant technical providers necessary to operate the platform:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Firebase / Google Cloud</strong> — Authentication & Media Storage</li>
              <li><strong>MongoDB Atlas</strong> — Database hosting</li>
              <li><strong>Hostinger</strong> — Server infrastructure</li>
            </ul>
            <p className="text-gray-700 mb-4">These providers act strictly as data processors.</p>
            <p className="text-gray-700 mb-6"><strong>We never share data for advertising or unrelated purposes.</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Sub-processors</h2>
            <p className="text-gray-700 mb-6">We maintain an updated list of sub-processors on the Security Page.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Children's Data</h2>
            <p className="text-gray-700 mb-4">Ops-Log is not intended for users under 16 years old.</p>
            <p className="text-gray-700 mb-6">We do not knowingly process data from minors.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">This policy may be updated from time to time.</p>
            <p className="text-gray-700 mb-6">Major updates will be communicated via email or in-app notifications.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">For privacy questions or requests:</p>
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
