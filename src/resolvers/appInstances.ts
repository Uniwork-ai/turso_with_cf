import { eq } from "drizzle-orm";
import { builder, Context } from "../builder";
import { getDB } from "../modules/db/index";
import { appInstances, workspaces } from "../modules/db/schema";
import {
  Workspace,
  workspaceRef,
  workspaceRef as WorkspaceRef,
} from "./workspaces";
import { nanoid } from "nanoid";

// Base type for AppInstance
interface AppInstanceBase {
  instanceId: string;
  appId: string;
  workspaceId: string;
  orgId: string;
  tenantDbIdentifier: string | null;
  instanceMetadata: InstanceMetadata | null;
  isActive: boolean | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  name: string | null;
}

// Input types for mutations
interface CreateAppInstanceInput {
  appId: string;
  workspaceId: string;
  orgId: string;
  tenantDbIdentifier?: string | null;
  instanceMetadata?: InstanceMetadata | null;
  isActive?: boolean | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  name?: string | null;
}

interface UpdateAppInstanceInput {
  instanceId: string;
  appId?: string | null;
  workspaceId?: string | null;
  orgId?: string | null;
  tenantDbIdentifier?: string | null;
  instanceMetadata?: InstanceMetadata | null;
  isActive?: boolean | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  name?: string | null;
}

// Resolver arg types
interface AppInstanceArgs {
  instanceId: string;
}

interface CreateAppInstanceArgs {
  input?: CreateAppInstanceInput | null;
}

interface UpdateAppInstanceArgs {
  input?: UpdateAppInstanceInput | null;
}

interface InstanceMetadata {
  name: string;
  description?: string | null;
  version: string;
  config: {
    port: number;
    logLevel: "debug" | "info" | "warn" | "error";
    maxConnections: number;
  };
}

export type AppInstance = typeof appInstances.$inferSelect;
export type CreateAppInstance = typeof appInstances.$inferInsert;

const InstanceMetadataRef =
  builder.objectRef<InstanceMetadata>("InstanceMetadata");

InstanceMetadataRef.implement({
  fields: (t) => ({
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    version: t.exposeString("version"),
    config: t.expose("config", { type: InstanceConfigRef }),
  }),
});

const InstanceConfigRef = builder.objectRef<{
  port: number;
  logLevel: "debug" | "info" | "warn" | "error";
  maxConnections: number;
}>("InstanceConfig");

InstanceConfigRef.implement({
  fields: (t) => ({
    port: t.exposeInt("port"),
    logLevel: t.exposeString("logLevel"),
    maxConnections: t.exposeInt("maxConnections"),
  }),
});

const InstanceMetadataInput = builder
  .inputRef<InstanceMetadata>("InstanceMetadataInput")
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
      description: t.string(),
      version: t.string({ required: true }),
      config: t.field({ type: InstanceConfigInput, required: true }),
    }),
  });

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}
const LogLevelRef = builder.enumType(LogLevel, {
  name: "LogLevel",
});
const InstanceConfigInput = builder
  .inputRef<{
    port: number;
    logLevel: LogLevel;
    maxConnections: number;
  }>("InstanceConfigInput")
  .implement({
    fields: (t) => ({
      port: t.int({ required: true }),
      logLevel: t.field({ type: LogLevelRef, required: true }),
      maxConnections: t.int({ required: true }),
    }),
  });

const appInstanceRef = builder.objectRef<AppInstanceBase>("AppInstance");

appInstanceRef.implement({
  fields: (t) => ({
    instanceId: t.field({ type: "ID", resolve: (p) => p.instanceId }),
    appId: t.field({ type: "ID", resolve: (p) => p.appId }),
    orgId: t.field({ type: "ID", resolve: (p) => p.orgId }),
    workspace: t.field({
      type: workspaceRef,
      resolve: async (parent) => {
        if (parent.workspaceId == null) {
          return null;
        }
        const db = getDB();
        const workspace = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.workspaceId, parent.workspaceId));
        return workspace[0];
      },
    }),
    tenantDbIdentifier: t.field({
      type: "String",
      resolve: (p) => p.tenantDbIdentifier,
    }),
    instanceMetadata: t.field({
      type: InstanceMetadataRef,
      resolve: (p) => p.instanceMetadata as InstanceMetadata,
    }),
    isActive: t.field({ type: "Boolean", resolve: (p) => p.isActive }),
    status: t.field({ type: "String", resolve: (p) => p.status }),
    createdAt: t.field({ type: "String", resolve: (p) => p.createdAt }),
    updatedAt: t.field({ type: "String", resolve: (p) => p.updatedAt }),
    name: t.field({ type: "String", resolve: (p) => p.name }),
  }),
});

