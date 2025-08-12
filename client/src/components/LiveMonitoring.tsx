import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Thermometer, Zap, Settings, Gauge } from "lucide-react";
import { Machine } from "@shared/schema";
import { useEffect, useState } from "react";

export function LiveMonitoring() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  
  // Fetch initial machine data
  const { data: initialMachines, isLoading } = useQuery({
    queryKey: ["/api/machines"],
  });

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket();

  useEffect(() => {
    if (initialMachines) {
      setMachines(initialMachines as Machine[]);
    }
  }, [initialMachines]);

  useEffect(() => {
    if (lastMessage && lastMessage.data && lastMessage.data !== 'undefined') {
      try {
        const message = JSON.parse(lastMessage.data);
        
        if (message.type === 'machine_update') {
          setMachines(prev => prev.map(machine => 
            machine.id === message.data.machineId 
              ? { ...machine, ...message.data }
              : machine
          ));
          setLastUpdate(new Date().toLocaleTimeString());
        } else if (message.type === 'dashboard_update') {
          if (message.data.machines) {
            setMachines(message.data.machines);
            setLastUpdate(new Date().toLocaleTimeString());
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200';
      case 'idle': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 text-green-600" />;
      case 'idle': return <Settings className="w-4 h-4 text-yellow-600" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-orange-600" />;
      case 'offline': return <Activity className="w-4 h-4 text-gray-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatValue = (value: any, unit: string) => {
    if (value === null || value === undefined) return `-- ${unit}`;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${numValue.toFixed(1)} ${unit}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Live CNC Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading machines...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Live CNC Monitoring</span>
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              {lastUpdate && <span>• Last update: {lastUpdate}</span>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Real-time machine data updates automatically every minute
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {machines.map((machine) => (
              <Card key={machine.id} className="border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium" data-testid={`text-machine-name-${machine.id}`}>
                      {machine.name}
                    </div>
                    <Badge 
                      className={getStatusColor(machine.status)}
                      data-testid={`badge-machine-status-${machine.id}`}
                    >
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(machine.status)}
                        <span className="capitalize">{machine.status}</span>
                      </span>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{machine.type}</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Temperature */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span>Temperature</span>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      data-testid={`text-temperature-${machine.id}`}
                    >
                      {formatValue(machine.temperature, '°C')}
                    </span>
                  </div>
                  
                  {/* Vibration */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span>Vibration</span>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      data-testid={`text-vibration-${machine.id}`}
                    >
                      {formatValue(machine.vibration, 'mm/s')}
                    </span>
                  </div>
                  
                  {/* Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Gauge className="w-4 h-4 text-green-500" />
                        <span>Usage</span>
                      </div>
                      <span 
                        className="text-sm font-medium"
                        data-testid={`text-usage-${machine.id}`}
                      >
                        {formatValue(machine.usage, '%')}
                      </span>
                    </div>
                    <Progress 
                      value={machine.usage ? parseFloat(machine.usage.toString()) : 0} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* RPM */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Settings className="w-4 h-4 text-purple-500" />
                      <span>RPM</span>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      data-testid={`text-rpm-${machine.id}`}
                    >
                      {machine.rpm ? machine.rpm.toLocaleString() : '--'}
                    </span>
                  </div>
                  
                  {/* Power */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Power</span>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      data-testid={`text-power-${machine.id}`}
                    >
                      {formatValue(machine.power, 'kW')}
                    </span>
                  </div>
                  
                  {/* Running Hours */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      <span>Total Hours</span>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      data-testid={`text-hours-${machine.id}`}
                    >
                      {machine.totalRunningHours?.toLocaleString() || '--'} hrs
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {machines.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No machines configured for monitoring
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}