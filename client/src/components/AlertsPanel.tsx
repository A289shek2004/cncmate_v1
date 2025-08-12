import { Alert } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, XCircle, Info } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const dismissMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await apiRequest("PATCH", `/api/alerts/${alertId}/dismiss`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Success",
        description: "Alert dismissed successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to dismiss alert",
        variant: "destructive",
      });
    },
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <AlertTriangle className="text-warning-600" />;
      case 'offline':
        return <XCircle className="text-error-600" />;
      case 'maintenance':
        return <Info className="text-primary-600" />;
      default:
        return <AlertTriangle className="text-warning-600" />;
    }
  };

  const getAlertStyle = (type: string, severity: string) => {
    if (severity === 'critical') {
      return 'bg-error-50 border-error-200';
    }
    
    switch (type) {
      case 'temperature':
        return 'bg-warning-50 border-warning-200';
      case 'offline':
        return 'bg-error-50 border-error-200';
      case 'maintenance':
        return 'bg-primary-50 border-primary-200';
      default:
        return 'bg-warning-50 border-warning-200';
    }
  };

  const getAlertTextColor = (type: string, severity: string) => {
    if (severity === 'critical') {
      return 'text-error-800';
    }
    
    switch (type) {
      case 'temperature':
        return 'text-warning-800';
      case 'offline':
        return 'text-error-800';
      case 'maintenance':
        return 'text-primary-800';
      default:
        return 'text-warning-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    return alertTime.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle data-testid="title-active-alerts">Active Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-neutral-500" data-testid="text-no-alerts">
            <Info className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start space-x-3 p-3 border rounded-lg ${getAlertStyle(alert.type, alert.severity)}`}
              data-testid={`alert-${alert.id}`}
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <p 
                  className={`text-sm font-medium ${getAlertTextColor(alert.type, alert.severity)}`}
                  data-testid={`text-alert-title-${alert.id}`}
                >
                  {alert.title}
                </p>
                <p 
                  className={`text-sm ${getAlertTextColor(alert.type, alert.severity).replace('800', '700')}`}
                  data-testid={`text-alert-description-${alert.id}`}
                >
                  {alert.description}
                </p>
                <p 
                  className={`text-xs mt-1 ${getAlertTextColor(alert.type, alert.severity).replace('800', '600')}`}
                  data-testid={`text-alert-timestamp-${alert.id}`}
                >
                  {formatTimestamp(alert.createdAt || new Date().toISOString())}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`${getAlertTextColor(alert.type, alert.severity).replace('800', '600')} hover:${getAlertTextColor(alert.type, alert.severity).replace('800', '800')}`}
                onClick={() => dismissMutation.mutate(alert.id)}
                disabled={dismissMutation.isPending}
                data-testid={`button-dismiss-alert-${alert.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
