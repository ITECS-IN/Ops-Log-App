import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/ui/AppLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

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
                {t('common.signIn', 'Sign In')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg prose-gray max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('privacy.title', 'Ops-log Privacy Policy')}</h1>
            <p className="text-gray-600 mb-8">{t('privacy.lastUpdated', 'Last updated: 16/11/2025')}</p>

            <p className="text-lg text-gray-700 mb-6">
              {t('privacy.intro', 'Ops-Log is a manufacturing operations management platform for real-time production visibility. It is developed and operated by:')}
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="font-semibold text-gray-900">{t('privacy.company.name', 'ITECS – Industrial Tech Solutions')}</p>
              <p className="text-gray-700">{t('privacy.company.legal', 'Legal Entity: E.I Sanjay KUMAR')}</p>
              <p className="text-gray-700">{t('privacy.company.address', 'Registered Address: 320 Rue des Sorbiers, 74300 Thyez, France')}</p>
              <p className="text-gray-700">{t('privacy.company.siret', 'SIRET: 924 283 799 00022')}</p>
              <p className="text-gray-700">{t('privacy.company.email', 'Email:')} <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a></p>
            </div>

            <p className="text-gray-700 mb-8">
              {t('privacy.gdpr', 'ITECS is committed to protecting your personal data in accordance with the EU General Data Protection Regulation (GDPR).')}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section1.title', '1. Data We Collect')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section1.intro', 'We collect only the information required to operate the Ops-Log platform.')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('privacy.section1.1.title', '1.1 Account & Authentication Data')}</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('privacy.section1.1.item1', 'Email address')}</li>
              <li>{t('privacy.section1.1.item2', 'Password (hashed by Firebase Authentication)')}</li>
              <li>{t('privacy.section1.1.item3', 'Company name')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('privacy.section1.2.title', '1.2 Production & Operational Data')}</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('privacy.section1.2.item1', 'Operator names and assigned shifts')}</li>
              <li>{t('privacy.section1.2.item2', 'Machine names, line identifiers')}</li>
              <li>{t('privacy.section1.2.item3', 'Production logs, downtime events, comments')}</li>
              <li>{t('privacy.section1.2.item4', 'Photos and videos uploaded by users (up to 12 MB)')}</li>
              <li>{t('privacy.section1.2.item5', 'Timestamps, durations, severity levels')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('privacy.section1.3.title', '1.3 Technical Data')}</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('privacy.section1.3.item1', 'IP address')}</li>
              <li>{t('privacy.section1.3.item2', 'Browser and device information')}</li>
              <li>{t('privacy.section1.3.item3', 'Error logs and diagnostic information')}</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>{t('privacy.section1.noFinancial', 'No financial data is collected through Ops-Log.')}</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section2.title', '2. Purpose of Processing')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section2.intro', 'Your data is used to:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('privacy.section2.item1', 'Provide and operate the Ops-Log service')}</li>
              <li>{t('privacy.section2.item2', 'Authenticate users')}</li>
              <li>{t('privacy.section2.item3', 'Store and display production logs')}</li>
              <li>{t('privacy.section2.item4', 'Generate analysis, KPIs, and metrics')}</li>
              <li>{t('privacy.section2.item5', 'Improve platform reliability and performance')}</li>
              <li>{t('privacy.section2.item6', 'Provide customer support')}</li>
              <li>{t('privacy.section2.item7', 'Maintain platform security and auditing')}</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>{t('privacy.section2.noSell', 'We never sell your data to third parties.')}</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section3.title', '3. Legal Basis (GDPR)')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section3.intro', 'Ops-Log processes your data based on:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>{t('privacy.section3.item1', 'Contractual necessity — to deliver the service')}</strong></li>
              <li><strong>{t('privacy.section3.item2', 'Legitimate interest — security, performance, product improvement')}</strong></li>
              <li><strong>{t('privacy.section3.item3', 'Consent — for optional file uploads (photos/videos)')}</strong></li>
              <li><strong>{t('privacy.section3.item4', 'Legal obligation — regulatory compliance')}</strong></li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section4.title', '4. Data Hosting Locations')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section4.intro', 'Your data is stored exclusively in the European Union:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('privacy.section4.item1', 'Backend (NestJS): Hostinger VPS (EU datacenter)')}</li>
              <li>{t('privacy.section4.item2', 'Database: MongoDB Atlas (EU region)')}</li>
              <li>{t('privacy.section4.item3', 'Authentication: Firebase Authentication (EU region)')}</li>
              <li>{t('privacy.section4.item4', 'Media Storage: Firebase Storage (EU region)')}</li>
            </ul>
            <p className="text-gray-700 mb-6"><strong>{t('privacy.section4.noTransfer', 'We do not transfer your data outside the EU.')}</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section5.title', '5. Data Retention')}</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>{t('privacy.section5.item1', 'Active accounts: data retained for the duration of the subscription')}</strong></li>
              <li><strong>{t('privacy.section5.item2', 'Account deletion: data removed within 60 days')}</strong></li>
              <li><strong>{t('privacy.section5.item3', 'Media files: deleted within 30 days')}</strong></li>
              <li><strong>{t('privacy.section5.item4', 'Authentication data: removed immediately')}</strong></li>
              <li><strong>{t('privacy.section5.item5', 'Backups: encrypted and retained for up to 90 days')}</strong></li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section6.title', '6. User Rights')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section6.intro', 'Under GDPR, you have the right to:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('privacy.section6.item1', 'Access your data')}</li>
              <li>{t('privacy.section6.item2', 'Request correction')}</li>
              <li>{t('privacy.section6.item3', 'Request deletion ("right to be forgotten")')}</li>
              <li>{t('privacy.section6.item4', 'Restrict or object to processing')}</li>
              <li>{t('privacy.section6.item5', 'Export your data ("data portability")')}</li>
              <li>{t('privacy.section6.item6', 'Withdraw consent at any time')}</li>
            </ul>
            <p className="text-gray-700 mb-4">
              {t('privacy.section6.contact', 'To exercise your rights, contact:')} <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a>
            </p>
            <p className="text-gray-700 mb-6"><strong>{t('privacy.section6.response', 'We respond within 30 days.')}</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section7.title', '7. Security Measures')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section7.intro', 'Ops-Log uses industry-standard security measures, including:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('privacy.section7.item1', 'Firebase JWT authentication')}</li>
              <li>{t('privacy.section7.item2', 'HTTPS/TLS encryption')}</li>
              <li>{t('privacy.section7.item3', 'Encrypted database storage')}</li>
              <li>{t('privacy.section7.item4', 'Multi-tenant data isolation')}</li>
              <li>{t('privacy.section7.item5', 'Role-based access control')}</li>
              <li>{t('privacy.section7.item6', 'Secured API architecture')}</li>
              <li>{t('privacy.section7.item7', 'Encrypted backups')}</li>
              <li>{t('privacy.section7.item8', 'Strict administrator access control')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('privacy.section7.more', 'See the Security Page for full technical details.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section8.title', '8. Sharing of Data')}</h2>
            <p className="text-gray-700 mb-4">
              {t('privacy.section8.intro', 'We only share data with GDPR-compliant technical providers necessary to operate the platform:')}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>{t('privacy.section8.item1', 'Firebase / Google Cloud — Authentication & Media Storage')}</strong></li>
              <li><strong>{t('privacy.section8.item2', 'MongoDB Atlas — Database hosting')}</strong></li>
              <li><strong>{t('privacy.section8.item3', 'Hostinger — Server infrastructure')}</strong></li>
            </ul>
            <p className="text-gray-700 mb-4">{t('privacy.section8.processors', 'These providers act strictly as data processors.')}</p>
            <p className="text-gray-700 mb-6"><strong>{t('privacy.section8.noAdvertising', 'We never share data for advertising or unrelated purposes.')}</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section9.title', '9. Sub-processors')}</h2>
            <p className="text-gray-700 mb-6">{t('privacy.section9.text', 'We maintain an updated list of sub-processors on the Security Page.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section10.title', '10. Children\'s Data')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section10.text1', 'Ops-Log is not intended for users under 16 years old.')}</p>
            <p className="text-gray-700 mb-6">{t('privacy.section10.text2', 'We do not knowingly process data from minors.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section11.title', '11. Updates to This Policy')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section11.text1', 'This policy may be updated from time to time.')}</p>
            <p className="text-gray-700 mb-6">{t('privacy.section11.text2', 'Major updates will be communicated via email or in-app notifications.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('privacy.section12.title', '12. Contact Information')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.section12.intro', 'For privacy questions or requests:')}</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">📧 <a href="mailto:contact@itecs.fr" className="text-brand-600 hover:text-brand-700">contact@itecs.fr</a></p>
              <p className="text-gray-700 mt-2">📍 {t('privacy.company.name', 'ITECS – Industrial Tech Solutions')},</p>
              <p className="text-gray-700 ml-6">320 Rue des Sorbiers, 74300 Thyez, France</p>
            </div>
          </article>

          {/* Back to Home Button */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            {t('landing.footer.copyright', `Copyright © ${new Date().getFullYear()} ITECS | Industrial Tech Solution. Tous Droits Réservés.`)}
          </p>
        </div>
      </footer>
    </div>
  );
}
