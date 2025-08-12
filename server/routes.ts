import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJobSchema, insertDefectSchema, insertAlertSchema, insertMachineSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Machine routes
  app.get('/api/machines', isAuthenticated, async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      res.json(machines);
    } catch (error) {
      console.error("Error fetching machines:", error);
      res.status(500).json({ message: "Failed to fetch machines" });
    }
  });

  app.post('/api/machines', isAuthenticated, async (req, res) => {
    try {
      const validation = insertMachineSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).toString() 
        });
      }

      const machine = await storage.createMachine(validation.data);
      res.json(machine);
    } catch (error) {
      console.error("Error creating machine:", error);
      res.status(500).json({ message: "Failed to create machine" });
    }
  });

  app.patch('/api/machines/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, temperature } = req.body;
      
      await storage.updateMachineStatus(id, status, temperature);
      res.json({ message: "Machine status updated successfully" });
    } catch (error) {
      console.error("Error updating machine status:", error);
      res.status(500).json({ message: "Failed to update machine status" });
    }
  });

  // Job routes
  app.get('/api/jobs', isAuthenticated, async (req, res) => {
    try {
      const jobs = await storage.getRecentJobs(20);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req, res) => {
    try {
      const validation = insertJobSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).toString() 
        });
      }

      const job = await storage.createJob(validation.data);
      res.json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.patch('/api/jobs/:id/progress', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      
      await storage.updateJobProgress(id, progress);
      res.json({ message: "Job progress updated successfully" });
    } catch (error) {
      console.error("Error updating job progress:", error);
      res.status(500).json({ message: "Failed to update job progress" });
    }
  });

  // Defect routes
  app.get('/api/defects', isAuthenticated, async (req, res) => {
    try {
      const defects = await storage.getRecentDefects(20);
      res.json(defects);
    } catch (error) {
      console.error("Error fetching defects:", error);
      res.status(500).json({ message: "Failed to fetch defects" });
    }
  });

  app.post('/api/defects', isAuthenticated, async (req: any, res) => {
    try {
      const validation = insertDefectSchema.safeParse({
        ...req.body,
        reportedById: req.user.claims.sub
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).toString() 
        });
      }

      const defect = await storage.createDefect(validation.data);
      res.json(defect);
    } catch (error) {
      console.error("Error creating defect:", error);
      res.status(500).json({ message: "Failed to create defect" });
    }
  });

  // Alert routes
  app.get('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const validation = insertAlertSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).toString() 
        });
      }

      const alert = await storage.createAlert(validation.data);
      res.json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.patch('/api/alerts/:id/dismiss', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.dismissAlert(id);
      res.json({ message: "Alert dismissed successfully" });
    } catch (error) {
      console.error("Error dismissing alert:", error);
      res.status(500).json({ message: "Failed to dismiss alert" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Send initial data
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to CNCMate' }));

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Broadcast real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Simulate real-time machine updates (in production, this would come from actual machine data)
  setInterval(async () => {
    try {
      const machines = await storage.getAllMachines();
      const stats = await storage.getDashboardStats();
      
      broadcast({
        type: 'machines_update',
        data: machines,
      });
      
      broadcast({
        type: 'stats_update',
        data: stats,
      });
    } catch (error) {
      console.error('Error broadcasting updates:', error);
    }
  }, 5000);

  return httpServer;
}
