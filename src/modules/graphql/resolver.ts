import { gql } from "graphql-tag";
import { nanoid } from "nanoid";
import { getDB } from "./../db";
import { eq, and } from "drizzle-orm";
import { users, workspaces, appInstances, accountAuditLogs, themes } from "../db/schema";


export const resolvers = {
    Query: {
      ping: () => "pong",
      users: async () => {
        const db = getDB();
        const results = await db.select().from(users);
        return results.map(deserializeUserData);
      },
      user: async (_, { userId }) => {
        const db = getDB();
        const user = await db.select().from(users).where(eq(users.userId, userId));
        return user.length > 0 ? deserializeUserData(user[0]) : null;
      },
      workspaces: async () => {
        const db = getDB();
        const results = await db.select().from(workspaces);
        return results.map(deserializeWorkspaceData);
      },
      workspace: async (_, { workspaceId }) => {
        const db = getDB();
        const workspace = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.workspaceId, workspaceId));
        return workspace.length > 0 ? deserializeWorkspaceData(workspace[0]) : null;
      },
      appInstances: async () => {
        const db = getDB();
        const results = await db.select().from(appInstances);
        return results.map(deserializeAppInstanceData);
      },
      appInstance: async (_, { instanceId }) => {
        const db = getDB();
        const appInstance = await db
          .select()
          .from(appInstances)
          .where(eq(appInstances.instanceId, instanceId));
        return appInstance.length > 0 ? deserializeAppInstanceData(appInstance[0]) : null;
      },
      appInstanceByAppId: async (_, { appId, workspaceId }) => {
        const db = getDB();
        const appInstance = await db
          .select()
          .from(appInstances)
          .where(
            and(
              eq(appInstances.appId, appId),
              workspaceId ? eq(appInstances.workspaceId, workspaceId) : undefined
            )
          );
        return appInstance.length > 0 ? deserializeAppInstanceData(appInstance[0]) : null;
      },
      accountAuditLogs: async () => {
        const db = getDB();
        const results = await db.select().from(accountAuditLogs);
        return results.map(deserializeAccountAuditLogData);
      },
      accountAuditLog: async (_, { auditId }) => {
        const db = getDB();
        const log = await db
          .select()
          .from(accountAuditLogs)
          .where(eq(accountAuditLogs.auditId, auditId));
        return log.length > 0 ? deserializeAccountAuditLogData(log[0]) : null;
      },
      themes: async () => {
        const db = getDB();
        return await db.select().from(themes);
      },
      theme: async (_, { themeId }) => {
        const db = getDB();
        const theme = await db
          .select()
          .from(themes)
          .where(eq(themes.themeId, themeId));
        return theme[0] || null;
      },
    },
    Mutation: {
      createUser: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const newUser = await db
          .insert(users)
          .values({
            ...serializeUserData(input),
            userId: nanoid(),
          })
          .returning();
        return newUser.length > 0 ? deserializeUserData(newUser[0]) : null;
      },
      updateUser: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const updatedUser = await db
          .update(users)
          .set(serializeUserData(input))
          .where(eq(users.userId, input.userId))
          .returning();
        return updatedUser.length > 0 ? deserializeUserData(updatedUser[0]) : null;
      },
      deleteUser: async (_, { userId }) => {
        const db = getDB();
        const deleted = await db.delete(users).where(eq(users.userId, userId));
        return deleted !== null;
      },
      createWorkspace: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const newWorkspace = await db
          .insert(workspaces)
          .values({
            ...serializeWorkspaceData(input),
            workspaceId: nanoid(),
          })
          .returning();
        return newWorkspace.length > 0 ? deserializeWorkspaceData(newWorkspace[0]) : null;
      },
      updateWorkspace: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const updatedWorkspace = await db
          .update(workspaces)
          .set(serializeWorkspaceData(input))
          .where(eq(workspaces.workspaceId, input.workspaceId))
          .returning();
        return updatedWorkspace.length > 0 ? deserializeWorkspaceData(updatedWorkspace[0]) : null;
      },
      deleteWorkspace: async (_, { workspaceId }) => {
        const db = getDB();
        const deleted = await db.delete(workspaces).where(eq(workspaces.workspaceId, workspaceId));
        return deleted !== null;
      },
      createAppInstance: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const newAppInstance = await db
          .insert(appInstances)
          .values({
            ...serializeAppInstanceData(input),
            instanceId: nanoid(),
          })
          .returning();
        return newAppInstance.length > 0 ? deserializeAppInstanceData(newAppInstance[0]) : null;
      },
      updateAppInstance: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const updatedAppInstance = await db
          .update(appInstances)
          .set(serializeAppInstanceData(input))
          .where(eq(appInstances.instanceId, input.instanceId))
          .returning();
        return updatedAppInstance.length > 0 ? deserializeAppInstanceData(updatedAppInstance[0]) : null;
      },
      deleteAppInstance: async (_, { instanceId }) => {
        const db = getDB();
        const deleted = await db.delete(appInstances).where(eq(appInstances.instanceId, instanceId));
        return deleted !== null;
      },
      createAccountAuditLog: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const newLog = await db
          .insert(accountAuditLogs)
          .values(serializeAccountAuditLogData(input))
          .returning();
        return newLog.length > 0 ? deserializeAccountAuditLogData(newLog[0]) : null;
      },
      updateAccountAuditLog: async (_, { input }) => {
        if (!input) throw new Error("Input is required");
        const db = getDB();
        const updatedLog = await db
          .update(accountAuditLogs)
          .set(serializeAccountAuditLogData(input))
          .where(eq(accountAuditLogs.auditId, input.auditId))
          .returning();
        return updatedLog.length > 0 ? deserializeAccountAuditLogData(updatedLog[0]) : null;
      },
      deleteAccountAuditLog: async (_, { auditId }) => {
        const db = getDB();
        const deleted = await db.delete(accountAuditLogs).where(eq(accountAuditLogs.auditId, auditId));
        return deleted !== null;
      },
      createTheme: async (_, { input }) => {
        const db = getDB();
        const result = await db
          .insert(themes)
          .values({
            themeId: nanoid(),
            orgId: input.orgId,
            appInstanceId: input.appInstanceId,
            theme: input.theme,
          })
          .returning();
        return result[0];
      },
      updateTheme: async (_, { input }) => {
        const db = getDB();
        const result = await db
          .update(themes)
          .set({
            theme: input.theme,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(themes.themeId, input.themeId))
          .returning();
        return result[0];
      },
      deleteTheme: async (_, { themeId }) => {
        const db = getDB();
        const deleted = await db.delete(themes).where(eq(themes.themeId, themeId)).returning();
        return deleted.length > 0;
      },
    },
    AppInstance: {
      workspace: async (parent) => {
        if (!parent.workspaceId) return null;
        const db = getDB();
        const workspace = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.workspaceId, parent.workspaceId));
        return workspace[0] ? deserializeWorkspaceData(workspace[0]) : null;
      },
      theme: async (parent) => {
        const db = getDB();
        const theme = await db
          .select()
          .from(themes)
          .where(eq(themes.appInstanceId, parent.instanceId));
        return theme[0] || null;
      },
    },
    AccountAuditLog: {
      user: async (parent) => {
        if (!parent.userId) return null;
        const db = getDB();
        const user = await db
          .select()
          .from(users)
          .where(eq(users.userId, parent.userId));
        return user[0] ? deserializeUserData(user[0]) : null;
      },
    },
  };



