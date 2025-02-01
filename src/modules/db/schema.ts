import {
  sqliteTable,
  index,
  unique,
  text,
  integer,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable(
  "users",
  {
    userId: text("user_id").primaryKey().notNull(),
    orgId: text("org_id"),
    username: text("username"),
    email: text("email").notNull(),
    platformRole: text("platform_role"),
    orgRole: text("org_role"),
    groups: text("groups"), // JSON stored as text in SQLite
    myWorkspace: text("my_workspace"), // JSON stored as text
    workspaces: text("workspaces"), // JSON stored as text
    profileSettings: text("profile_settings"), // JSON stored as text
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_user_email").on(table.email),
    unique("users_username_key").on(table.username),
    unique("users_email_key").on(table.email),
  ]
);

export const appInstances = sqliteTable(
  "app_instances",
  {
    instanceId: text("instance_id").primaryKey().notNull(),
    appId: text("app_id"),
    workspaceId: text("workspace_id"),
    orgId: text("org_id"),
    tenantDbIdentifier: text("tenant_db_identifier"),
    instanceMetadata: text("instance_metadata").default("{}"), // JSON stored as text
    isActive: integer("is_active", { mode: "boolean" }).default(true),
    status: text("status").default("active"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_app_instances_org").on(table.orgId),
    index("idx_app_instances_workspace").on(table.workspaceId),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.workspaceId],
      name: "app_instances_workspace_id_fkey",
    }),
  ]
);

export const accountAuditLogs = sqliteTable(
  "account_audit_logs",
  {
    auditId: text("audit_id").primaryKey().notNull(),
    orgId: text("org_id"),
    userId: text("user_id"),
    eventCategory: text("event_category"),
    eventDescription: text("event_description"),
    eventMetadata: text("event_metadata"), // JSON stored as text
    clientIp: text("client_ip"), // Changed from inet to text
    userAgent: text("user_agent"),
    oldState: text("old_state"), // JSON stored as text
    newState: text("new_state"), // JSON stored as text
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    eventType: text("event_type"),
  },
  (table) => [
    index("idx_audit_logs_org").on(table.orgId),
    index("idx_audit_logs_timestamp").on(table.createdAt),
    index("idx_audit_logs_user").on(table.userId),
  ]
);

export const workspaces = sqliteTable(
  "workspaces",
  {
    workspaceId: text("workspace_id").primaryKey().notNull(),
    orgId: text("org_id"),
    name: text("name").notNull(),
    parentWorkspaceId: text("parent_workspace_id"),
    children: text("children"), // JSON stored as text
    apps: text("apps"), // JSON stored as text
    workspaceAcl: text("workspace_acl"), // JSON stored as text
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    workspaceOrder: integer("workspace_order"),
  },
  (table) => [
    index("idx_workspace_org").on(table.orgId),
    index("idx_workspaces_order").on(table.workspaceOrder),
    foreignKey({
      columns: [table.parentWorkspaceId],
      foreignColumns: [table.workspaceId],
      name: "workspaces_parent_workspace_id_fkey",
    }),
  ]
);
