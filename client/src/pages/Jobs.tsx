import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, PlayCircle, PauseCircle, Clock, User, CheckCircle } from "lucide-react";

export function Jobs() {
  const operators = [
    { id: 1, name: "Rajesh Kumar", shift: "Morning", machine: "CNC Mill Alpha", status: "active" },
    { id: 2, name: "Priya Sharma", shift: "Evening", machine: "CNC Lathe Beta", status: "active" },
    { id: 3, name: "Amit Singh", shift: "Night", machine: "CNC Router Gamma", status: "break" },
  ];

  const jobs = [
    {
      id: "JOB-2024-001",
      title: "Automotive Parts Batch",
      machine: "CNC Mill Alpha",
      operator: "Rajesh Kumar",
      status: "running",
      progress: 75,
      startTime: "08:30 AM",
      estimatedCompletion: "02:15 PM"
    },
    {
      id: "JOB-2024-002", 
      title: "Precision Components",
      machine: "CNC Lathe Beta",
      operator: "Priya Sharma",
      status: "running",
      progress: 45,
      startTime: "10:00 AM",
      estimatedCompletion: "04:30 PM"
    },
    {
      id: "JOB-2024-003",
      title: "Aerospace Fixtures",
      machine: "CNC Router Gamma",
      operator: "Amit Singh",
      status: "paused",
      progress: 30,
      startTime: "12:00 PM",
      estimatedCompletion: "06:00 PM"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'running': return 'bg-blue-500 text-white';
      case 'paused': return 'bg-yellow-500 text-white';
      case 'break': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <PlayCircle className="w-4 h-4" />;
      case 'paused': return <PauseCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Operator & Job Tracking</h1>
              <p className="text-blue-200">Manage operators, jobs, and production workflows</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              + Add Job
            </Button>
            <Button variant="outline" className="text-white border-blue-400 hover:bg-blue-800">
              Manage Operators
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
                <p className="text-slate-400 text-sm">Active Operators</p>
                <p className="text-3xl font-bold text-green-400">3</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Running Jobs</p>
                <p className="text-3xl font-bold text-blue-400">2</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <PlayCircle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-purple-400">5</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Efficiency</p>
                <p className="text-3xl font-bold text-yellow-400">87%</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PlayCircle className="w-5 h-5 mr-2 text-blue-400" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getStatusColor(job.status)}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1 capitalize">{job.status}</span>
                      </Badge>
                      <span className="text-slate-400 text-sm">{job.id}</span>
                    </div>
                    <h3 className="text-white font-medium">{job.title}</h3>
                  </div>
                  <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                    Details
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Machine:</span>
                    <span className="text-white">{job.machine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operator:</span>
                    <span className="text-white">{job.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Started:</span>
                    <span className="text-white">{job.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Completion:</span>
                    <span className="text-white">{job.estimatedCompletion}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-2 bg-slate-700" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Operators */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-400" />
              Active Operators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {operators.map((operator) => (
              <div
                key={operator.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{operator.name}</h3>
                      <p className="text-slate-400 text-sm">{operator.shift} Shift</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(operator.status)}>
                    {operator.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Machine:</span>
                    <span className="text-white">{operator.machine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shift Hours:</span>
                    <span className="text-white">6.5 / 8 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Efficiency:</span>
                    <span className="text-green-400">92%</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 text-slate-300 border-slate-600">
                      View Profile
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Assign Task
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}