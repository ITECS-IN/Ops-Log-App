import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Factory,
  TrendingUp,
  Shield,
  BarChart3,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Database,
  Globe,
  Smartphone,
  Menu,
  X
} from 'lucide-react';
import { AppLogo } from '@/components/ui/AppLogo';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

const CTA_CONFIG = {
  trial: {
    ctaId: 'hero-start-free-trial'
  },
  subscription: {
    ctaId: 'hero-request-subscription'
  }
} as const;

type LeadCtaKey = keyof typeof CTA_CONFIG;

type LeadFormState = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
  password: string;
  termsAccepted: boolean;
};

const createEmptyLeadForm = (): LeadFormState => ({
  fullName: '',
  email: '',
  company: '',
  phone: '',
  notes: '',
  password: '',
  termsAccepted: false
});

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [activeCta, setActiveCta] = useState<LeadCtaKey>('trial');
  const [leadForm, setLeadForm] = useState<LeadFormState>(createEmptyLeadForm);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = 'Ops-log - Manufacturing Operations Management Platform';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Real-time manufacturing floor management system for tracking machine operations, downtime events, and operator activities. Optimize production efficiency with advanced analytics.');
    }
  }, []);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const openLeadModal = (cta: LeadCtaKey) => {
    setActiveCta(cta);
    setLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setLeadModalOpen(false);
    setLeadForm(createEmptyLeadForm());
    setIsSubmittingLead(false);
  };

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadForm.fullName.trim() || !leadForm.email.trim()) {
      toast.error(t('landing.modal.validation', 'Full name and work email are required.'));
      return;
    }

    // For trial CTA, create account directly
    if (activeCta === 'trial') {
      if (!leadForm.company.trim()) {
        toast.error(t('landing.modal.companyRequired', 'Company name is required.'));
        return;
      }
      if (!leadForm.password || leadForm.password.length < 6) {
        toast.error(t('landing.modal.passwordValidation', 'Password must be at least 6 characters.'));
        return;
      }
      if (!leadForm.termsAccepted) {
        toast.error(t('landing.modal.termsValidation', 'You must accept the Terms of Service.'));
        return;
      }

      setIsSubmittingLead(true);
      try {
        await api.post('/auth/signup', {
          email: leadForm.email,
          password: leadForm.password,
          companyName: leadForm.company,
        });
        toast.success(t('landing.modal.accountCreated', 'Account created successfully! Please sign in to continue.'));
        closeLeadModal();
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } catch {
        // Axios interceptor will surface the exact error to the user.
        setIsSubmittingLead(false);
      }
    } else {
      // For subscription CTA, collect lead as before
      setIsSubmittingLead(true);
      try {
        await api.post('/leads', {
          ...leadForm,
          source: 'landing-page',
          cta: CTA_CONFIG[activeCta].ctaId
        });
        toast.success(t('landing.modal.success', "Thanks for reaching out! We'll contact you shortly."));
        closeLeadModal();
      } catch {
        // Axios interceptor will surface the exact error to the user.
        setIsSubmittingLead(false);
      }
    }
  };

  const modalCopy = useMemo(() => {
    if (activeCta === 'subscription') {
      return {
        title: t('landing.modal.subscriptionTitle', 'Request a Subscription Plan'),
        description: t(
          'landing.modal.subscriptionDescription',
          'Share your contact details and our team will send pricing plus onboarding steps.'
        ),
      };
    }
    return {
      title: t('landing.modal.trialTitle', 'Create Your Free Account'),
      description: t(
        'landing.modal.trialDescription',
        'Sign up now and get instant access to your 14-day free trial.'
      ),
    };
  }, [activeCta, t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-brand-600 transition-colors">{t('landing.nav.features', 'Features')}</a>
              <a href="#analytics" className="text-gray-700 hover:text-brand-600 transition-colors">{t('landing.nav.analytics', 'Analytics')}</a>
              <a href="#technology" className="text-gray-700 hover:text-brand-600 transition-colors">{t('landing.nav.technology', 'Technology')}</a>
              <a href="#pricing" className="text-gray-700 hover:text-brand-600 transition-colors">{t('landing.nav.pricing', 'Pricing')}</a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-brand-600 transition-colors font-medium text-sm lg:text-base"
              >
                {t('common.signIn', 'Sign In')}
              </Link>
              <button
                type="button"
                onClick={() => openLeadModal('trial')}
                className="bg-brand-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm lg:text-base"
              >
                {t('common.getStarted', 'Get Started')}
              </button>
              <LanguageSwitcher size="sm" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                {t('landing.nav.features', 'Features')}
              </a>
              <a
                href="#analytics"
                onClick={closeMobileMenu}
                className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                {t('landing.nav.analytics', 'Analytics')}
              </a>
              <a
                href="#technology"
                onClick={closeMobileMenu}
                className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                {t('landing.nav.technology', 'Technology')}
              </a>
              <a
                href="#pricing"
                onClick={closeMobileMenu}
                className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                {t('landing.nav.pricing', 'Pricing')}
              </a>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
                >
                  {t('common.signIn', 'Sign In')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    openLeadModal('trial');
                  }}
                  className="block w-full bg-brand-600 text-white px-4 py-3 rounded-lg hover:bg-brand-700 transition-colors font-medium text-center"
                >
                  {t('common.getStarted', 'Get Started')}
                </button>
                <LanguageSwitcher size="sm" className="w-full justify-between" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {t('landing.hero.titleLine1', 'Transform Your Manufacturing')}
              <span className="block text-brand-600 mt-2">{t('landing.hero.titleLine2', 'Floor Operations')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              {t(
                'landing.hero.subtitle',
                'Real-time tracking of machine operations, downtime events, and operator activities. Make data-driven decisions with comprehensive analytics and instant visibility into production KPIs.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <button
                type="button"
                onClick={() => openLeadModal('trial')}
                className="bg-brand-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-brand-700 transition-all transform hover:scale-105 font-semibold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {t('landing.hero.startTrial', 'Start a Free Trial')}
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => openLeadModal('subscription')}
                className="bg-white text-brand-600 border-2 border-brand-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-brand-50 transition-all font-semibold text-base sm:text-lg shadow-lg w-full sm:w-auto"
              >
                {t('landing.hero.requestSubscription', 'Request a Subscription')}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-4">
              {t('landing.hero.trialNote', 'No credit card required • 14-day free trial • Cancel anytime')}
            </p>
          </div>

          {/* Hero Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">40+</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{t('landing.hero.stat.apis', 'API Endpoints')}</div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">6</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{t('landing.hero.stat.charts', 'Analytics Charts')}</div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">4</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{t('landing.hero.stat.kpis', 'Real-time KPIs')}</div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">100%</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{t('landing.hero.stat.isolation', 'Data Isolation')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('landing.benefits.title', 'Why Choose Ops-log?')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              {t('landing.benefits.subtitle', 'Enterprise-grade features for manufacturing excellence')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.benefits.realtime.title', 'Real-Time Visibility')}</h3>
              <p className="text-gray-600">
                {t('landing.benefits.realtime.copy', 'Track machine operations, downtime events, and operator activities in real-time. Get instant insights into production floor performance with live KPI dashboards.')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.benefits.security.title', 'Multi-Tenant Security')}</h3>
              <p className="text-gray-600">
                {t('landing.benefits.security.copy', 'Complete data isolation between companies with Firebase JWT authentication. Enterprise-grade security with no cross-company data leakage possible.')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.benefits.analytics.title', 'Advanced Analytics')}</h3>
              <p className="text-gray-600">
                {t('landing.benefits.analytics.copy', '6 built-in interactive charts covering machines, operators, and trends. Identify patterns, optimize maintenance, and make data-driven decisions.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('landing.features.title', 'Comprehensive Features')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              {t('landing.features.subtitle', 'Everything you need to manage your manufacturing operations')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Production Logging */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-brand-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.features.production.title', 'Production Logging')}</h3>
                <p className="text-gray-600 mb-3">
                  {t('landing.features.production.description', 'Record machine operations with detailed tracking of breakdowns, setup times, quality issues, and observations.')}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.production.point1', 'Track downtime with start/end times')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.production.point2', 'Attach photos/videos (up to 12MB)')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.production.point3', 'Severity ratings (1-5 scale)')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.production.point4', 'Multi-shift support (A, B, C)')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Dashboard & Monitoring */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.features.dashboard.title', 'Dashboard & KPIs')}</h3>
                <p className="text-gray-600 mb-3">
                  {t('landing.features.dashboard.description', "Monitor today's performance with 4 critical KPIs calculated in real-time.")}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.dashboard.point1', 'Total logs today')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.dashboard.point2', 'Total downtime hours')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.dashboard.point3', 'Average MTTR (Mean Time To Repair)')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.dashboard.point4', 'Equipment availability percentage')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Advanced Filtering */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.features.filtering.title', 'Advanced Filtering')}</h3>
                <p className="text-gray-600 mb-3">
                  {t('landing.features.filtering.description', 'Filter production logs with 15+ combinations to find exactly what you need.')}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.filtering.point1', 'Date/time range filtering')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.filtering.point2', 'Line & machine selection')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.filtering.point3', 'Shift, status, note type filters')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.filtering.point4', 'CSV export with filters applied')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Administration */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.features.admin.title', 'Complete Administration')}</h3>
                <p className="text-gray-600 mb-3">
                  {t('landing.features.admin.description', 'Manage all aspects of your manufacturing operations from a single interface.')}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.admin.point1', 'Production lines management')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.admin.point2', 'Equipment & machines CRUD')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.admin.point3', 'Operator management with shifts')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t('landing.features.admin.point4', 'Configurable shift timings')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-brand-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('landing.analytics.title', 'Powerful Analytics & Insights')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              {t('landing.analytics.subtitle', '6 interactive charts to visualize your production data')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <BarChart3 className="h-10 w-10 text-brand-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{t('landing.analytics.card.logsTitle', 'Logs per Machine')}</h4>
              <p className="text-gray-600">{t('landing.analytics.card.logsCopy', 'Identify which machines have the most recorded issues')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Clock className="h-10 w-10 text-red-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{t('landing.analytics.card.downtimeMachineTitle', 'Downtime per Machine')}</h4>
              <p className="text-gray-600">{t('landing.analytics.card.downtimeMachineCopy', 'Total downtime minutes for maintenance prioritization')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <TrendingUp className="h-10 w-10 text-green-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{t('landing.analytics.card.severityTitle', 'Severity Distribution')}</h4>
              <p className="text-gray-600">{t('landing.analytics.card.severityCopy', 'Visual breakdown of issue severity levels (1-5)')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <BarChart3 className="h-10 w-10 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{t('landing.analytics.card.downtimeTrendTitle', 'Downtime Trend')}</h4>
              <p className="text-gray-600">{t('landing.analytics.card.downtimeTrendCopy', 'Historical downtime tracking by day for trend analysis')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <CheckCircle2 className="h-10 w-10 text-purple-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{t('landing.analytics.card.issueTypesTitle', 'Issue Types Distribution')}</h4>
              <p className="text-gray-600">{t('landing.analytics.card.issueTypesCopy', 'Breakdown of observations, breakdowns, setup, and quality issues')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Users className="h-10 w-10 text-orange-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">{t('landing.analytics.card.operatorTitle', 'Operator Activity')}</h4>
              <p className="text-gray-600">{t('landing.analytics.card.operatorCopy', 'Track logs recorded by each operator for accountability')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('landing.technology.title', 'Built with Modern Technology')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              {t('landing.technology.subtitle', 'Cloud-native, scalable, and production-ready')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">React 19</h4>
              <p className="text-sm text-gray-600">{t('landing.technology.react', 'Modern frontend with TypeScript')}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">NestJS 11</h4>
              <p className="text-sm text-gray-600">{t('landing.technology.nest', 'Enterprise Node.js backend')}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">MongoDB</h4>
              <p className="text-sm text-gray-600">{t('landing.technology.mongo', 'Scalable NoSQL database')}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Firebase</h4>
              <p className="text-sm text-gray-600">{t('landing.technology.firebase', 'Authentication & storage')}</p>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">100%</div>
                <div className="text-gray-600">{t('landing.technology.typesafe', 'Type-safe with TypeScript')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">Cloud</div>
                <div className="text-gray-600">{t('landing.technology.cloud', 'Native architecture')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">Docker</div>
                <div className="text-gray-600">{t('landing.technology.docker', 'Ready deployment')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('landing.usecases.title', 'Perfect For')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              {t('landing.usecases.subtitle', 'From small facilities to enterprise operations')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <Factory className="h-12 w-12 text-brand-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.usecases.manufacturing', 'Manufacturing Facilities')}</h3>
              <p className="text-gray-600">
                {t('landing.usecases.manufacturing.copy', 'Small to large manufacturing operations needing real-time production visibility and downtime tracking.')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <Globe className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.usecases.multisite', 'Multi-Site Operations')}</h3>
              <p className="text-gray-600">
                {t('landing.usecases.multisite.copy', 'Complete data isolation for companies managing multiple facilities with separate production lines.')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.usecases.mobile', 'Mobile-First Teams')}</h3>
              <p className="text-gray-600">
                {t('landing.usecases.mobile.copy', 'Responsive design for shop floor workers using tablets and mobile devices to log activities.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/CTA Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            {t('landing.pricing.title', 'Ready to Transform Your Operations?')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-brand-100 px-4">
            {t('landing.pricing.subtitle', 'Start your 14-day free trial today. No credit card required. Cancel anytime.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <button
              type="button"
              onClick={() => openLeadModal('trial')}
              className="bg-white text-brand-600 px-8 sm:px-10 py-4 sm:py-5 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-bold text-base sm:text-lg md:text-xl shadow-2xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {t('landing.hero.startTrial', 'Start a Free Trial')}
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              type="button"
              onClick={() => openLeadModal('subscription')}
              className="bg-brand-500 text-white border-2 border-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg hover:bg-brand-400 transition-all font-bold text-base sm:text-lg md:text-xl shadow-2xl w-full sm:w-auto"
            >
              {t('landing.hero.requestSubscription', 'Request a Subscription')}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <CheckCircle2 className="h-8 w-8 mb-3" />
              <h4 className="font-bold mb-2">{t('landing.pricing.freeTrial', '14-Day Free Trial')}</h4>
              <p className="text-brand-100 text-sm">{t('landing.pricing.freeTrialCopy', 'Full access to all features during your trial period')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <CheckCircle2 className="h-8 w-8 mb-3" />
              <h4 className="font-bold mb-2">{t('landing.pricing.noCard', 'No Credit Card')}</h4>
              <p className="text-brand-100 text-sm">{t('landing.pricing.noCardCopy', 'Start without any payment information required')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <CheckCircle2 className="h-8 w-8 mb-3" />
              <h4 className="font-bold mb-2">{t('landing.pricing.cancel', 'Cancel Anytime')}</h4>
              <p className="text-brand-100 text-sm">{t('landing.pricing.cancelCopy', 'No long-term contracts or hidden fees')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <AppLogo size={32} className="sm:block md:hidden" />
                <AppLogo size={40} className="hidden sm:block" />
                <span className="text-base sm:text-xl font-bold text-white">Ops-log</span>
              </div>
              <p className="text-xs sm:text-sm">
                {t('landing.footer.description', 'Manufacturing operations management platform for real-time production visibility.')}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">{t('landing.footer.product', 'Product')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-brand-400 transition-colors">{t('landing.nav.features', 'Features')}</a></li>
                <li><a href="#analytics" className="hover:text-brand-400 transition-colors">{t('landing.nav.analytics', 'Analytics')}</a></li>
                <li><a href="#technology" className="hover:text-brand-400 transition-colors">{t('landing.nav.technology', 'Technology')}</a></li>
                <li><a href="#pricing" className="hover:text-brand-400 transition-colors">{t('landing.nav.pricing', 'Pricing')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">{t('landing.footer.company', 'Company')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-400 transition-colors">{t('landing.footer.about', 'About')}</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">{t('landing.footer.contact', 'Contact')}</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">{t('landing.footer.support', 'Support')}</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">{t('landing.footer.documentation', 'Documentation')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">{t('landing.footer.legal', 'Legal')}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy-policy" className="hover:text-brand-400 transition-colors">{t('landing.footer.privacy', 'Privacy Policy')}</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-brand-400 transition-colors">{t('landing.footer.terms', 'Terms of Service')}</Link></li>
                <li><Link to="/security" className="hover:text-brand-400 transition-colors">{t('landing.footer.security', 'Security')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-xs sm:text-sm text-center">
            <p className="px-4">
              &copy; 2024 Ops-log. {t('landing.footer.copyright', 'All rights reserved. Built with React, NestJS, MongoDB, and Firebase.')}
            </p>
          </div>
        </div>
      </footer>

      <Dialog open={leadModalOpen} onOpenChange={(open) => { if (!open) { closeLeadModal(); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {modalCopy.title}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              {modalCopy.description}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleLeadSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="lead-full-name">{t('landing.modal.fullName', 'Full Name *')}</Label>
                <Input
                  id="lead-full-name"
                  name="fullName"
                  placeholder={t('landing.modal.fullNamePlaceholder', 'Alex Rivera')}
                  value={leadForm.fullName}
                  onChange={(event) => setLeadForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  disabled={isSubmittingLead}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lead-email">{t('landing.modal.email', 'Work Email *')}</Label>
                <Input
                  id="lead-email"
                  type="email"
                  name="email"
                  placeholder={t('landing.modal.emailPlaceholder', 'alex@manufacturer.com')}
                  value={leadForm.email}
                  onChange={(event) => setLeadForm((prev) => ({ ...prev, email: event.target.value }))}
                  disabled={isSubmittingLead}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="lead-company">{t('landing.modal.company', 'Company')} {activeCta === 'trial' && '*'}</Label>
                <Input
                  id="lead-company"
                  name="company"
                  placeholder={t('landing.modal.companyPlaceholder', 'Acme Manufacturing')}
                  value={leadForm.company}
                  onChange={(event) => setLeadForm((prev) => ({ ...prev, company: event.target.value }))}
                  disabled={isSubmittingLead}
                  required={activeCta === 'trial'}
                />
              </div>
              <div>
                <Label htmlFor="lead-phone">{t('landing.modal.phone', 'Phone')}</Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  name="phone"
                  placeholder={t('landing.modal.phonePlaceholder', '+1 (555) 123-4567')}
                  value={leadForm.phone}
                  onChange={(event) => setLeadForm((prev) => ({ ...prev, phone: event.target.value }))}
                  disabled={isSubmittingLead}
                />
              </div>
            </div>

            {/* Password field - only for trial CTA */}
            {activeCta === 'trial' && (
              <div>
                <Label htmlFor="lead-password">{t('landing.modal.password', 'Password *')}</Label>
                <Input
                  id="lead-password"
                  type="password"
                  name="password"
                  placeholder={t('landing.modal.passwordPlaceholder', 'Enter a secure password (min. 6 characters)')}
                  value={leadForm.password}
                  onChange={(event) => setLeadForm((prev) => ({ ...prev, password: event.target.value }))}
                  disabled={isSubmittingLead}
                  required
                  minLength={6}
                />
              </div>
            )}
            {/* Notes field - optional for trial, shown for subscription */}
            {activeCta === 'subscription' && (
              <div>
                <Label htmlFor="lead-notes">{t('landing.modal.notes', 'What can we help with?')}</Label>
                <Textarea
                  id="lead-notes"
                  name="notes"
                  placeholder={t('landing.modal.notesPlaceholder', 'Share any context on production lines, shifts, or timelines.')}
                  value={leadForm.notes}
                  onChange={(event) => setLeadForm((prev) => ({ ...prev, notes: event.target.value }))}
                  disabled={isSubmittingLead}
                  rows={4}
                />
              </div>
            )}

            {/* Terms and Conditions checkbox - only for trial CTA */}
            {activeCta === 'trial' && (
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="lead-terms"
                  name="termsAccepted"
                  checked={leadForm.termsAccepted}
                  onChange={(event) => setLeadForm((prev) => ({ ...prev, termsAccepted: event.target.checked }))}
                  disabled={isSubmittingLead}
                  required
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <Label htmlFor="lead-terms" className="text-sm font-normal cursor-pointer">
                  {t('landing.modal.termsPrefix', 'I accept the')}{' '}
                  <a
                    href="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 underline"
                  >
                    {t('landing.modal.termsLink', 'Terms of Service')}
                  </a>
                </Label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white"
              disabled={isSubmittingLead}
            >
              {isSubmittingLead
                ? t('landing.modal.submitting', 'Creating Account...')
                : activeCta === 'trial'
                  ? t('landing.modal.createAccount', 'Create Account')
                  : t('landing.modal.submit', 'Submit Request')
              }
            </Button>

            {activeCta === 'subscription' && (
              <p className="text-xs text-gray-500 text-center">
                {t('landing.modal.responseTime', 'We respond within one business day. By submitting, you agree to be contacted about Ops-log.')}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
