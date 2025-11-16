import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/ui/AppLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function Security() {
  useEffect(() => {
    document.title = 'Security | Ops-log';
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Ops-log Security</h1>
            <p className="text-gray-600 mb-8">Last updated: 16/11/2025</p>

            <p className="text-lg text-gray-700 mb-6">
              Security is a core priority of Ops-Log, a manufacturing operations management platform developed by{' '}
              <strong>ITECS – Industrial Tech Solutions</strong> (E.I Sanjay KUMAR).
            </p>

            <p className="text-gray-700 mb-8">
              We design every layer of the platform with confidentiality, integrity, and availability in mind — from authentication to infrastructure.
            </p>

            <p className="text-gray-700 mb-8">
              This page explains the security measures, practices, and policies that protect your data.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Infrastructure Security</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Hosting Environment</h3>
            <p className="text-gray-700 mb-4">Ops-Log is hosted on:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Hostinger VPS (EU Datacenter)</strong> – Application servers</li>
              <li><strong>MongoDB Atlas (EU Region)</strong> – Database storage</li>
              <li><strong>Firebase Authentication (EU Region)</strong> – Identity management</li>
              <li><strong>Firebase Storage (EU Region)</strong> – Photos/videos and media files</li>
            </ul>
            <p className="text-gray-700 mb-4">All infrastructure providers comply with:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>ISO 27001</li>
              <li>SOC 2</li>
              <li>GDPR</li>
              <li>EU data residency requirements</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>No data is stored outside the European Union.</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Network Security</h2>
            <p className="text-gray-700 mb-4">We apply multiple layers of network protection:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Enforced HTTPS/TLS 1.2+ for all data transmissions</li>
              <li>Firewalls restricting inbound/outbound traffic</li>
              <li>Secure network segmentation</li>
              <li>Automatic rate-limiting and throttling</li>
              <li>Protection against DDoS attacks (Hostinger and Google Cloud)</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>All traffic between clients, servers, and storage is encrypted end-to-end.</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Encryption</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Data in transit</strong> → Encrypted using TLS</li>
              <li><strong>Data at rest</strong> → Encrypted using AES-256 (MongoDB, Firebase, Google Cloud)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Data Isolation</h3>
            <p className="text-gray-700 mb-4">Each customer's workspace is logically isolated.</p>
            <p className="text-gray-700 mb-6">
              <strong>A tenant cannot access another tenant's data—even in error conditions.</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Backup & Recovery</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Automated daily backups</li>
              <li>Redundant EU storage</li>
              <li>Backup retention for up to 90 days</li>
              <li>Disaster recovery plan in place</li>
              <li>Point-in-time restore capability (MongoDB Atlas)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Application Security</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Authentication</h3>
            <p className="text-gray-700 mb-4">Ops-Log uses Firebase Authentication with:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Secure hashed passwords (Google-managed)</li>
              <li>Token-based authentication (JWT)</li>
              <li>Optional multi-device sign-in</li>
              <li>Automatic token refresh and expiration</li>
              <li>Protection against credential stuffing</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>No passwords are ever stored on Ops-Log servers.</strong></p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Authorization</h3>
            <p className="text-gray-700 mb-4">Role-based access control (RBAC):</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Admin</li>
              <li>Supervisor</li>
              <li>Operator</li>
              <li>Viewer</li>
            </ul>
            <p className="text-gray-700 mb-6">Permissions are strictly enforced on both frontend and backend.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Input & File Validation</h3>
            <p className="text-gray-700 mb-4">All uploads (photos/videos) are:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Virus-scanned</li>
              <li>Size-limited (max 12 MB)</li>
              <li>Sanitized to prevent injection attacks</li>
              <li>Stored in secure Firebase Storage buckets</li>
            </ul>
            <p className="text-gray-700 mb-6">All user-generated input is validated and sanitized server-side.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Operational Security</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Admin Access Control</h3>
            <p className="text-gray-700 mb-4">Only authorized ITECS personnel may access the production environment.</p>
            <p className="text-gray-700 mb-4">Access is:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Strictly limited</li>
              <li>Logged</li>
              <li>Reviewed periodically</li>
              <li>Protected by MFA</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Development Practices</h3>
            <p className="text-gray-700 mb-4">Ops-Log follows secure development standards:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Code reviews</li>
              <li>Static analysis (where applicable)</li>
              <li>Patch management</li>
              <li>OWASP recommendations</li>
              <li>Separation of development, test, and production environments</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Monitoring & Logging</h3>
            <p className="text-gray-700 mb-4">System logs include:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Authentication events</li>
              <li>Admin access</li>
              <li>API usage</li>
              <li>Unexpected errors</li>
            </ul>
            <p className="text-gray-700 mb-6">Logs are monitored to detect unusual activity.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Third-Party Subprocessors</h2>
            <p className="text-gray-700 mb-4">Ops-Log uses the following secure providers:</p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Hostinger</td>
                    <td className="px-6 py-4 text-sm text-gray-700">VPS / App Servers</td>
                    <td className="px-6 py-4 text-sm text-gray-700">EU</td>
                    <td className="px-6 py-4 text-sm text-gray-700">GDPR, ISO 27001</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">MongoDB Atlas</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Database</td>
                    <td className="px-6 py-4 text-sm text-gray-700">EU</td>
                    <td className="px-6 py-4 text-sm text-gray-700">SOC 2, GDPR</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Firebase Authentication</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Identity</td>
                    <td className="px-6 py-4 text-sm text-gray-700">EU</td>
                    <td className="px-6 py-4 text-sm text-gray-700">ISO 27001, GDPR</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Firebase Storage</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Media storage</td>
                    <td className="px-6 py-4 text-sm text-gray-700">EU</td>
                    <td className="px-6 py-4 text-sm text-gray-700">ISO 27001, GDPR</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Google Cloud</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Infrastructure</td>
                    <td className="px-6 py-4 text-sm text-gray-700">EU</td>
                    <td className="px-6 py-4 text-sm text-gray-700">SOC 2, ISO 27001</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 mb-4">
              ITECS signs or relies on Data Processing Agreements (DPAs) with all subprocessors.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>We never use advertising platforms or analytics that access customer data.</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. GDPR Compliance</h2>
            <p className="text-gray-700 mb-4">Ops-Log is fully compliant with the General Data Protection Regulation (GDPR).</p>
            <p className="text-gray-700 mb-4">Key commitments:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>EU-only data residency</li>
              <li>Right to access, modify, delete, or export data</li>
              <li>Right to restrict processing</li>
              <li>Right to object</li>
              <li>No sale or commercial use of user data</li>
              <li>Subprocessors bound by GDPR-compliant agreements</li>
            </ul>
            <p className="text-gray-700 mb-6">
              For full compliance details, see our <Link to="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline">Privacy Policy</Link>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Incident Response</h2>
            <p className="text-gray-700 mb-4">In the event of a security breach:</p>
            <ol className="list-decimal pl-6 mb-4 text-gray-700">
              <li>We immediately isolate affected systems</li>
              <li>Assess scope and impact</li>
              <li>Notify affected customers</li>
              <li>Follow GDPR breach reporting obligations</li>
              <li>Apply fixes and strengthen protections</li>
              <li>Document root cause analysis</li>
            </ol>
            <p className="text-gray-700 mb-6">Ops-Log maintains internal incident response procedures.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Responsible Disclosure</h2>
            <p className="text-gray-700 mb-4">If you discover a vulnerability, we encourage responsible reporting.</p>
            <p className="text-gray-700 mb-4">
              Contact us at: 📧{' '}
              <a href="mailto:security@itecs.fr" className="text-brand-600 hover:text-brand-700">security@itecs.fr</a>
              {' '}(or use{' '}
              <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a>)
            </p>
            <p className="text-gray-700 mb-4">We commit to:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Acknowledging reports</li>
              <li>Providing timely fixes</li>
              <li>Offering transparent communication</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact</h2>
            <p className="text-gray-700 mb-4">For security questions, audits, or compliance requests:</p>
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
