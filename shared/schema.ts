import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default('operator'), // operator, supervisor, owner
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Machine status enum
export const machineStatusEnum = pgEnum('machine_status', ['running', 'idle', 'offline', 'maintenance']);
export const jobStatusEnum = pgEnum('job_status', ['queued', 'in_progress', 'completed', 'cancelled']);
export const defectSeverityEnum = pgEnum('defect_severity', ['low', 'medium', 'high', 'critical']);
export const alertTypeEnum = pgEnum('alert_type', ['temperature', 'maintenance', 'offline', 'defect']);

// Machines table
export const machines = pgTable("machines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  status: machineStatusEnum("status").notNull().default('offline'),
  currentOperatorId: varchar("current_operator_id"),
  currentJobId: varchar("current_job_id"),
  temperature: integer("temperature").default(0),
  vibration: decimal("vibration", { precision: 5, scale: 2 }).default('0'),
  usage: decimal("usage", { precision: 5, scale: 2 }).default('0'),
  rpm: integer("rpm").default(0),
  power: decimal("power", { precision: 6, scale: 2 }).default('0'),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  totalRunningHours: integer("total_running_hours").default(0),
  lastDataUpdate: timestamp("last_data_update").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobNumber: varchar("job_number").notNull().unique(),
  description: text("description").notNull(),
  machineId: varchar("machine_id").notNull(),
  operatorId: varchar("operator_id").notNull(),
  status: jobStatusEnum("status").notNull().default('queued'),
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDuration: integer("actual_duration"), // in minutes
  progress: integer("progress").default(0), // 0-100
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Defects/Quality issues table
export const defects = pgTable("defects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(),
  severity: defectSeverityEnum("severity").notNull(),
  description: text("description").notNull(),
  jobId: varchar("job_id"),
  machineId: varchar("machine_id").notNull(),
  reportedById: varchar("reported_by_id").notNull(),
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: alertTypeEnum("type").notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  machineId: varchar("machine_id"),
  severity: defectSeverityEnum("severity").notNull(),
  dismissed: boolean("dismissed").default(false),
  dismissedAt: timestamp("dismissed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shift reports table
export const shiftReports = pgTable("shift_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shiftDate: timestamp("shift_date").notNull(),
  totalJobs: integer("total_jobs").default(0),
  completedJobs: integer("completed_jobs").default(0),
  totalDowntime: integer("total_downtime").default(0), // in minutes
  averageEfficiency: decimal("average_efficiency", { precision: 5, scale: 2 }),
  qualityRate: decimal("quality_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const machinesRelations = relations(machines, ({ one, many }) => ({
  currentOperator: one(users, {
    fields: [machines.currentOperatorId],
    references: [users.id],
  }),
  currentJob: one(jobs, {
    fields: [machines.currentJobId],
    references: [jobs.id],
  }),
  jobs: many(jobs),
  defects: many(defects),
  alerts: many(alerts),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  machine: one(machines, {
    fields: [jobs.machineId],
    references: [machines.id],
  }),
  operator: one(users, {
    fields: [jobs.operatorId],
    references: [users.id],
  }),
}));

export const defectsRelations = relations(defects, ({ one }) => ({
  job: one(jobs, {
    fields: [defects.jobId],
    references: [jobs.id],
  }),
  machine: one(machines, {
    fields: [defects.machineId],
    references: [machines.id],
  }),
  reportedBy: one(users, {
    fields: [defects.reportedById],
    references: [users.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  machine: one(machines, {
    fields: [alerts.machineId],
    references: [machines.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMachineSchema = createInsertSchema(machines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDefectSchema = createInsertSchema(defects).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Machine = typeof machines.$inferSelect;
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Defect = typeof defects.$inferSelect;
export type InsertDefect = z.infer<typeof insertDefectSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type ShiftReport = typeof shiftReports.$inferSelect;
