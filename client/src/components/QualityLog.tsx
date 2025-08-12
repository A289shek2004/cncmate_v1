import { Defect } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle, CheckCircle } from "lucide-react";

interface QualityLogProps {
  defects: Defect[];
  onLogNewDefect?: () => void;
}

export function QualityLog({ defects, onLogNewDefect }: QualityLogProps) {
  const getDefectIcon = (severity: string, resolved: boolean) => {
    if (resolved) {
      return <CheckCircle className="text-success-600 mt-1" />;
    }
    
    switch (severity) {
      case 'critical':
      case 'high':
        return <XCircle className="text-error-600 mt-1" />;
      case 'medium':
        return <AlertTriangle className="text-warning-600 mt-1" />;
      default:
        return <AlertTriangle className="text-warning-600 mt-1" />;
    }
  };

  const getDefectStyle = (severity: string, resolved: boolean) => {
    if (resolved) {
      return 'bg-success-50 border-success-200';
    }
    
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-error-50 border-error-200';
      case 'medium':
        return 'bg-warning-50 border-warning-200';
      case 'low':
        return 'bg-neutral-50 border-neutral-200';
      default:
        return 'bg-warning-50 border-warning-200';
    }
  };

  const getDefectTextColor = (severity: string, resolved: boolean) => {
    if (resolved) {
      return 'text-success-800';
    }
    
    switch (severity) {
      case 'critical':
      case 'high':
        return 'text-error-800';
      case 'medium':
        return 'text-warning-800';
      case 'low':
        return 'text-neutral-800';
      default:
        return 'text-warning-800';
    }
  };

  const getSeverityBadge = (severity: string, resolved: boolean) => {
    if (resolved) {
      return <Badge className="bg-success-200 text-success-800 text-xs font-medium">Resolved</Badge>;
    }
    
    switch (severity) {
      case 'critical':
        return <Badge className="bg-error-200 text-error-800 text-xs font-medium">Critical</Badge>;
      case 'high':
        return <Badge className="bg-error-200 text-error-800 text-xs font-medium">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning-200 text-warning-800 text-xs font-medium">Medium</Badge>;
      case 'low':
        return <Badge className="bg-neutral-200 text-neutral-800 text-xs font-medium">Low</Badge>;
      default:
        return <Badge className="bg-warning-200 text-warning-800 text-xs font-medium">{severity}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const defectTime = new Date(timestamp);
    const diffMs = now.getTime() - defectTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return defectTime.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="title-quality-log">Quality Log</CardTitle>
          <Button
            className="bg-error-600 text-white hover:bg-error-700"
            onClick={onLogNewDefect}
            data-testid="button-log-defect"
          >
            Log Defect
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {defects.length === 0 ? (
          <div className="text-center py-8 text-neutral-500" data-testid="text-no-defects">
            <CheckCircle className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
            <p>No quality issues reported</p>
          </div>
        ) : (
          <div className="space-y-4">
            {defects.map((defect) => (
              <div
                key={defect.id}
                className={`flex items-start space-x-3 p-4 border rounded-lg ${getDefectStyle(defect.severity, defect.resolved || false)}`}
                data-testid={`defect-${defect.id}`}
              >
                {getDefectIcon(defect.severity, defect.resolved || false)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className={`font-medium ${getDefectTextColor(defect.severity, defect.resolved || false)}`}
                      data-testid={`text-defect-type-${defect.id}`}
                    >
                      {defect.type}
                    </span>
                    {getSeverityBadge(defect.severity, defect.resolved || false)}
                  </div>
                  <p 
                    className={`text-sm ${getDefectTextColor(defect.severity, defect.resolved || false).replace('800', '700')}`}
                    data-testid={`text-defect-description-${defect.id}`}
                  >
                    {defect.description}
                  </p>
                  <div 
                    className={`flex items-center space-x-4 mt-2 text-xs ${getDefectTextColor(defect.severity, defect.resolved || false).replace('800', '600')}`}
                  >
                    {defect.jobId && (
                      <span data-testid={`text-defect-job-${defect.id}`}>
                        Job: {defect.jobId}
                      </span>
                    )}
                    <span data-testid={`text-defect-machine-${defect.id}`}>
                      Machine: {defect.machineId}
                    </span>
                    <span data-testid={`text-defect-timestamp-${defect.id}`}>
                      {formatTimestamp(defect.createdAt || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
