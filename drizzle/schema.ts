import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  date,
  index,
  foreignKey,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Supports both property owners (admin) and tenants (user).
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 20 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => [index("idx_openId").on(table.openId)]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Properties (apartments/quitinetes) managed by owners
 */
export const properties = mysqlTable(
  "properties",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerId: int("ownerId").notNull(),
    number: varchar("number", { length: 50 }).notNull(),
    type: mysqlEnum("type", ["apartment", "quitinete", "commercial"]).notNull(),
    bedrooms: int("bedrooms").default(0),
    bathrooms: int("bathrooms").default(0),
    area: decimal("area", { precision: 8, scale: 2 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 2 }),
    zipCode: varchar("zipCode", { length: 10 }),
    status: mysqlEnum("status", ["vacant", "occupied", "maintenance"]).default("vacant").notNull(),
    monthlyRent: decimal("monthlyRent", { precision: 10, scale: 2 }).notNull(),
    imageUrl: text("imageUrl"),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_ownerId").on(table.ownerId),
  ]
);

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

/**
 * Tenants (locatários) living in properties
 */
export const tenants = mysqlTable(
  "tenants",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    ownerId: int("ownerId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 20 }),
    cpf: varchar("cpf", { length: 20 }),
    status: mysqlEnum("status", ["active", "inactive", "evicted"]).default("active").notNull(),
    inadimplencyScore: int("inadimplencyScore").default(0), // 0-100
    totalDebt: decimal("totalDebt", { precision: 12, scale: 2 }).default("0"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_ownerId").on(table.ownerId),
    index("idx_userId").on(table.userId),
  ]
);

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = typeof tenants.$inferInsert;

/**
 * Rental contracts linking tenants to properties
 */
export const contracts = mysqlTable(
  "contracts",
  {
    id: int("id").autoincrement().primaryKey(),
    propertyId: int("propertyId").notNull(),
    tenantId: int("tenantId").notNull(),
    ownerId: int("ownerId").notNull(),
    startDate: date("startDate").notNull(),
    endDate: date("endDate"),
    monthlyRent: decimal("monthlyRent", { precision: 10, scale: 2 }).notNull(),
    depositAmount: decimal("depositAmount", { precision: 10, scale: 2 }),
    status: mysqlEnum("status", ["active", "terminated", "expired"]).default("active").notNull(),
    terminationReason: text("terminationReason"),
    terminationDate: date("terminationDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.propertyId], foreignColumns: [properties.id] }),
    foreignKey({ columns: [table.tenantId], foreignColumns: [tenants.id] }),
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_propertyId").on(table.propertyId),
    index("idx_tenantId").on(table.tenantId),
    index("idx_ownerId").on(table.ownerId),
  ]
);

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

/**
 * Monthly competencies (competências mensais) generated from contracts
 */
export const competencies = mysqlTable(
  "competencies",
  {
    id: int("id").autoincrement().primaryKey(),
    contractId: int("contractId").notNull(),
    tenantId: int("tenantId").notNull(),
    propertyId: int("propertyId").notNull(),
    ownerId: int("ownerId").notNull(),
    month: date("month").notNull(), // First day of month
    rentAmount: decimal("rentAmount", { precision: 10, scale: 2 }).notNull(),
    fineAmount: decimal("fineAmount", { precision: 10, scale: 2 }).default("0"),
    interestAmount: decimal("interestAmount", { precision: 10, scale: 2 }).default("0"),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum("status", ["pending", "paid", "partial", "overdue"]).default("pending").notNull(),
    dueDate: date("dueDate").notNull(),
    paidDate: date("paidDate"),
    paidAmount: decimal("paidAmount", { precision: 10, scale: 2 }).default("0"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.contractId], foreignColumns: [contracts.id] }),
    foreignKey({ columns: [table.tenantId], foreignColumns: [tenants.id] }),
    foreignKey({ columns: [table.propertyId], foreignColumns: [properties.id] }),
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_tenantId").on(table.tenantId),
    index("idx_propertyId").on(table.propertyId),
    index("idx_month").on(table.month),
    index("idx_status").on(table.status),
  ]
);

export type Competency = typeof competencies.$inferSelect;
export type InsertCompetency = typeof competencies.$inferInsert;

/**
 * Payment records for competencies
 */
export const payments = mysqlTable(
  "payments",
  {
    id: int("id").autoincrement().primaryKey(),
    competencyId: int("competencyId").notNull(),
    tenantId: int("tenantId").notNull(),
    propertyId: int("propertyId").notNull(),
    ownerId: int("ownerId").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: mysqlEnum("paymentMethod", ["cash", "transfer", "pix", "check", "other"]).notNull(),
    paymentDate: date("paymentDate").notNull(),
    receiptUrl: text("receiptUrl"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.competencyId], foreignColumns: [competencies.id] }),
    foreignKey({ columns: [table.tenantId], foreignColumns: [tenants.id] }),
    foreignKey({ columns: [table.propertyId], foreignColumns: [properties.id] }),
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_tenantId").on(table.tenantId),
    index("idx_paymentDate").on(table.paymentDate),
  ]
);

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Collection messages sent to tenants (WhatsApp, email, SMS)
 */
