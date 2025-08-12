import mqtt from 'mqtt';
import { WebSocket } from 'ws';
import { storage } from './storage';

interface MachineData {
  machineId: string;
  temperature: number;
  vibration: number;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  usage: number;
  rpm: number;
  power: number;
}

class MQTTClient {
  private client: mqtt.MqttClient | null = null;
  private wsClients: Set<WebSocket> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
    this.startPeriodicUpdates();
  }

  private connect() {
    try {
      // Connect to MQTT broker (using public test broker for demo)
      this.client = mqtt.connect('mqtt://test.mosquitto.org:1883', {
        clientId: `cncmate_${Math.random().toString(16).substr(2, 8)}`,
        clean: true,
        reconnectPeriod: 1000,
      });

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        // Subscribe to machine data topics
        this.client?.subscribe([
          'cncmate/machine/+/temperature',
          'cncmate/machine/+/vibration',
          'cncmate/machine/+/status',
          'cncmate/machine/+/usage',
          'cncmate/machine/+/rpm',
          'cncmate/machine/+/power'
        ]);
      });

      this.client.on('message', (topic, message) => {
        this.handleMqttMessage(topic, message);
      });

      this.client.on('error', (error) => {
        console.error('MQTT connection error:', error);
      });

    } catch (error) {
      console.error('Failed to connect to MQTT broker:', error);
    }
  }

  private handleMqttMessage(topic: string, message: Buffer) {
    try {
      const parts = topic.split('/');
      if (parts.length >= 4 && parts[0] === 'cncmate' && parts[1] === 'machine') {
        const machineId = parts[2];
        const metric = parts[3];
        const value = parseFloat(message.toString());

        this.updateMachineMetric(machineId, metric, value);
      }
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  }

  private async updateMachineMetric(machineId: string, metric: string, value: number | string) {
    try {
      const machine = await storage.getMachine(machineId);
      if (!machine) return;

      const updates: any = {};
      
      switch (metric) {
        case 'temperature':
          updates.temperature = Math.round(typeof value === 'string' ? parseFloat(value) : value);
          break;
        case 'vibration':
          updates.vibration = (typeof value === 'string' ? parseFloat(value) : value).toFixed(2);
          break;
        case 'status':
          updates.status = value;
          break;
        case 'usage':
          updates.usage = (typeof value === 'string' ? parseFloat(value) : value).toFixed(2);
          break;
        case 'rpm':
          updates.rpm = Math.round(typeof value === 'string' ? parseFloat(value) : value);
          break;
        case 'power':
          updates.power = (typeof value === 'string' ? parseFloat(value) : value).toFixed(2);
          break;
      }

      await storage.updateMachine(machineId, updates);
      
      // Broadcast update to WebSocket clients
      this.broadcastMachineUpdate({ machineId, [metric]: value });
      
    } catch (error) {
      console.error('Error updating machine metric:', error);
    }
  }

  // Simulate real-time data for demo purposes
  private simulateRealtimeData() {
    const machineIds = ['machine-001', 'machine-002', 'machine-003', 'machine-004', 'machine-005'];
    
    machineIds.forEach(machineId => {
      // Generate realistic CNC machine data
      const temperature = 35 + Math.random() * 25; // 35-60°C
      const vibration = Math.random() * 5; // 0-5 mm/s
      const usage = Math.random() * 100; // 0-100%
      const rpm = 1000 + Math.random() * 2000; // 1000-3000 RPM
      const power = 5 + Math.random() * 15; // 5-20 kW
      
      // Randomly change status occasionally
      const statuses = ['running', 'idle', 'maintenance', 'offline'];
      const currentStatus = Math.random() < 0.95 ? 'running' : statuses[Math.floor(Math.random() * statuses.length)];

      // Update machine data
      this.updateMachineMetric(machineId, 'temperature', temperature);
      this.updateMachineMetric(machineId, 'vibration', vibration);
      this.updateMachineMetric(machineId, 'usage', usage);
      this.updateMachineMetric(machineId, 'rpm', rpm);
      this.updateMachineMetric(machineId, 'power', power);
      
      if (Math.random() < 0.1) { // 10% chance to change status
        this.updateMachineMetric(machineId, 'status', currentStatus);
      }
    });
  }

  private startPeriodicUpdates() {
    // Update dashboard every minute (60000ms)
    this.updateInterval = setInterval(() => {
      this.simulateRealtimeData();
      this.broadcastDashboardUpdate();
    }, 60000);

    // Also send initial simulated data
    setTimeout(() => {
      this.simulateRealtimeData();
    }, 2000);
  }

  private async broadcastDashboardUpdate() {
    try {
      const machines = await storage.getAllMachines();
      const jobs = await storage.getAllJobs();
      const alerts = await storage.getAllAlerts();
      
      const activeMachines = machines.filter(m => m.status === 'running').length;
      const activeJobs = jobs.filter(j => j.status === 'in_progress').length;
      const pendingAlerts = alerts.filter((a: any) => !a.dismissed).length;

      const update = {
        type: 'dashboard_update',
        data: {
          activeMachines,
          totalMachines: machines.length,
          activeJobs,
          totalJobs: jobs.length,
          pendingAlerts,
          machines,
          timestamp: new Date().toISOString()
        }
      };

      this.broadcastToClients(update);
    } catch (error) {
      console.error('Error broadcasting dashboard update:', error);
    }
  }

  private broadcastMachineUpdate(data: any) {
    const update = {
      type: 'machine_update',
      data,
      timestamp: new Date().toISOString()
    };
    
    this.broadcastToClients(update);
  }

  private broadcastToClients(data: any) {
    this.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  addWebSocketClient(ws: WebSocket) {
    this.wsClients.add(ws);
    
    ws.on('close', () => {
      this.wsClients.delete(ws);
    });
  }

  publishMachineCommand(machineId: string, command: string, value?: any) {
    if (this.client && this.client.connected) {
      const topic = `cncmate/machine/${machineId}/command`;
      const payload = JSON.stringify({ command, value, timestamp: new Date().toISOString() });
      this.client.publish(topic, payload);
    }
  }

  disconnect() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.client) {
      this.client.end();
    }
  }
}

export const mqttClient = new MQTTClient();