import { useEffect, useState } from 'react';
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

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = 'Shift Log - Manufacturing Operations Management Platform';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Real-time manufacturing floor management system for tracking machine operations, downtime events, and operator activities. Optimize production efficiency with advanced analytics.');
    }
  }, []);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <AppLogo size={40} className="hidden sm:block" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">Shift Log</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-brand-600 transition-colors">Features</a>
              <a href="#analytics" className="text-gray-700 hover:text-brand-600 transition-colors">Analytics</a>
              <a href="#technology" className="text-gray-700 hover:text-brand-600 transition-colors">Technology</a>
              <a href="#pricing" className="text-gray-700 hover:text-brand-600 transition-colors">Pricing</a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-brand-600 transition-colors font-medium text-sm lg:text-base"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-brand-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm lg:text-base"
              >
                Get Started
              </Link>
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
                Features
              </a>
              <a
                href="#analytics"
                onClick={closeMobileMenu}
                className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                Analytics
              </a>
              <a
                href="#technology"
                onClick={closeMobileMenu}
                className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                Technology
              </a>
              <a
                href="#pricing"
                onClick={closeMobileMenu}
                className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                Pricing
              </a>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block py-2 text-gray-700 hover:text-brand-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="block bg-brand-600 text-white px-4 py-3 rounded-lg hover:bg-brand-700 transition-colors font-medium text-center"
                >
                  Get Started
                </Link>
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
              Transform Your Manufacturing
              <span className="block text-brand-600 mt-2">Floor Operations</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              Real-time tracking of machine operations, downtime events, and operator activities.
              Make data-driven decisions with comprehensive analytics and instant visibility into production KPIs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Link
                to="/signup"
                className="bg-brand-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-brand-700 transition-all transform hover:scale-105 font-semibold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start a Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#pricing"
                className="bg-white text-brand-600 border-2 border-brand-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-brand-50 transition-all font-semibold text-base sm:text-lg shadow-lg w-full sm:w-auto"
              >
                Request a Subscription
              </a>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Hero Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">40+</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">API Endpoints</div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">6</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Analytics Charts</div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">4</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Real-time KPIs</div>
            </div>
            <div className="text-center p-4 sm:p-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">100%</div>
              <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Data Isolation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Shift Log?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Enterprise-grade features for manufacturing excellence
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Visibility</h3>
              <p className="text-gray-600">
                Track machine operations, downtime events, and operator activities in real-time.
                Get instant insights into production floor performance with live KPI dashboards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Tenant Security</h3>
              <p className="text-gray-600">
                Complete data isolation between companies with Firebase JWT authentication.
                Enterprise-grade security with no cross-company data leakage possible.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                6 built-in interactive charts covering machines, operators, and trends.
                Identify patterns, optimize maintenance, and make data-driven decisions.
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
              Comprehensive Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Everything you need to manage your manufacturing operations
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Production Logging</h3>
                <p className="text-gray-600 mb-3">
                  Record machine operations with detailed tracking of breakdowns, setup times, quality issues, and observations.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Track downtime with start/end times
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Attach photos/videos (up to 12MB)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Severity ratings (1-5 scale)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Multi-shift support (A, B, C)
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard & KPIs</h3>
                <p className="text-gray-600 mb-3">
                  Monitor today's performance with 4 critical KPIs calculated in real-time.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Total logs today
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Total downtime hours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Average MTTR (Mean Time To Repair)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Equipment availability percentage
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Filtering</h3>
                <p className="text-gray-600 mb-3">
                  Filter production logs with 15+ combinations to find exactly what you need.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Date/time range filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Line & machine selection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Shift, status, note type filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    CSV export with filters applied
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Administration</h3>
                <p className="text-gray-600 mb-3">
                  Manage all aspects of your manufacturing operations from a single interface.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Production lines management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Equipment & machines CRUD
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Operator management with shifts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Configurable shift timings
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
              Powerful Analytics & Insights
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              6 interactive charts to visualize your production data
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <BarChart3 className="h-10 w-10 text-brand-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Logs per Machine</h4>
              <p className="text-gray-600">Identify which machines have the most recorded issues</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Clock className="h-10 w-10 text-red-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Downtime per Machine</h4>
              <p className="text-gray-600">Total downtime minutes for maintenance prioritization</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <TrendingUp className="h-10 w-10 text-green-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Severity Distribution</h4>
              <p className="text-gray-600">Visual breakdown of issue severity levels (1-5)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <BarChart3 className="h-10 w-10 text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Downtime Trend</h4>
              <p className="text-gray-600">Historical downtime tracking by day for trend analysis</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <CheckCircle2 className="h-10 w-10 text-purple-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Issue Types Distribution</h4>
              <p className="text-gray-600">Breakdown of observations, breakdowns, setup, and quality issues</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <Users className="h-10 w-10 text-orange-600 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Operator Activity</h4>
              <p className="text-gray-600">Track logs recorded by each operator for accountability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Cloud-native, scalable, and production-ready
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">React 19</h4>
              <p className="text-sm text-gray-600">Modern frontend with TypeScript</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">NestJS 11</h4>
              <p className="text-sm text-gray-600">Enterprise Node.js backend</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">MongoDB</h4>
              <p className="text-sm text-gray-600">Scalable NoSQL database</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Firebase</h4>
              <p className="text-sm text-gray-600">Authentication & storage</p>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">100%</div>
                <div className="text-gray-600">Type-safe with TypeScript</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">Cloud</div>
                <div className="text-gray-600">Native architecture</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">Docker</div>
                <div className="text-gray-600">Ready deployment</div>
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
              Perfect For
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              From small facilities to enterprise operations
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <Factory className="h-12 w-12 text-brand-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Manufacturing Facilities</h3>
              <p className="text-gray-600">
                Small to large manufacturing operations needing real-time production visibility and downtime tracking.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <Globe className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Site Operations</h3>
              <p className="text-gray-600">
                Complete data isolation for companies managing multiple facilities with separate production lines.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile-First Teams</h3>
              <p className="text-gray-600">
                Responsive design for shop floor workers using tablets and mobile devices to log activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/CTA Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-brand-100 px-4">
            Start your 14-day free trial today. No credit card required. Cancel anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Link
              to="/signup"
              className="bg-white text-brand-600 px-8 sm:px-10 py-4 sm:py-5 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-bold text-base sm:text-lg md:text-xl shadow-2xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Start a Free Trial
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <a
              href="mailto:sales@shiftlog.com?subject=Subscription Request"
              className="bg-brand-500 text-white border-2 border-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg hover:bg-brand-400 transition-all font-bold text-base sm:text-lg md:text-xl shadow-2xl w-full sm:w-auto"
            >
              Request a Subscription
            </a>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <CheckCircle2 className="h-8 w-8 mb-3" />
              <h4 className="font-bold mb-2">14-Day Free Trial</h4>
              <p className="text-brand-100 text-sm">Full access to all features during your trial period</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <CheckCircle2 className="h-8 w-8 mb-3" />
              <h4 className="font-bold mb-2">No Credit Card</h4>
              <p className="text-brand-100 text-sm">Start without any payment information required</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <CheckCircle2 className="h-8 w-8 mb-3" />
              <h4 className="font-bold mb-2">Cancel Anytime</h4>
              <p className="text-brand-100 text-sm">No long-term contracts or hidden fees</p>
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
                <AppLogo size={40} className="hidden sm:block" />
                <span className="text-base sm:text-xl font-bold text-white">Shift Log</span>
              </div>
              <p className="text-xs sm:text-sm">
                Manufacturing operations management platform for real-time production visibility.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-brand-400 transition-colors">Features</a></li>
                <li><a href="#analytics" className="hover:text-brand-400 transition-colors">Analytics</a></li>
                <li><a href="#technology" className="hover:text-brand-400 transition-colors">Technology</a></li>
                <li><a href="#pricing" className="hover:text-brand-400 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-xs sm:text-sm text-center">
            <p className="px-4">
              &copy; 2024 Shift Log. All rights reserved. Built with React, NestJS, MongoDB, and Firebase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
