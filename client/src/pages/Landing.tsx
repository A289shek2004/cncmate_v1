import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cog, BarChart3, Shield, Smartphone, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Cog className="text-primary-600 h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-neutral-900">CNCMate</h1>
            </div>
            <Button 
              className="bg-primary-600 text-white hover:bg-primary-700"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6" data-testid="title-hero">
            Smart CNC Analytics
            <br />
            <span className="text-primary-600">For Indian MSMEs</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
            Real-time machine monitoring, predictive maintenance, and intelligent production insights 
            to reduce downtime and improve efficiency for your CNC operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-8 py-3"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <BarChart3 className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-3" data-testid="title-feature-monitoring">
                Real-time Monitoring
              </h3>
              <p className="text-neutral-600">
                Monitor all your CNC machines in real-time with live status updates, 
                temperature tracking, and production progress.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <TrendingUp className="h-12 w-12 text-success-600 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-3" data-testid="title-feature-analytics">
                Predictive Analytics
              </h3>
              <p className="text-neutral-600">
                AI-powered insights for predictive maintenance, defect detection, 
                and production optimization to minimize downtime.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Smartphone className="h-12 w-12 text-warning-600 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-3" data-testid="title-feature-mobile">
                Mobile Ready
              </h3>
              <p className="text-neutral-600">
                Access your factory data from anywhere with our mobile-optimized 
                interface designed for shop floor workers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Users className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-3" data-testid="title-feature-tracking">
                Operator Tracking
              </h3>
              <p className="text-neutral-600">
                Track operator assignments, job progress, and shift performance 
                with detailed logging and reporting capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-success-600 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-3" data-testid="title-feature-quality">
                Quality Control
              </h3>
              <p className="text-neutral-600">
                Comprehensive defect logging, quality trend analysis, and 
                automated alerts for maintaining production standards.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <BarChart3 className="h-12 w-12 text-warning-600 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-3" data-testid="title-feature-reports">
                Smart Reports
              </h3>
              <p className="text-neutral-600">
                Automated shift reports, production summaries, and performance 
                analytics tailored for MSME decision makers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4" data-testid="title-benefits">
              Built for Indian MSMEs
            </h3>
            <p className="text-xl text-neutral-600">
              Affordable, scalable, and designed for the unique needs of small and medium enterprises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-4" data-testid="title-reduce-downtime">
                Reduce Unplanned Downtime
              </h4>
              <p className="text-neutral-600 mb-6">
                Our predictive maintenance system helps identify potential machine failures 
                before they occur, reducing unexpected downtime by up to 30%.
              </p>
              <ul className="space-y-2 text-neutral-600">
                <li>• Early warning alerts for machine issues</li>
                <li>• Maintenance scheduling based on usage patterns</li>
                <li>• Temperature and vibration monitoring</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-neutral-900 mb-4" data-testid="title-improve-quality">
                Improve Quality Control
              </h4>
              <p className="text-neutral-600 mb-6">
                Track and analyze defects in real-time to maintain consistent quality 
                and reduce material waste across your production processes.
              </p>
              <ul className="space-y-2 text-neutral-600">
                <li>• Real-time defect logging and tracking</li>
                <li>• Quality trend analysis and reporting</li>
                <li>• Root cause identification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-neutral-900 mb-4" data-testid="title-cta">
            Ready to Transform Your Factory?
          </h3>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of Indian MSMEs who are already using CNCMate to improve 
            their operations and increase profitability.
          </p>
          <Button 
            size="lg"
            className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-start-free-trial"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Cog className="h-6 w-6 mr-2" />
              <span className="font-semibold">CNCMate</span>
            </div>
            <p className="text-neutral-400 text-sm">
              © 2024 CNCMate. Empowering Indian MSMEs with smart manufacturing solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
