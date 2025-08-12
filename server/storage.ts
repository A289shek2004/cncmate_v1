import {
  users,
  machines,
  jobs,
  defects,
  alerts,
  shiftReports,
  type User,
  type UpsertUser,
  type Machine,
  type InsertMachine,
  type Job,
  type InsertJob,
  type Defect,
  type InsertDefect,
  type Alert,
  type InsertAlert,
  type ShiftReport,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Machine operations
  getAllMachines(): Promise<Machine[]>;
  getMachine(id: string): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: string, updates: Partial<InsertMachine>): Promise<Machine | undefined>;
  updateMachineStatus(id: string, status: string, temperature?: number): Promise<void>;
  
  // Job operations
  getAllJobs(): Promise<Job[]>;
  getRecentJobs(limit?: number): Promise<Job[]>;
  getJobsByMachine(machineId: string): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJobProgress(id: string, progress: number): Promise<void>;
  updateJobStatus(id: string, status: string): Promise<void>;
  
  // Defect operations
  getAllDefects(): Promise<Defect[]>;
  getRecentDefects(limit?: number): Promise<Defect[]>;
  createDefect(defect: InsertDefect): Promise<Defect>;
  resolveDefect(id: string): Promise<void>;
  
  // Alert operations
  getAllAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  dismissAlert(id: string): Promise<void>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    activeMachines: number;
    totalMachines: number;
    jobsToday: number;
    qualityRate: number;
    averageEfficiency: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Machine operations
  async getAllMachines(): Promise<Machine[]> {
    return await db.select().from(machines).orderBy(machines.name);
  }

  async getMachine(id: string): Promise<Machine | undefined> {
    const [machine] = await db.select().from(machines).where(eq(machines.id, id));
    return machine;
  }

  async createMachine(machine: InsertMachine): Promise<Machine> {
    const [newMachine] = await db.insert(machines).values(machine).returning();
    return newMachine;
  }

  async updateMachine(id: string, updates: Partial<InsertMachine>): Promise<Machine | undefined> {
    const [machine] = await db
      .update(machines)
      .set({ ...updates, updatedAt: new Date(), lastDataUpdate: new Date() })
      .where(eq(machines.id, id))
      .returning();
    return machine;
  }

  async updateMachineStatus(id: string, status: string, temperature?: number): Promise<void> {
    const updateData: any = { status, updatedAt: new Date() };
    if (temperature !== undefined) {
      updateData.temperature = temperature;
    }
    
    await db.update(machines)
      .set(updateData)
      .where(eq(machines.id, id));
  }

  // Job operations
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getRecentJobs(limit: number = 10): Promise<Job[]> {
    return await db.select().from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(limit);
  }

  async getJobsByMachine(machineId: string): Promise<Job[]> {
    return await db.select().from(jobs)
      .where(eq(jobs.machineId, machineId))
      .orderBy(desc(jobs.createdAt));
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJobProgress(id: string, progress: number): Promise<void> {
    await db.update(jobs)
      .set({ progress, updatedAt: new Date() })
      .where(eq(jobs.id, id));
  }

  async updateJobStatus(id: string, status: string): Promise<void> {
    const updateData: any = { status, updatedAt: new Date() };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    } else if (status === 'in_progress' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }
    
    await db.update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id));
  }

  // Defect operations
  async getAllDefects(): Promise<Defect[]> {
    return await db.select().from(defects).orderBy(desc(defects.createdAt));
  }

  async getRecentDefects(limit: number = 10): Promise<Defect[]> {
    return await db.select().from(defects)
      .orderBy(desc(defects.createdAt))
      .limit(limit);
  }

  async createDefect(defect: InsertDefect): Promise<Defect> {
    const [newDefect] = await db.insert(defects).values(defect).returning();
    return newDefect;
  }

  async resolveDefect(id: string): Promise<void> {
    await db.update(defects)
      .set({ resolved: true, resolvedAt: new Date() })
      .where(eq(defects.id, id));
  }

  // Alert operations
  async getAllAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts)
      .where(eq(alerts.dismissed, false))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async dismissAlert(id: string): Promise<void> {
    await db.update(alerts)
      .set({ dismissed: true, dismissedAt: new Date() })
      .where(eq(alerts.id, id));
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    activeMachines: number;
    totalMachines: number;
    jobsToday: number;
    qualityRate: number;
    averageEfficiency: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [totalMachinesResult] = await db.select({ count: sql<number>`count(*)` }).from(machines);
    const [activeMachinesResult] = await db.select({ count: sql<number>`count(*)` })
      .from(machines)
      .where(eq(machines.status, 'running'));
    
    const [jobsTodayResult] = await db.select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(sql`${jobs.createdAt} >= ${today}`);
    
    const [defectsTodayResult] = await db.select({ count: sql<number>`count(*)` })
      .from(defects)
      .where(sql`${defects.createdAt} >= ${today}`);
    
    const totalMachines = totalMachinesResult?.count || 0;
    const activeMachines = activeMachinesResult?.count || 0;
    const jobsToday = jobsTodayResult?.count || 0;
    const defectsToday = defectsTodayResult?.count || 0;
    
    const qualityRate = jobsToday > 0 ? ((jobsToday - defectsToday) / jobsToday) * 100 : 100;
    const averageEfficiency = totalMachines > 0 ? (activeMachines / totalMachines) * 100 : 0;
    
    return {
      activeMachines,
      totalMachines,
      jobsToday,
      qualityRate: Math.round(qualityRate * 100) / 100,
      averageEfficiency: Math.round(averageEfficiency * 100) / 100,
    };
  }
}

export const storage = new DatabaseStorage();
