import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Brain, Download, Calendar, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

export function Insights() {
  const reports = [
    {
      id: 1,
      title: "Monthly Production Analysis",
      type: "Production",
      status: "Ready",
      generatedAt: "2024-01-15",
      size: "2.4 MB",
      description: "Comprehensive analysis of production metrics and KPIs"
    },
    {
      id: 2,
      title: "Quality Control Report",
      type: "Quality",
      status: "Generating",
      generatedAt: "2024-01-15",
      size: "1.8 MB",
      description: "Quality metrics, defect analysis, and improvement recommendations"
    },
    {
      id: 3,
      title: "Machine Utilization Summary",
      type: "Performance",
      status: "Ready",
      generatedAt: "2024-01-14",
      size: "3.1 MB",
      description: "Detailed machine performance and utilization insights"
    }
  ];

  const insights = [
    {
      id: 1,
      type: "efficiency",
      title: "CNC Mill Alpha Efficiency Opportunity",
      description: "Analysis shows CNC Mill Alpha operates at 87% efficiency. Implementing optimized toolpath strategies could increase efficiency to 94%, potentially saving ₹45,000 monthly in operational costs.",
      impact: "High",
      savings: "₹45,000/month",
      confidence: 92
    },
    {
      id: 2,
      type: "maintenance",
      title: "Predictive Maintenance Schedule Optimization",
      description: "AI analysis suggests adjusting maintenance schedules for CNC Lathe Beta could reduce unplanned downtime by 35% while maintaining optimal performance levels.",
      impact: "Medium",
      savings: "₹28,000/month",
      confidence: 85
    },
    {
      id: 3,
      type: "quality",
      title: "Quality Improvement Through Parameter Tuning",
      description: "Machine learning analysis identifies optimal cutting parameters that could reduce surface roughness defects by 60% across all CNC mills.",
      impact: "High",
      savings: "₹32,000/month",
      confidence: 88
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'bg-green-500 text-white';
      case 'generating': return 'bg-yellow-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'efficiency': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'maintenance': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'quality': return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default: return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Production Insights</h1>
              <p className="text-indigo-200">AI-powered analytics and intelligent reporting</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Brain className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
            <Button variant="outline" className="text-white border-indigo-400 hover:bg-indigo-800">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg p-6 border border-slate-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h3 className="text-white font-semibold text-lg">{insight.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} Impact
                      </Badge>
                      <span className="text-slate-400 text-sm">
                        Confidence: {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-lg">{insight.savings}</div>
                  <div className="text-slate-400 text-sm">Potential Savings</div>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-4">{insight.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>AI Analysis</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Data-driven</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    View Details
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Implement
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated Reports */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Generated Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-medium">{report.title}</h3>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Type: {report.type}</span>
                      <span>Size: {report.size}</span>
                      <span>Generated: {report.generatedAt}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {report.status === 'Ready' && (
                      <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-400" />
              Report Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Daily Operations Report</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Generate
                  </Button>
                </div>
                <p className="text-slate-400 text-sm">Daily summary of production, efficiency, and alerts</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Weekly Performance Analysis</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Generate
                  </Button>
                </div>
                <p className="text-slate-400 text-sm">Comprehensive weekly performance metrics and trends</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Monthly Cost Analysis</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Generate
                  </Button>
                </div>
                <p className="text-slate-400 text-sm">Detailed cost breakdown and optimization recommendations</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Quality Assurance Report</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Generate
                  </Button>
                </div>
                <p className="text-slate-400 text-sm">Quality metrics, defect analysis, and improvement actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Summary */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Intelligence Summary - Last 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">₹1.2L</div>
              <div className="text-slate-400 text-sm">Cost Savings Identified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">15%</div>
              <div className="text-slate-400 text-sm">Efficiency Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">8</div>
              <div className="text-slate-400 text-sm">AI Insights Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">92%</div>
              <div className="text-slate-400 text-sm">Prediction Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}