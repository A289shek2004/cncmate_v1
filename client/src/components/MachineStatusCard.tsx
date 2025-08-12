import { Machine } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MachineStatusCardProps {
  machine: Machine;
  operator?: string;
  currentJob?: string;
  progress?: number;
  onViewDetails?: (machineId: string) => void;
}

export function MachineStatusCard({ 
  machine, 
  operator, 
  currentJob, 
  progress = 0,
  onViewDetails 
}: MachineStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-success-100 text-success-700';
      case 'idle':
        return 'bg-warning-100 text-warning-700';
      case 'offline':
      case 'maintenance':
        return 'bg-error-100 text-error-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-success-500';
      case 'idle':
        return 'bg-warning-500';
      case 'offline':
      case 'maintenance':
        return 'bg-error-500';
      default:
        return 'bg-neutral-500';
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 80) return 'text-error-600';
    if (temp > 60) return 'text-warning-600';
    return 'text-success-600';
  };

  const isOffline = machine.status === 'offline' || machine.status === 'maintenance';

  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${isOffline ? 'bg-error-50 border-error-200' : ''}`}
      data-testid={`card-machine-${machine.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-neutral-900" data-testid={`text-machine-name-${machine.id}`}>
            {machine.name}
          </h4>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getStatusDot(machine.status)}`}></div>
            <Badge 
              className={`text-xs font-medium ${getStatusColor(machine.status)}`}
              data-testid={`text-machine-status-${machine.id}`}
            >
              {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Operator:</span>
            <span className="font-medium" data-testid={`text-operator-${machine.id}`}>
              {operator || 'Unassigned'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-neutral-600">Job:</span>
            <span 
              className={`font-medium ${currentJob ? '' : 'text-neutral-400'}`}
              data-testid={`text-job-${machine.id}`}
            >
              {currentJob || 'None'}
            </span>
          </div>
          
          {machine.status === 'running' && currentJob && (
            <>
              <div className="flex justify-between">
                <span className="text-neutral-600">Progress:</span>
                <span className="font-medium" data-testid={`text-progress-${machine.id}`}>
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </>
          )}
          
          {machine.status === 'idle' && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Idle Time:</span>
              <span className="font-medium text-warning-600" data-testid={`text-idle-time-${machine.id}`}>
                {Math.floor(Math.random() * 30) + 1} min
              </span>
            </div>
          )}
          
          {isOffline && (
            <>
              <div className="flex justify-between">
                <span className="text-neutral-600">Issue:</span>
                <span className="font-medium text-error-600" data-testid={`text-issue-${machine.id}`}>
                  {machine.status === 'maintenance' ? 'Scheduled Maintenance' : 'Connection Lost'}
                </span>
              </div>
              <Button 
                className="w-full bg-error-600 text-white py-1 text-xs font-medium hover:bg-error-700"
                onClick={() => onViewDetails?.(machine.id)}
                data-testid={`button-view-details-${machine.id}`}
              >
                View Details
              </Button>
            </>
          )}
          
          <div className="flex justify-between">
            <span className="text-neutral-600">Temp:</span>
            <span 
              className={`font-medium ${getTemperatureColor(machine.temperature || 0)}`}
              data-testid={`text-temperature-${machine.id}`}
            >
              {machine.temperature || 0}°C
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