// Helper functions for serialization/deserialization
function serializeUserData(data) {
    return {
      ...data,
      groups: data.groups ? JSON.stringify(data.groups) : null,
      myWorkspace: data.myWorkspace ? JSON.stringify(data.myWorkspace) : null,
      workspaces: data.workspaces ? JSON.stringify(data.workspaces) : null,
      profileSettings: data.profileSettings ? JSON.stringify(data.profileSettings) : null,
    };
  }
  
  function deserializeUserData(data) {
    return {
      ...data,
      groups: data.groups ? JSON.parse(data.groups) : null,
      myWorkspace: data.myWorkspace ? JSON.parse(data.myWorkspace) : null,
      workspaces: data.workspaces ? JSON.parse(data.workspaces) : null,
      profileSettings: data.profileSettings ? JSON.parse(data.profileSettings) : null,
    };
  }
  
  function serializeWorkspaceData(data) {
    return {
      ...data,
      children: data.children ? JSON.stringify(data.children) : null,
      apps: data.apps ? JSON.stringify(data.apps) : null,
      workspaceAcl: data.workspaceAcl ? JSON.stringify(data.workspaceAcl) : null,
    };
  }
  
  function deserializeWorkspaceData(data) {
    return {
      ...data,
      children: data.children ? JSON.parse(data.children) : null,
      apps: data.apps ? JSON.parse(data.apps) : null,
      workspaceAcl: data.workspaceAcl ? JSON.parse(data.workspaceAcl) : null,
    };
  }
  
  function serializeAppInstanceData(data) {
    return {
      ...data,
      instanceMetadata: data.instanceMetadata ? JSON.stringify(data.instanceMetadata) : null,
    };
  }
  
  function deserializeAppInstanceData(data) {
    return {
      ...data,
      instanceMetadata: data.instanceMetadata ? JSON.parse(data.instanceMetadata) : null,
    };
  }
  
  function serializeAccountAuditLogData(data) {
    return {
      ...data,
      eventMetadata: data.eventMetadata ? JSON.stringify(data.eventMetadata) : null,
      oldState: data.oldState ? JSON.stringify(data.oldState) : null,
      newState: data.newState ? JSON.stringify(data.newState) : null,
    };
  }
  
  function deserializeAccountAuditLogData(data) {
    return {
      ...data,
      eventMetadata: data.eventMetadata ? JSON.parse(data.eventMetadata) : null,
      oldState: data.oldState ? JSON.parse(data.oldState) : null,
      newState: data.newState ? JSON.parse(data.newState) : null,
    };
  }