export const collectionMessages = mysqlTable(
  "collectionMessages",
  {
    id: int("id").autoincrement().primaryKey(),
    competencyId: int("competencyId").notNull(),
    tenantId: int("tenantId").notNull(),
    ownerId: int("ownerId").notNull(),
    messageType: mysqlEnum("messageType", [
      "pre_due",
      "due_notice",
      "friendly",
      "formal",
      "rescission",
    ]).notNull(),
    channel: mysqlEnum("channel", ["whatsapp", "email", "sms"]).default("whatsapp").notNull(),
    content: text("content").notNull(),
    status: mysqlEnum("status", ["draft", "sent", "failed"]).default("draft").notNull(),
    sentAt: timestamp("sentAt"),
    failureReason: text("failureReason"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.competencyId], foreignColumns: [competencies.id] }),
    foreignKey({ columns: [table.tenantId], foreignColumns: [tenants.id] }),
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_tenantId").on(table.tenantId),
    index("idx_messageType").on(table.messageType),
  ]
);

export type CollectionMessage = typeof collectionMessages.$inferSelect;
export type InsertCollectionMessage = typeof collectionMessages.$inferInsert;

/**
 * Maintenance tickets for property repairs and issues
 */
export const maintenanceTickets = mysqlTable(
  "maintenanceTickets",
  {
    id: int("id").autoincrement().primaryKey(),
    propertyId: int("propertyId").notNull(),
    tenantId: int("tenantId"),
    ownerId: int("ownerId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
    status: mysqlEnum("status", ["open", "in_progress", "completed", "cancelled"]).default("open").notNull(),
    category: varchar("category", { length: 100 }),
    estimatedCost: decimal("estimatedCost", { precision: 10, scale: 2 }),
    actualCost: decimal("actualCost", { precision: 10, scale: 2 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.propertyId], foreignColumns: [properties.id] }),
    foreignKey({ columns: [table.tenantId], foreignColumns: [tenants.id] }),
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_propertyId").on(table.propertyId),
    index("idx_status").on(table.status),
  ]
);

export type MaintenanceTicket = typeof maintenanceTickets.$inferSelect;
export type InsertMaintenanceTicket = typeof maintenanceTickets.$inferInsert;

/**
 * Portal/Site configuration for public content
 */
export const portalConfig = mysqlTable(
  "portalConfig",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerId: int("ownerId").notNull().unique(),
    heroTitle: text("heroTitle"),
    heroSubtitle: text("heroSubtitle"),
    whatsappPhone: varchar("whatsappPhone", { length: 20 }),
    showServices: boolean("showServices").default(true),
    showBanners: boolean("showBanners").default(true),
    showMap: boolean("showMap").default(true),
    marketplaceActive: boolean("marketplaceActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_ownerId").on(table.ownerId),
  ]
);

export type PortalConfig = typeof portalConfig.$inferSelect;
export type InsertPortalConfig = typeof portalConfig.$inferInsert;

/**
 * Community feed posts (for landing page)
 */
export const communityPosts = mysqlTable(
  "communityPosts",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerId: int("ownerId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    imageUrl: text("imageUrl"),
    category: varchar("category", { length: 100 }),
    status: mysqlEnum("status", ["published", "draft", "archived"]).default("published").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_ownerId").on(table.ownerId),
    index("idx_status").on(table.status),
  ]
);

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

/**
 * Marketplace services (plumbers, electricians, etc.)
 */
export const marketplaceServices = mysqlTable(
  "marketplaceServices",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerId: int("ownerId").notNull(),
    providerName: varchar("providerName", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 320 }),
    imageUrl: text("imageUrl"),
    rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
    status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_ownerId").on(table.ownerId),
    index("idx_category").on(table.category),
  ]
);

export type MarketplaceService = typeof marketplaceServices.$inferSelect;
export type InsertMarketplaceService = typeof marketplaceServices.$inferInsert;

/**
 * Audit logs for critical operations
 */
export const auditLogs = mysqlTable(
  "auditLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entityType", { length: 100 }).notNull(),
    entityId: int("entityId"),
    changes: text("changes"), // JSON string
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    hash: varchar("hash", { length: 64 }), // SHA256 for integrity
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
    index("idx_userId").on(table.userId),
    index("idx_action").on(table.action),
    index("idx_createdAt").on(table.createdAt),
  ]
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Annual IRPF consolidation for tax reporting
 */
export const irpfConsolidation = mysqlTable(
  "irpfConsolidation",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerId: int("ownerId").notNull(),
    year: int("year").notNull(),
    totalRentReceived: decimal("totalRentReceived", { precision: 12, scale: 2 }).default("0"),
    totalExpenses: decimal("totalExpenses", { precision: 12, scale: 2 }).default("0"),
    totalTaxable: decimal("totalTaxable", { precision: 12, scale: 2 }).default("0"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.ownerId], foreignColumns: [users.id] }),
    index("idx_ownerId").on(table.ownerId),
    index("idx_year").on(table.year),
  ]
);

export type IRPFConsolidation = typeof irpfConsolidation.$inferSelect;
export type InsertIRPFConsolidation = typeof irpfConsolidation.$inferInsert;
