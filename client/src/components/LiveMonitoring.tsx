import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Activity, Thermometer, Zap, Settings, Gauge, RotateCcw, Wifi, WifiOff, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { Machine } from "@shared/schema";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ChartDataPoint {
  time: string;
  temperature: number;
  rpm: number;
  vibration: number;
  power: number;
  usage: number;
}

export function LiveMonitoring() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);
  
  // Fetch initial machine data
  const { data: initialMachines, isLoading } = useQuery({
    queryKey: ["/api/machines"],
  });

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket();

  useEffect(() => {
    if (initialMachines) {
      setMachines(initialMachines as Machine[]);
      if (!selectedMachine && initialMachines.length > 0) {
        setSelectedMachine(initialMachines[0].id);
      }
    }
  }, [initialMachines, selectedMachine]);

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
          setUpdateCount(prev => prev + 1);
          
          // Update chart data for selected machine
          if (message.data.machineId === selectedMachine) {
            updateChartData(message.data);
          }
        } else if (message.type === 'dashboard_update') {
          if (message.data.machines) {
            setMachines(message.data.machines);
            setLastUpdate(new Date().toLocaleTimeString());
            setUpdateCount(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage, selectedMachine]);

  const updateChartData = (machineData: any) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    setChartData(prev => {
      const newData = [...prev, {
        time: timeStr,
        temperature: machineData.temperature || 0,
        rpm: machineData.rpm || 0,
        vibration: parseFloat(machineData.vibration || '0'),
        power: parseFloat(machineData.power || '0'),
        usage: parseFloat(machineData.usage || '0')
      }];
      
      // Keep only last 20 data points for performance
      return newData.slice(-20);
    });
  };

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

  const selectedMachineData = machines.find(m => m.id === selectedMachine);
  const activeMachines = machines.filter(m => m.status === 'running').length;
  const totalProduction = machines.reduce((sum, m) => sum + (parseFloat(m.usage?.toString() || '0') * 12.47), 0);
  const efficiencyRate = machines.length > 0 ? (activeMachines / machines.length) * 100 : 0;
  const activeAlerts = 1; // This would come from actual alerts data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Real-time Dashboard</h2>
              <p className="text-slate-300">AI-powered CNC monitoring with live data updates every 2 seconds</p>
            </div>
            <Badge className="bg-green-500 text-white px-3 py-1">LIVE</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              Operators
            </Button>
            <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-700">
              <Activity className="w-4 h-4 mr-2" />
              Alerts (3)
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              + Add Machine
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            {isConnected ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
            <span className="text-green-400">Live Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{updateCount} Updates</span>
            <span>Total received</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Next in 2s</span>
            <span>Auto-refresh</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span>Last update: {lastUpdate || 'Never'}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white border-slate-600 hover:bg-slate-700"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {autoRefresh ? 'Live Mode' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Machines</p>
                <p className="text-3xl font-bold">{activeMachines} <span className="text-xl text-slate-400">/ {machines.length}</span></p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.0 vs yesterday
                </div>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Production</p>
                <p className="text-3xl font-bold">{Math.round(totalProduction).toLocaleString()}</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +32.5 vs last week
                </div>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Gauge className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Efficiency Rate</p>
                <p className="text-3xl font-bold">{efficiencyRate.toFixed(1)}%</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +4.3 vs yesterday
                </div>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold">{activeAlerts}</p>
                <div className="flex items-center text-red-400 text-sm mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  +1.0 vs yesterday
                </div>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Machine Analytics */}
      <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-indigo-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">Real-time Machine Analytics</h3>
                <p className="text-indigo-200">Live monitoring data for CNC Mill #1</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-white border-indigo-400 hover:bg-indigo-800">
                Auto Refresh
              </Button>
              <Button variant="outline" size="sm" className="text-white border-indigo-400 hover:bg-indigo-800">
                Line
              </Button>
              <Button variant="outline" size="sm" className="text-white border-indigo-400 hover:bg-indigo-800">
                Area
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Machine Selection */}
          <div className="mb-6">
            <p className="text-indigo-200 text-sm mb-3">Select Machine:</p>
            <div className="flex flex-wrap gap-2">
              {machines.map((machine) => (
                <Button
                  key={machine.id}
                  variant={selectedMachine === machine.id ? "default" : "outline"}
                  size="sm"
                  className={`${
                    selectedMachine === machine.id
                      ? "bg-blue-600 text-white"
                      : "text-indigo-200 border-indigo-400 hover:bg-indigo-800"
                  }`}
                  onClick={() => setSelectedMachine(machine.id)}
                >
                  {machine.name.replace("CNC ", "")}
                  {machine.status === 'running' && (
                    <div className="w-2 h-2 bg-green-400 rounded-full ml-2" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Temperature Chart */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <span className="text-white font-medium">Temperature</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">
                    {selectedMachineData?.temperature || 0}°C
                  </div>
                  <div className="text-xs text-slate-400">Temperature normal</div>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <Area 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#f87171" 
                      fill="#f871711a"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RPM Chart */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">RPM (Speed)</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedMachineData?.rpm?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-slate-400">Speed normal</div>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <Area 
                      type="monotone" 
                      dataKey="rpm" 
                      stroke="#60a5fa" 
                      fill="#60a5fa1a"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vibration Chart */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Vibration</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatValue(selectedMachineData?.vibration, 'mm/s')}
                  </div>
                  <div className="text-xs text-slate-400">Vibration normal</div>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <Area 
                      type="monotone" 
                      dataKey="vibration" 
                      stroke="#c084fc" 
                      fill="#c084fc1a"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machine Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <Card key={machine.id} className="bg-slate-900 border-slate-700 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="font-medium" data-testid={`text-machine-name-${machine.id}`}>
                  {machine.name}
                </div>
                <Badge 
                  className={machine.status === 'running' ? 'bg-green-500 text-white' : 
                            machine.status === 'idle' ? 'bg-yellow-500 text-white' : 
                            machine.status === 'maintenance' ? 'bg-orange-500 text-white' :
                            'bg-gray-500 text-white'}
                  data-testid={`badge-machine-status-${machine.id}`}
                >
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(machine.status)}
                    <span className="capitalize">{machine.status}</span>
                  </span>
                </Badge>
              </div>
              <div className="text-sm text-slate-400">{machine.type}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                    <Thermometer className="w-3 h-3" />
                    <span>Temp</span>
                  </div>
                  <div className="text-lg font-bold text-red-400" data-testid={`text-temperature-${machine.id}`}>
                    {machine.temperature || 0}°C
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                    <Activity className="w-3 h-3" />
                    <span>Vibration</span>
                  </div>
                  <div className="text-lg font-bold text-purple-400" data-testid={`text-vibration-${machine.id}`}>
                    {formatValue(machine.vibration, 'mm/s')}
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                    <Settings className="w-3 h-3" />
                    <span>RPM</span>
                  </div>
                  <div className="text-lg font-bold text-blue-400" data-testid={`text-rpm-${machine.id}`}>
                    {machine.rpm?.toLocaleString() || '0'}
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                    <Zap className="w-3 h-3" />
                    <span>Power</span>
                  </div>
                  <div className="text-lg font-bold text-yellow-400" data-testid={`text-power-${machine.id}`}>
                    {formatValue(machine.power, 'kW')}
                  </div>
                </div>
              </div>
              
              {/* Usage Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Usage</span>
                  <span className="text-sm font-medium text-green-400" data-testid={`text-usage-${machine.id}`}>
                    {formatValue(machine.usage, '%')}
                  </span>
                </div>
                <Progress 
                  value={machine.usage ? parseFloat(machine.usage.toString()) : 0} 
                  className="h-2 bg-slate-800"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {machines.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No machines configured for monitoring</p>
          <p className="text-sm">Add CNC machines to start monitoring their performance</p>
        </div>
      )}
    </div>
  );
}