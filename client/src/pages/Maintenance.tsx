import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Calendar, Wrench, Clock } from "lucide-react";

export function Maintenance() {
  const maintenanceAlerts = [
    {
      id: 1,
      machine: "CNC Mill Alpha",
      type: "Predictive",
      severity: "medium",
      message: "Spindle bearing temperature trending upward",
      prediction: "Maintenance required in 72 hours",
      confidence: 85
    },
    {
      id: 2,
      machine: "CNC Lathe Beta",
      type: "Scheduled",
      severity: "low",
      message: "Regular maintenance due",
      prediction: "Scheduled for next week",
      confidence: 100
    },
    {
      id: 3,
      machine: "CNC Router Gamma",
      type: "Critical",
      severity: "high",
      message: "Unusual vibration patterns detected",
      prediction: "Immediate inspection recommended",
      confidence: 92
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Predictive Maintenance</h1>
              <p className="text-purple-200">AI-powered analytics for proactive maintenance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-400">1</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Predicted Issues</p>
                <p className="text-3xl font-bold text-yellow-400">2</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Confidence</p>
                <p className="text-3xl font-bold text-green-400">89%</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Cost Savings</p>
                <p className="text-3xl font-bold text-blue-400">₹2.4L</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Alerts */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI Maintenance Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {maintenanceAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                      {alert.type}
                    </Badge>
                    <span className="text-slate-300 font-medium">{alert.machine}</span>
                  </div>
                  <p className="text-white font-medium mb-1">{alert.message}</p>
                  <p className="text-slate-400 text-sm mb-2">{alert.prediction}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Brain className="w-4 h-4" />
                      <span>Confidence: {alert.confidence}%</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>2 minutes ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    View Details
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Maintenance Calendar */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-400" />
            Upcoming Maintenance Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400 py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Maintenance calendar coming soon</p>
            <p className="text-sm">Schedule and track maintenance activities</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}