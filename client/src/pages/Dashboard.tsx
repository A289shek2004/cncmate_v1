import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { isUnauthorizedError } from "@/lib/authUtils";
import { NavigationHeader } from "@/components/NavigationHeader";
import { MachineStatusCard } from "@/components/MachineStatusCard";
import { AlertsPanel } from "@/components/AlertsPanel";
import { RecentJobs } from "@/components/RecentJobs";
import { QualityLog } from "@/components/QualityLog";
import { DefectModal } from "@/components/DefectModal";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Download, TrendingUp, TrendingDown, Cog, Briefcase, Award } from "lucide-react";
import { Machine, Job, Alert, Defect } from "@shared/schema";

interface DashboardStats {
  activeMachines: number;
  totalMachines: number;
  jobsToday: number;
  qualityRate: number;
  averageEfficiency: number;
}

export default function Dashboard() {
  const [userRole, setUserRole] = useState('supervisor');
  const [mobileActiveTab, setMobileActiveTab] = useState('home');
  const [showDefectModal, setShowDefectModal] = useState(false);
  const { toast } = useToast();
  const { lastMessage } = useWebSocket();

  // Queries
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: machines = [], isLoading: machinesLoading, error: machinesError } = useQuery<Machine[]>({
    queryKey: ['/api/machines'],
  });

  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const { data: alerts = [], isLoading: alertsLoading, error: alertsError } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const { data: defects = [], isLoading: defectsLoading, error: defectsError } = useQuery<Defect[]>({
    queryKey: ['/api/defects'],
  });

  // Handle unauthorized errors
  useEffect(() => {
    const errors = [statsError, machinesError, jobsError, alertsError, defectsError];
    const unauthorizedError = errors.find(error => error && isUnauthorizedError(error));
    
    if (unauthorizedError) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [statsError, machinesError, jobsError, alertsError, defectsError, toast]);

  // Handle WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'connection') {
        toast({
          title: "Connected",
          description: lastMessage.message || "Real-time updates enabled",
        });
      }
    }
  }, [lastMessage, toast]);

  const handleRoleChange = (role: string) => {
    setUserRole(role);
  };

  const handleNotificationsClick = () => {
    setMobileActiveTab('alerts');
  };

  const formatStatChange = (current: number, comparison: string, isIncrease: boolean) => {
    return (
      <p className={`text-sm mt-1 flex items-center ${isIncrease ? 'text-success-600' : 'text-warning-600'}`}>
        {isIncrease ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        <span>{comparison}</span>
      </p>
    );
  };

  if (statsLoading || machinesLoading || jobsLoading || alertsLoading || defectsLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="animate-pulse">
          <div className="bg-white h-16 border-b border-neutral-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="lg:col-span-2 h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const unreadAlertsCount = activeAlerts.length;

  const getMachineOperator = (machine: Machine) => {
    // In a real app, you'd join with the users table
    return machine.currentOperatorId ? `Operator ${machine.currentOperatorId.slice(-3)}` : 'Unassigned';
  };

  const getMachineJob = (machine: Machine) => {
    if (!machine.currentJobId) return undefined;
    const job = jobs.find(j => j.id === machine.currentJobId);
    return job?.jobNumber;
  };

  const getMachineProgress = (machine: Machine) => {
    if (!machine.currentJobId) return 0;
    const job = jobs.find(j => j.id === machine.currentJobId);
    return job?.progress || 0;
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      <NavigationHeader 
        userRole={userRole}
        onRoleChange={handleRoleChange}
        unreadAlerts={unreadAlertsCount}
        onNotificationsClick={handleNotificationsClick}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900" data-testid="title-dashboard">
                Factory Dashboard
              </h2>
              <p className="text-neutral-600 mt-1">
                Real-time monitoring and analytics for your CNC operations
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button 
                className="bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2"
                data-testid="button-new-job"
              >
                <Plus className="h-4 w-4" />
                <span>New Job</span>
              </Button>
              <Button 
                variant="outline"
                className="flex items-center space-x-2"
                data-testid="button-export-report"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm font-medium" data-testid="label-active-machines">
                    Active Machines
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1" data-testid="value-active-machines">
                    {stats?.activeMachines || 0}/{stats?.totalMachines || 0}
                  </p>
                  {formatStatChange(stats?.activeMachines || 0, '+2 from yesterday', true)}
                </div>
                <div className="bg-success-100 p-3 rounded-lg">
                  <Cog className="text-success-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm font-medium" data-testid="label-jobs-today">
                    Total Jobs Today
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1" data-testid="value-jobs-today">
                    {stats?.jobsToday || 0}
                  </p>
                  {formatStatChange(stats?.jobsToday || 0, '+8% vs average', true)}
                </div>
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Briefcase className="text-primary-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm font-medium" data-testid="label-quality-rate">
                    Quality Rate
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1" data-testid="value-quality-rate">
                    {stats?.qualityRate.toFixed(1) || 0}%
                  </p>
                  {formatStatChange(stats?.qualityRate || 0, '+1.2% this week', true)}
                </div>
                <div className="bg-warning-100 p-3 rounded-lg">
                  <Award className="text-warning-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm font-medium" data-testid="label-efficiency">
                    Avg. Efficiency
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1" data-testid="value-efficiency">
                    {stats?.averageEfficiency.toFixed(1) || 0}%
                  </p>
                  {stats?.averageEfficiency && stats.averageEfficiency < 90 
                    ? formatStatChange(stats.averageEfficiency, '-2.1% vs target', false)
                    : formatStatChange(stats?.averageEfficiency || 0, '+1.5% vs target', true)
                  }
                </div>
                <div className="bg-error-100 p-3 rounded-lg">
                  <TrendingUp className="text-error-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Machine Status Grid */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900" data-testid="title-machine-status">
                    Machine Status
                  </h3>
                  <div className="flex space-x-2">
                    <span className="bg-success-100 text-success-700 px-2 py-1 rounded text-xs font-medium">
                      {machines.filter(m => m.status === 'running').length} Running
                    </span>
                    <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded text-xs font-medium">
                      {machines.filter(m => m.status === 'idle').length} Idle
                    </span>
                    <span className="bg-error-100 text-error-700 px-2 py-1 rounded text-xs font-medium">
                      {machines.filter(m => m.status === 'offline' || m.status === 'maintenance').length} Offline
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                {machines.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500" data-testid="text-no-machines">
                    <p>No machines configured</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {machines.map((machine) => (
                      <MachineStatusCard
                        key={machine.id}
                        machine={machine}
                        operator={getMachineOperator(machine)}
                        currentJob={getMachineJob(machine)}
                        progress={getMachineProgress(machine)}
                        onViewDetails={(id) => console.log('View details for machine:', id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alerts Panel */}
          <div>
            <AlertsPanel alerts={activeAlerts} />
          </div>
        </div>

        {/* Recent Jobs and Quality Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentJobs 
            jobs={jobs.slice(0, 10)} 
            onViewAll={() => console.log('View all jobs')}
          />
          <QualityLog 
            defects={defects.slice(0, 10)} 
            onLogNewDefect={() => setShowDefectModal(true)}
          />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation 
        activeTab={mobileActiveTab}
        onTabChange={setMobileActiveTab}
        unreadAlerts={unreadAlertsCount}
      />

      {/* Defect Modal */}
      <DefectModal
        isOpen={showDefectModal}
        onClose={() => setShowDefectModal(false)}
        machines={machines.map(m => ({ id: m.id, name: m.name }))}
        jobs={jobs.filter(j => j.status === 'in_progress').map(j => ({ id: j.id, jobNumber: j.jobNumber }))}
      />
    </div>
  );
}
