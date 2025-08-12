import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle, TrendingDown, BarChart } from "lucide-react";

export function Quality() {
  const defects = [
    {
      id: "DEF-001",
      type: "Surface Roughness",
      severity: "medium",
      machine: "CNC Mill Alpha",
      operator: "Rajesh Kumar",
      description: "Surface finish outside tolerance range",
      status: "open",
      reportedAt: "10:30 AM"
    },
    {
      id: "DEF-002",
      type: "Dimensional Variance",
      severity: "high",
      machine: "CNC Lathe Beta",
      operator: "Priya Sharma",
      description: "Part dimensions exceed ±0.05mm tolerance",
      status: "investigating",
      reportedAt: "11:45 AM"
    },
    {
      id: "DEF-003",
      type: "Tool Wear",
      severity: "low",
      machine: "CNC Router Gamma",
      operator: "Amit Singh",
      description: "Minor tool wear affecting edge quality",
      status: "resolved",
      reportedAt: "09:15 AM"
    }
  ];

  const qualityMetrics = {
    passRate: 94.2,
    defectRate: 5.8,
    reworkRate: 2.1,
    scrapRate: 1.3
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500 text-white';
      case 'investigating': return 'bg-yellow-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <XCircle className="w-4 h-4" />;
      case 'investigating': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Quality & Defect Logging</h1>
              <p className="text-red-200">Monitor quality control and track defects</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-red-600 hover:bg-red-700">
              + Report Defect
            </Button>
            <Button variant="outline" className="text-white border-red-400 hover:bg-red-800">
              Quality Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pass Rate</p>
                <p className="text-3xl font-bold text-green-400">{qualityMetrics.passRate}%</p>
                <div className="mt-2">
                  <Progress value={qualityMetrics.passRate} className="h-2 bg-slate-800" />
                </div>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Defect Rate</p>
                <p className="text-3xl font-bold text-red-400">{qualityMetrics.defectRate}%</p>
                <div className="mt-2">
                  <Progress value={qualityMetrics.defectRate} className="h-2 bg-slate-800" />
                </div>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rework Rate</p>
                <p className="text-3xl font-bold text-yellow-400">{qualityMetrics.reworkRate}%</p>
                <div className="mt-2">
                  <Progress value={qualityMetrics.reworkRate * 10} className="h-2 bg-slate-800" />
                </div>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Scrap Rate</p>
                <p className="text-3xl font-bold text-orange-400">{qualityMetrics.scrapRate}%</p>
                <div className="mt-2">
                  <Progress value={qualityMetrics.scrapRate * 10} className="h-2 bg-slate-800" />
                </div>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <BarChart className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Defects */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Recent Defect Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {defects.map((defect) => (
            <div
              key={defect.id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getSeverityColor(defect.severity)}>
                      {defect.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(defect.status)}>
                      {getStatusIcon(defect.status)}
                      <span className="ml-1 capitalize">{defect.status}</span>
                    </Badge>
                    <span className="text-slate-400 text-sm">{defect.id}</span>
                  </div>
                  
                  <h3 className="text-white font-medium mb-1">{defect.type}</h3>
                  <p className="text-slate-300 text-sm mb-3">{defect.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Machine:</span>
                      <p className="text-white">{defect.machine}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Operator:</span>
                      <p className="text-white">{defect.operator}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Reported:</span>
                      <p className="text-white">{defect.reportedAt}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    View Details
                  </Button>
                  {defect.status !== 'resolved' && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Update Status
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quality Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-blue-400" />
              Defect Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Surface Roughness</span>
                <div className="flex items-center space-x-2">
                  <Progress value={45} className="w-32 h-2 bg-slate-800" />
                  <span className="text-white text-sm">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Dimensional Variance</span>
                <div className="flex items-center space-x-2">
                  <Progress value={30} className="w-32 h-2 bg-slate-800" />
                  <span className="text-white text-sm">30%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Tool Wear</span>
                <div className="flex items-center space-x-2">
                  <Progress value={25} className="w-32 h-2 bg-slate-800" />
                  <span className="text-white text-sm">25%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-green-400" />
              Quality Improvement Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Reduce Surface Roughness</span>
                  <Badge className="bg-yellow-500 text-white">In Progress</Badge>
                </div>
                <p className="text-slate-400 text-sm">Adjust cutting parameters and coolant flow</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Calibrate Measurement Tools</span>
                  <Badge className="bg-green-500 text-white">Completed</Badge>
                </div>
                <p className="text-slate-400 text-sm">Monthly calibration of precision instruments</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Operator Training</span>
                  <Badge className="bg-blue-500 text-white">Scheduled</Badge>
                </div>
                <p className="text-slate-400 text-sm">Quality control procedures training session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}