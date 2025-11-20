import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/ui/AppLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

const CONTACT_EMAIL = 'contact@itecs.fr';
const SECURITY_EMAIL = 'security@itecs.fr';

const splitTranslation = (text: string, token: string): [string, string] => {
  if (!token) {
    return [text, ''];
  }

  const index = text.indexOf(token);
  if (index === -1) {
    return [text, ''];
  }

  return [text.slice(0, index), text.slice(index + token.length)];
};

export default function Security() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = 'Security | Ops-log';
    window.scrollTo(0, 0);
  }, []);

  const privacyPolicyLabel = t('legal.privacyPolicy', 'Privacy Policy');
  const complianceNote = t('security.section7.note', 'For full compliance details, see our Privacy Policy.');
  const [complianceBefore, complianceAfter] = splitTranslation(complianceNote, privacyPolicyLabel);

  const disclosureText = t(
    'security.section9.text2',
    'Contact us at: 📧 security@itecs.fr (or use contact@itecs.fr)'
  );
  const [disclosureBeforeSecurity, disclosureAfterSecurity] = splitTranslation(disclosureText, SECURITY_EMAIL);
  const [disclosureBetweenEmails, disclosureAfterContact] = splitTranslation(disclosureAfterSecurity, CONTACT_EMAIL);

  const subprocessors = [
    {
      provider: t('security.section6.row1.provider', 'Hostinger'),
      purpose: t('security.section6.row1.purpose', 'VPS / App Servers'),
      region: t('security.section6.row1.region', 'EU'),
      compliance: t('security.section6.row1.compliance', 'GDPR, ISO 27001'),
    },
    {
      provider: t('security.section6.row2.provider', 'MongoDB Atlas'),
      purpose: t('security.section6.row2.purpose', 'Database'),
      region: t('security.section6.row2.region', 'EU'),
      compliance: t('security.section6.row2.compliance', 'SOC 2, GDPR'),
    },
    {
      provider: t('security.section6.row3.provider', 'Firebase Authentication'),
      purpose: t('security.section6.row3.purpose', 'Identity'),
      region: t('security.section6.row3.region', 'EU'),
      compliance: t('security.section6.row3.compliance', 'ISO 27001, GDPR'),
    },
    {
      provider: t('security.section6.row4.provider', 'Firebase Storage'),
      purpose: t('security.section6.row4.purpose', 'Media storage'),
      region: t('security.section6.row4.region', 'EU'),
      compliance: t('security.section6.row4.compliance', 'ISO 27001, GDPR'),
    },
    {
      provider: t('security.section6.row5.provider', 'Google Cloud'),
      purpose: t('security.section6.row5.purpose', 'Infrastructure'),
      region: t('security.section6.row5.region', 'EU'),
      compliance: t('security.section6.row5.compliance', 'SOC 2, ISO 27001'),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <AppLogo size={32} className="sm:block md:hidden" />
              <AppLogo size={40} className="hidden sm:block" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">Ops-log</span>
            </Link>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher size="sm" />
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                {t('common.signIn', 'Sign In')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg prose-gray max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('security.title', 'Ops-log Security')}</h1>
            <p className="text-gray-600 mb-8">{t('security.lastUpdated', 'Last updated: 16/11/2025')}</p>

            <p className="text-lg text-gray-700 mb-6">
              {t(
                'security.intro1',
                'Security is a core priority of Ops-Log, a manufacturing operations management platform developed by ITECS – Industrial Tech Solutions (E.I Sanjay KUMAR).'
              )}
            </p>
            <p className="text-gray-700 mb-6">
              {t(
                'security.intro2',
                'We design every layer of the platform with confidentiality, integrity, and availability in mind — from authentication to infrastructure.'
              )}
            </p>
            <p className="text-gray-700 mb-6">{t('security.intro3', 'This page explains the security measures, practices, and policies that protect your data.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section1.title', '1. Infrastructure Security')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section1.1.title', '1.1 Hosting Environment')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section1.1.intro', 'Ops-Log is hosted on:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section1.1.item1', 'Hostinger VPS (EU Datacenter) – Application servers')}</li>
              <li>{t('security.section1.1.item2', 'MongoDB Atlas (EU Region) – Database storage')}</li>
              <li>{t('security.section1.1.item3', 'Firebase Authentication (EU Region) – Identity management')}</li>
              <li>{t('security.section1.1.item4', 'Firebase Storage (EU Region) – Photos/videos and media files')}</li>
            </ul>
            <p className="text-gray-700 mb-4">{t('security.section1.1.intro2', 'All infrastructure providers comply with:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section1.1.item5', 'ISO 27001')}</li>
              <li>{t('security.section1.1.item6', 'SOC 2')}</li>
              <li>{t('security.section1.1.item7', 'GDPR')}</li>
              <li>{t('security.section1.1.item8', 'EU data residency requirements')}</li>
            </ul>
            <p className="text-gray-700 mb-6">
              <strong>{t('security.section1.1.note', 'No data is stored outside the European Union.')}</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section2.title', '2. Network Security')}</h2>
            <p className="text-gray-700 mb-4">{t('security.section2.intro', 'We apply multiple layers of network protection:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section2.item1', 'Enforced HTTPS/TLS 1.2+ for all data transmissions')}</li>
              <li>{t('security.section2.item2', 'Firewalls restricting inbound/outbound traffic')}</li>
              <li>{t('security.section2.item3', 'Secure network segmentation')}</li>
              <li>{t('security.section2.item4', 'Automatic rate-limiting and throttling')}</li>
              <li>{t('security.section2.item5', 'Protection against DDoS attacks (Hostinger and Google Cloud)')}</li>
            </ul>
            <p className="text-gray-700 mb-6">
              <strong>{t('security.section2.note', 'All traffic between clients, servers, and storage is encrypted end-to-end.')}</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section3.title', '3. Data Security')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section3.1.title', '3.1 Encryption')}</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('security.section3.1.item1', 'Data in transit → Encrypted using TLS')}</li>
              <li>{t('security.section3.1.item2', 'Data at rest → Encrypted using AES-256 (MongoDB, Firebase, Google Cloud)')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section3.2.title', '3.2 Data Isolation')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section3.2.text1', "Each customer's workspace is logically isolated.")}</p>
            <p className="text-gray-700 mb-6">
              <strong>{t('security.section3.2.text2', "A tenant cannot access another tenant's data—even in error conditions.")}</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section3.3.title', '3.3 Backup & Recovery')}</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('security.section3.3.item1', 'Automated daily backups')}</li>
              <li>{t('security.section3.3.item2', 'Redundant EU storage')}</li>
              <li>{t('security.section3.3.item3', 'Backup retention for up to 90 days')}</li>
              <li>{t('security.section3.3.item4', 'Disaster recovery plan in place')}</li>
              <li>{t('security.section3.3.item5', 'Point-in-time restore capability (MongoDB Atlas)')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section4.title', '4. Application Security')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section4.1.title', '4.1 Authentication')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section4.1.intro', 'Ops-Log uses Firebase Authentication with:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section4.1.item1', 'Secure hashed passwords (Google-managed)')}</li>
              <li>{t('security.section4.1.item2', 'Token-based authentication (JWT)')}</li>
              <li>{t('security.section4.1.item3', 'Optional multi-device sign-in')}</li>
              <li>{t('security.section4.1.item4', 'Automatic token refresh and expiration')}</li>
              <li>{t('security.section4.1.item5', 'Protection against credential stuffing')}</li>
            </ul>
            <p className="text-gray-700 mb-6">
              <strong>{t('security.section4.1.note', 'No passwords are ever stored on Ops-Log servers.')}</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section4.2.title', '4.2 Authorization')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section4.2.intro', 'Role-based access control (RBAC):')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section4.2.item1', 'Admin')}</li>
              <li>{t('security.section4.2.item2', 'Supervisor')}</li>
              <li>{t('security.section4.2.item3', 'Operator')}</li>
              <li>{t('security.section4.2.item4', 'Viewer')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('security.section4.2.note', 'Permissions are strictly enforced on both frontend and backend.')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section4.3.title', '4.3 Input & File Validation')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section4.3.intro', 'All uploads (photos/videos) are:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section4.3.item1', 'Virus-scanned')}</li>
              <li>{t('security.section4.3.item2', 'Size-limited (max 12 MB)')}</li>
              <li>{t('security.section4.3.item3', 'Sanitized to prevent injection attacks')}</li>
              <li>{t('security.section4.3.item4', 'Stored in secure Firebase Storage buckets')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('security.section4.3.note', 'All user-generated input is validated and sanitized server-side.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section5.title', '5. Operational Security')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section5.1.title', '5.1 Admin Access Control')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section5.1.text1', 'Only authorized ITECS personnel may access the production environment.')}</p>
            <p className="text-gray-700 mb-4">{t('security.section5.1.intro', 'Access is:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('security.section5.1.item1', 'Strictly limited')}</li>
              <li>{t('security.section5.1.item2', 'Logged')}</li>
              <li>{t('security.section5.1.item3', 'Reviewed periodically')}</li>
              <li>{t('security.section5.1.item4', 'Protected by MFA')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section5.2.title', '5.2 Development Practices')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section5.2.intro', 'Ops-Log follows secure development standards:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('security.section5.2.item1', 'Code reviews')}</li>
              <li>{t('security.section5.2.item2', 'Static analysis (where applicable)')}</li>
              <li>{t('security.section5.2.item3', 'Patch management')}</li>
              <li>{t('security.section5.2.item4', 'OWASP recommendations')}</li>
              <li>{t('security.section5.2.item5', 'Separation of development, test, and production environments')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('security.section5.3.title', '5.3 Monitoring & Logging')}</h3>
            <p className="text-gray-700 mb-4">{t('security.section5.3.intro', 'System logs include:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section5.3.item1', 'Authentication events')}</li>
              <li>{t('security.section5.3.item2', 'Admin access')}</li>
              <li>{t('security.section5.3.item3', 'API usage')}</li>
              <li>{t('security.section5.3.item4', 'Unexpected errors')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('security.section5.3.note', 'Logs are monitored to detect unusual activity.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section6.title', '6. Third-Party Subprocessors')}</h2>
            <p className="text-gray-700 mb-4">{t('security.section6.intro', 'Ops-Log uses the following secure providers:')}</p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      {t('security.section6.table.provider', 'Provider')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      {t('security.section6.table.purpose', 'Purpose')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      {t('security.section6.table.region', 'Region')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      {t('security.section6.table.compliance', 'Compliance')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subprocessors.map(({ provider, purpose, region, compliance }) => (
                    <tr key={provider}>
                      <td className="px-6 py-4 text-sm text-gray-900">{provider}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{purpose}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{region}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 mb-4">{t('security.section6.note1', 'ITECS signs or relies on Data Processing Agreements (DPAs) with all subprocessors.')}</p>
            <p className="text-gray-700 mb-6">
              <strong>{t('security.section6.note2', 'We never use advertising platforms or analytics that access customer data.')}</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section7.title', '7. GDPR Compliance')}</h2>
            <p className="text-gray-700 mb-4">{t('security.section7.text1', 'Ops-Log is fully compliant with the General Data Protection Regulation (GDPR).')}</p>
            <p className="text-gray-700 mb-4">{t('security.section7.intro', 'Key commitments:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('security.section7.item1', 'EU-only data residency')}</li>
              <li>{t('security.section7.item2', 'Right to access, modify, delete, or export data')}</li>
              <li>{t('security.section7.item3', 'Right to restrict processing')}</li>
              <li>{t('security.section7.item4', 'Right to object')}</li>
              <li>{t('security.section7.item5', 'No sale or commercial use of user data')}</li>
              <li>{t('security.section7.item6', 'Subprocessors bound by GDPR-compliant agreements')}</li>
            </ul>
            <p className="text-gray-700 mb-6">
              {complianceBefore}
              <Link to="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline">
                {privacyPolicyLabel}
              </Link>
              {complianceAfter}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section8.title', '8. Incident Response')}</h2>
            <p className="text-gray-700 mb-4">{t('security.section8.intro', 'In the event of a security breach:')}</p>
            <ol className="list-decimal pl-6 mb-4 text-gray-700">
              <li>{t('security.section8.item1', 'We immediately isolate affected systems')}</li>
              <li>{t('security.section8.item2', 'Assess scope and impact')}</li>
              <li>{t('security.section8.item3', 'Notify affected customers')}</li>
              <li>{t('security.section8.item4', 'Follow GDPR breach reporting obligations')}</li>
              <li>{t('security.section8.item5', 'Apply fixes and strengthen protections')}</li>
              <li>{t('security.section8.item6', 'Document root cause analysis')}</li>
            </ol>
            <p className="text-gray-700 mb-6">{t('security.section8.note', 'Ops-Log maintains internal incident response procedures.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section9.title', '9. Responsible Disclosure')}</h2>
            <p className="text-gray-700 mb-4">{t('security.section9.text1', 'If you discover a vulnerability, we encourage responsible reporting.')}</p>
            <p className="text-gray-700 mb-4">
              {disclosureBeforeSecurity}
              <a href={`mailto:${SECURITY_EMAIL}`} className="text-brand-600 hover:text-brand-700">
                {SECURITY_EMAIL}
              </a>
              {disclosureBetweenEmails}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 hover:text-brand-700">
                {CONTACT_EMAIL}
              </a>
              {disclosureAfterContact}
            </p>
            <p className="text-gray-700 mb-4">{t('security.section9.intro', 'We commit to:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('security.section9.item1', 'Acknowledging reports')}</li>
              <li>{t('security.section9.item2', 'Providing timely fixes')}</li>
              <li>{t('security.section9.item3', 'Offering transparent communication')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('security.section10.title', '10. Contact')}</h2>
            <p className="text-gray-700 mb-4">{t('security.section10.intro', 'For security questions, audits, or compliance requests:')}</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                📧{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 hover:text-brand-700">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                📍 {t('privacy.company.name', 'ITECS – Industrial Tech Solutions')},
              </p>
              <p className="text-gray-700 ml-6">{t('privacy.company.address', '320 Rue des Sorbiers, 74300 Thyez, France')}</p>
            </div>
          </article>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
            >
              {t('privacy.backToHome', 'Back to Home')}
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            {t(
              'landing.footer.copyright',
              `Copyright © ${new Date().getFullYear()} ITECS | Industrial Tech Solution. Tous Droits Réservés.`
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