const CreateAppInstanceInput = builder.inputRef<
  Omit<CreateAppInstance, "instanceId">
>("CreateAppInstanceInput");
CreateAppInstanceInput.implement({
  fields: (t) => ({
    appId: t.id({ required: true }),
    workspaceId: t.id({ required: true }),
    orgId: t.id({ required: true }),
    tenantDbIdentifier: t.string(),
    instanceMetadata: t.field({ type: InstanceMetadataInput, required: true }),
    isActive: t.boolean(),
    status: t.string(),
    createdAt: t.string(),
    updatedAt: t.string(),
    name: t.string(),
  }),
});

const UpdateAppInstanceInput = builder.inputRef<Partial<CreateAppInstance>>(
  "UpdateAppInstanceInput"
);
UpdateAppInstanceInput.implement({
  fields: (t) => ({
    instanceId: t.id({ required: true }),
    appId: t.id(),
    workspaceId: t.id(),
    orgId: t.id(),
    tenantDbIdentifier: t.string(),
    instanceMetadata: t.field({ type: InstanceMetadataInput }),
    isActive: t.boolean(),
    status: t.string(),
    createdAt: t.string(),
    updatedAt: t.string(),
    name: t.string(),
  }),
});

builder.queryFields((t) => ({
  appInstances: t.field({
    type: [appInstanceRef],
    resolve: getAppInstances,
  }),
  appInstance: t.field({
    type: appInstanceRef,
    args: {
      instanceId: t.arg.id({ required: true }),
    },
    resolve: getAppInstance,
  }),
}));

builder.mutationFields((t) => ({
  createAppInstance: t.field({
    type: appInstanceRef,
    args: {
      input: t.arg({ type: CreateAppInstanceInput }),
    },
    resolve: createAppInstance,
  }),
  updateAppInstance: t.field({
    type: appInstanceRef,
    args: {
      input: t.arg({ type: UpdateAppInstanceInput }),
    },
    resolve: updateAppInstance,
  }),
  deleteAppInstance: t.field({
    type: "Boolean",
    args: {
      instanceId: t.arg.id({ required: true }),
    },
    resolve: deleteAppInstance,
  }),
}));

const getAppInstances = async (_root: any, _args: any, ctx: Context) => {
  const db = getDB();
  const results = await db.select().from(appInstances);
  return results.map(deserializeAppInstanceData);
};

const getAppInstance = async (
  _root: any,
  args: AppInstanceArgs,
  ctx: Context
) => {
  const db = getDB();
  const appInstance = await db
    .select()
    .from(appInstances)
    .where(eq(appInstances.instanceId, args.instanceId));
  return appInstance.length > 0
    ? deserializeAppInstanceData(appInstance[0])
    : null;
};

const createAppInstance = async (
  _root: any,
  args: CreateAppInstanceArgs,
  ctx: Context
) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const newAppInstance = await db
    .insert(appInstances)
    .values({
      ...serializeAppInstanceData(args.input),
      instanceId: nanoid(),
    })
    .returning();
  return newAppInstance.length > 0
    ? deserializeAppInstanceData(newAppInstance[0])
    : null;
};

const updateAppInstance = async (
  _root: any,
  args: UpdateAppInstanceArgs,
  ctx: Context
) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const updatedAppInstance = await db
    .update(appInstances)
    .set(serializeAppInstanceData(args.input))
    .where(eq(appInstances.instanceId, args.input.instanceId))
    .returning();
  return updatedAppInstance.length > 0
    ? deserializeAppInstanceData(updatedAppInstance[0])
    : null;
};

const deleteAppInstance = async (
  _root: any,
  args: AppInstanceArgs,
  ctx: Context
) => {
  const db = getDB();
  const deleted = await db
    .delete(appInstances)
    .where(eq(appInstances.instanceId, args.instanceId));
  return deleted !== null;
};

const serializeAppInstanceData = (data: any): any => ({
  ...data,
  instanceMetadata: data.instanceMetadata
    ? JSON.stringify(data.instanceMetadata)
    : null,
});

const deserializeAppInstanceData = (data: any): any => ({
  ...data,
  instanceMetadata: data.instanceMetadata
    ? JSON.parse(data.instanceMetadata)
    : null,
});
