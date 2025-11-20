import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLogo } from '@/components/ui/AppLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

const CONTACT_EMAIL = 'contact@itecs.fr';

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

export default function TermsOfService() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = 'Terms of Service | Ops-log';
    window.scrollTo(0, 0);
  }, []);

  const privacyPolicyLabel = t('legal.privacyPolicy', 'Privacy Policy');
  const dataProtectionText = t(
    'terms.section6.3.text',
    'All data is processed in accordance with our Privacy Policy and GDPR requirements.'
  );
  const [dataProtectionBefore, dataProtectionAfter] = splitTranslation(dataProtectionText, privacyPolicyLabel);

  const cancellationText = t(
    'terms.section9.1.text',
    'You may cancel your subscription at any time by contacting us at contact@itecs.fr.'
  );
  const [cancellationBefore, cancellationAfter] = splitTranslation(cancellationText, CONTACT_EMAIL);

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('terms.title', 'Ops-log – Terms of Service')}</h1>
            <p className="text-gray-600 mb-8">{t('terms.lastUpdated', 'Last updated: 16/11/2025')}</p>

            <p className="text-lg text-gray-700 mb-6">
              {t(
                'terms.intro',
                'These Terms of Service ("Terms") govern your access to and use of the Ops-Log platform, operated by:'
              )}
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="font-semibold text-gray-900">{t('privacy.company.name', 'ITECS – Industrial Tech Solutions')}</p>
              <p className="text-gray-700">{t('privacy.company.legal', 'Legal Entity: E.I Sanjay KUMAR')}</p>
              <p className="text-gray-700">{t('privacy.company.address', 'Registered Address: 320 Rue des Sorbiers, 74300 Thyez, France')}</p>
              <p className="text-gray-700">{t('privacy.company.siret', 'SIRET: 924 283 799 00022')}</p>
              <p className="text-gray-700">
                {t('privacy.company.email', 'Email:')}{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 hover:text-brand-700">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>

            <p className="text-gray-700 mb-4">
              <strong>{t('terms.agreement', 'By creating an account, accessing, or using Ops-Log, you agree to these Terms.')}</strong>
            </p>
            <p className="text-gray-700 mb-8">{t('terms.mustAgree', 'If you do not agree, you must stop using the platform.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section1.title', '1. Definitions')}</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('terms.section1.item1', '"Platform" / "Service" refers to Ops-Log, including web application, APIs, storage, analytics, and all related services.')}</li>
              <li>{t('terms.section1.item2', '"Company", "We", "Us", "ITECS" refers to ITECS – Industrial Tech Solutions (E.I Sanjay Kumar).')}</li>
              <li>{t('terms.section1.item3', '"User" refers to any individual accessing or using the Platform.')}</li>
              <li>{t('terms.section1.item4', '"Customer" refers to the company or legal entity on whose behalf the User accesses the Platform.')}</li>
              <li>{t('terms.section1.item5', '"Data" refers to production data, logs, photos, videos, operator names, and any information submitted into Ops-Log.')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section2.title', '2. Eligibility')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section2.intro', 'You must:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section2.item1', 'Be at least 16 years old')}</li>
              <li>{t('terms.section2.item2', 'Have the authority to bind your company (if applicable)')}</li>
              <li>{t('terms.section2.item3', 'Provide accurate account information')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('terms.section2.note', 'ITECS may refuse or terminate accounts at its discretion.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section3.title', '3. Description of Service')}</h2>
            <p className="text-gray-700 mb-4">
              {t('terms.section3.intro', 'Ops-Log is a cloud-based manufacturing operations management platform providing:')}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section3.item1', 'Real-time production visibility')}</li>
              <li>{t('terms.section3.item2', 'Downtime logging')}</li>
              <li>{t('terms.section3.item3', 'Shift and operator management')}</li>
              <li>{t('terms.section3.item4', 'Photo/video attachments')}</li>
              <li>{t('terms.section3.item5', 'Analytics, KPIs, and dashboards')}</li>
              <li>{t('terms.section3.item6', 'Administrative tools')}</li>
              <li>{t('terms.section3.item7', 'Multi-site management')}</li>
              <li>{t('terms.section3.item8', 'Secure cloud storage')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('terms.section3.note', 'ITECS may modify features or update the Service at any time.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section4.title', '4. Account Registration')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section4.intro1', 'Users must create an account using:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section4.item1', 'A valid email')}</li>
              <li>{t('terms.section4.item2', 'A secure password')}</li>
            </ul>
            <p className="text-gray-700 mb-4">{t('terms.section4.intro2', 'You are responsible for:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section4.item3', 'Keeping login credentials confidential')}</li>
              <li>{t('terms.section4.item4', 'All activity under your account')}</li>
              <li>{t('terms.section4.item5', 'Ensuring your operators follow company policies')}</li>
            </ul>
            <p className="text-gray-700 mb-6">
              {t('terms.section4.note', 'ITECS is not responsible for unauthorized access due to weak or shared passwords.')}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section5.title', '5. Acceptable Use')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section5.intro', 'You agree NOT to:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section5.item1', 'Upload illegal, abusive, or harmful content')}</li>
              <li>{t('terms.section5.item2', 'Attempt to hack, disrupt, or reverse-engineer the platform')}</li>
              <li>{t('terms.section5.item3', 'Interfere with server or network operations')}</li>
              <li>{t('terms.section5.item4', 'Upload malicious code')}</li>
              <li>{t('terms.section5.item5', 'Use the platform to store personal data beyond what is required for production operations')}</li>
              <li>{t('terms.section5.item6', 'Violate any applicable laws or regulations')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('terms.section5.note', 'ITECS reserves the right to suspend accounts violating these rules.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section6.title', '6. Customer Data')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section6.1.title', '6.1 Ownership')}</h3>
            <p className="text-gray-700 mb-4">
              {t(
                'terms.section6.1.text1',
                'All production data, logs, photos, videos, and operator information submitted by users remain the property of the Customer.'
              )}
            </p>
            <p className="text-gray-700 mb-6">
              <strong>{t('terms.section6.1.text2', 'ITECS claims no ownership over your data.')}</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section6.2.title', '6.2 License')}</h3>
            <p className="text-gray-700 mb-4">{t('terms.section6.2.intro', 'You grant ITECS a limited, revocable license to:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section6.2.item1', 'Store your data')}</li>
              <li>{t('terms.section6.2.item2', 'Process it to provide the Service')}</li>
              <li>{t('terms.section6.2.item3', 'Generate analytics for your account')}</li>
              <li>{t('terms.section6.2.item4', 'Maintain backups and logs')}</li>
            </ul>
            <p className="text-gray-700 mb-6">
              <strong>{t('terms.section6.2.note', 'ITECS will never use your data for advertising or any external purpose.')}</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section6.3.title', '6.3 Data Protection')}</h3>
            <p className="text-gray-700 mb-6">
              {dataProtectionBefore}
              <Link to="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline">
                {privacyPolicyLabel}
              </Link>
              {dataProtectionAfter}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section7.title', '7. Subscription, Billing & Payments')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section7.intro', 'Ops-Log is a subscription-based SaaS service.')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section7.1.title', '7.1 Billing')}</h3>
            <p className="text-gray-700 mb-4">{t('terms.section7.1.intro', 'Unless otherwise agreed in writing:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('terms.section7.1.item1', 'Subscriptions are billed in advance')}</li>
              <li>{t('terms.section7.1.item2', 'Payments are non-refundable once the subscription period begins')}</li>
              <li>{t('terms.section7.1.item3', 'Late payments may result in account suspension')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section7.2.title', '7.2 Pricing')}</h3>
            <p className="text-gray-700 mb-6">{t('terms.section7.2.text', 'Prices may change, but you will be notified in advance.')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section7.3.title', '7.3 Free Trials')}</h3>
            <p className="text-gray-700 mb-6">
              {t('terms.section7.3.text', 'ITECS may offer free trials. After expiry, continued usage requires a paid subscription.')}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section8.title', '8. Service Availability & Support')}</h2>
            <p className="text-gray-700 mb-4">
              {t('terms.section8.intro1', 'ITECS aims to maintain high availability but does not guarantee:')}
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section8.item1', 'Continuous, uninterrupted service')}</li>
              <li>{t('terms.section8.item2', 'Absence of bugs or errors')}</li>
              <li>{t('terms.section8.item3', 'Real-time access at all times')}</li>
            </ul>
            <p className="text-gray-700 mb-4">{t('terms.section8.intro2', 'ITECS provides:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section8.item4', 'Technical support via email')}</li>
              <li>{t('terms.section8.item5', 'Updates, fixes, and improvements')}</li>
              <li>{t('terms.section8.item6', 'Reasonable maintenance windows')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('terms.section8.note', 'Planned downtime will be communicated when possible.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section9.title', '9. Termination')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section9.1.title', '9.1 By Customer')}</h3>
            <p className="text-gray-700 mb-6">
              {cancellationBefore}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 hover:text-brand-700">
                {CONTACT_EMAIL}
              </a>
              {cancellationAfter}
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section9.2.title', '9.2 By ITECS')}</h3>
            <p className="text-gray-700 mb-4">{t('terms.section9.2.intro', 'We may terminate or suspend accounts for:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('terms.section9.2.item1', 'Violation of these Terms')}</li>
              <li>{t('terms.section9.2.item2', 'Non-payment')}</li>
              <li>{t('terms.section9.2.item3', 'Misuse of the platform')}</li>
              <li>{t('terms.section9.2.item4', 'Security or legal risks')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{t('terms.section9.3.title', '9.3 Effect of Termination')}</h3>
            <p className="text-gray-700 mb-4">{t('terms.section9.3.intro', 'Upon termination:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('terms.section9.3.item1', 'Access is disabled')}</li>
              <li>{t('terms.section9.3.item2', 'Data is deleted according to our Privacy Policy')}</li>
              <li>{t('terms.section9.3.item3', 'No refunds are issued for the ongoing billing cycle')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section10.title', '10. Intellectual Property')}</h2>
            <p className="text-gray-700 mb-4">
              {t(
                'terms.section10.text1',
                'Ops-Log, including its design, code, logos, trademarks, and content, is owned exclusively by ITECS – Industrial Tech Solutions.'
              )}
            </p>
            <p className="text-gray-700 mb-4">{t('terms.section10.intro', 'You may not:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('terms.section10.item1', 'Copy or reproduce the platform')}</li>
              <li>{t('terms.section10.item2', 'Reverse-engineer any part of it')}</li>
              <li>{t('terms.section10.item3', 'Create derivative works')}</li>
              <li>{t('terms.section10.item4', 'Use ITECS branding without permission')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section11.title', '11. Confidentiality')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section11.text1', 'ITECS agrees to keep all customer data confidential.')}</p>
            <p className="text-gray-700 mb-4">{t('terms.section11.intro', 'Customers agree not to disclose:')}</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>{t('terms.section11.item1', 'Platform source code')}</li>
              <li>{t('terms.section11.item2', 'Architecture')}</li>
              <li>{t('terms.section11.item3', 'Documentation marked "confidential"')}</li>
              <li>{t('terms.section11.item4', 'Any non-public information provided by ITECS')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section12.title', '12. Security')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section12.intro', 'ITECS implements strong measures including:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section12.item1', 'Encrypted databases')}</li>
              <li>{t('terms.section12.item2', 'HTTPS/TLS')}</li>
              <li>{t('terms.section12.item3', 'Firebase Authentication')}</li>
              <li>{t('terms.section12.item4', 'Role-based access')}</li>
              <li>{t('terms.section12.item5', 'Multi-tenant isolation')}</li>
              <li>{t('terms.section12.item6', 'Strict administrative controls')}</li>
            </ul>
            <p className="text-gray-700 mb-6">{t('terms.section12.note', 'See the Security Page for details.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section13.title', '13. Disclaimers')}</h2>
            <p className="text-gray-700 mb-4">
              <strong>{t('terms.section13.text1', 'Ops-Log is provided "as is" and "as available."')}</strong>
            </p>
            <p className="text-gray-700 mb-4">{t('terms.section13.intro', 'ITECS disclaims all warranties, including:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section13.item1', 'Fitness for a particular purpose')}</li>
              <li>{t('terms.section13.item2', 'Error-free operation')}</li>
              <li>{t('terms.section13.item3', 'Continuous availability')}</li>
            </ul>
            <p className="text-gray-700 mb-6">
              {t(
                'terms.section13.note',
                "Production decisions and operational safety remain solely the Customer's responsibility."
              )}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section14.title', '14. Limitation of Liability')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section14.intro', 'To the maximum extent permitted by law:')}</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>{t('terms.section14.item1', 'ITECS is not liable for indirect, incidental, or consequential damages')}</li>
              <li>{t('terms.section14.item2', 'Total liability is limited to the amount paid by the customer in the previous 12 months')}</li>
              <li>
                {t('terms.section14.item3', 'ITECS is not responsible for:')}
                <ul className="list-circle pl-6 mt-2">
                  <li>{t('terms.section14.item3a', 'Data loss due to customer misuse')}</li>
                  <li>{t('terms.section14.item3b', 'Incorrect production entries')}</li>
                  <li>{t('terms.section14.item3c', 'Network issues, operator mistakes, or misconfigurations')}</li>
                  <li>{t('terms.section14.item3d', 'Third-party failures (Firebase, MongoDB, hosting providers)')}</li>
                </ul>
              </li>
            </ul>
            <p className="text-gray-700 mb-6">{t('terms.section14.note', 'You agree to use the platform responsibly.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section15.title', '15. Governing Law')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section15.text1', 'These Terms are governed by the laws of France.')}</p>
            <p className="text-gray-700 mb-6">{t('terms.section15.text2', 'Any disputes will be handled by the Courts of France.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section16.title', '16. Changes to the Terms')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section16.text1', 'ITECS may update these Terms when necessary.')}</p>
            <p className="text-gray-700 mb-4">{t('terms.section16.text2', 'We will notify users via email or in-app notifications.')}</p>
            <p className="text-gray-700 mb-6">{t('terms.section16.text3', 'Continued use of the platform constitutes acceptance.')}</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('terms.section17.title', '17. Contact')}</h2>
            <p className="text-gray-700 mb-4">{t('terms.section17.intro', 'For any questions related to these Terms:')}</p>
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
