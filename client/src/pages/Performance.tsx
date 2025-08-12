import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Gauge, Clock, Zap, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Performance() {
  const performanceData = [
    { name: 'Mon', efficiency: 85, output: 120, downtime: 2 },
    { name: 'Tue', efficiency: 92, output: 135, downtime: 1 },
    { name: 'Wed', efficiency: 88, output: 128, downtime: 3 },
    { name: 'Thu', efficiency: 96, output: 142, downtime: 1 },
    { name: 'Fri', efficiency: 91, output: 139, downtime: 2 },
    { name: 'Sat', efficiency: 87, output: 125, downtime: 4 },
    { name: 'Sun', efficiency: 89, output: 130, downtime: 2 }
  ];

  const machineUtilization = [
    { name: 'CNC Mill Alpha', value: 87, color: '#3b82f6' },
    { name: 'CNC Lathe Beta', value: 92, color: '#10b981' },
    { name: 'CNC Router Gamma', value: 78, color: '#f59e0b' },
    { name: 'CNC Drill Delta', value: 45, color: '#ef4444' },
    { name: 'CNC Grinder Epsilon', value: 23, color: '#8b5cf6' }
  ];

  const downtimeReasons = [
    { name: 'Maintenance', value: 45, color: '#3b82f6' },
    { name: 'Setup Change', value: 30, color: '#10b981' },
    { name: 'Material Wait', value: 15, color: '#f59e0b' },
    { name: 'Technical Issues', value: 10, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Performance Dashboards</h1>
              <p className="text-green-200">Comprehensive analytics and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-green-600 hover:bg-green-700">
              Generate Report
            </Button>
            <Button variant="outline" className="text-white border-green-400 hover:bg-green-800">
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Overall Efficiency</p>
                <p className="text-3xl font-bold text-green-400">89.2%</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.2% vs last week
                </div>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Gauge className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Output</p>
                <p className="text-3xl font-bold text-blue-400">924</p>
                <div className="flex items-center text-blue-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15 units today
                </div>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Downtime</p>
                <p className="text-3xl font-bold text-yellow-400">2.1h</p>
                <div className="flex items-center text-red-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.5h vs yesterday
                </div>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Energy Usage</p>
                <p className="text-3xl font-bold text-purple-400">156kWh</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  -8% vs last week
                </div>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Trends */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Weekly Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Efficiency (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="output" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Output (units)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Machine Utilization */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Gauge className="w-5 h-5 mr-2 text-blue-400" />
              Machine Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machineUtilization.map((machine, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">{machine.name}</span>
                    <span className="text-white font-medium">{machine.value}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${machine.value}%`,
                        backgroundColor: machine.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Output */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
              Daily Output & Downtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="output" fill="#3b82f6" name="Output (units)" />
                  <Bar dataKey="downtime" fill="#ef4444" name="Downtime (hours)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Downtime Analysis */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              Downtime Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={downtimeReasons}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {downtimeReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary Table */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
            Machine Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Machine</th>
                  <th className="text-left py-3 px-4 text-slate-400">Utilization</th>
                  <th className="text-left py-3 px-4 text-slate-400">Efficiency</th>
                  <th className="text-left py-3 px-4 text-slate-400">Output Today</th>
                  <th className="text-left py-3 px-4 text-slate-400">Downtime</th>
                  <th className="text-left py-3 px-4 text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {machineUtilization.map((machine, index) => (
                  <tr key={index} className="border-b border-slate-800">
                    <td className="py-3 px-4 text-white">{machine.name}</td>
                    <td className="py-3 px-4 text-white">{machine.value}%</td>
                    <td className="py-3 px-4 text-white">{85 + index * 2}%</td>
                    <td className="py-3 px-4 text-white">{120 + index * 10} units</td>
                    <td className="py-3 px-4 text-white">{1 + index * 0.5}h</td>
                    <td className="py-3 px-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          machine.value > 80 ? 'bg-green-500 text-white' :
                          machine.value > 50 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}
                      >
                        {machine.value > 80 ? 'Optimal' : machine.value > 50 ? 'Fair' : 'Poor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}