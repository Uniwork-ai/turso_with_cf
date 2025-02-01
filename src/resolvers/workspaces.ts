import { eq } from "drizzle-orm";
import { builder, Context } from "../builder";
import { getDB } from "../modules/db/index";
import { workspaces } from "../modules/db/schema";
import { nanoid } from "nanoid";

// Define base types for workspace
interface WorkspaceBase {
  workspaceId: string;
  orgId: string;
  name: string;
  parentWorkspaceId: string | null;
  children: WorkspaceChildren | null;
  apps: WorkspaceApps | null;
  workspaceAcl: WorkspaceAcl | null;
  createdAt: string | null;
  updatedAt: string | null;
  workspaceOrder: number | null;
}

// Input types for mutations
interface CreateWorkspaceInput {
  orgId: string;
  name: string;
  workspaceAcl: WorkspaceAcl;
  parentWorkspaceId?: string | null;
  children?: WorkspaceChildren | null;
  apps?: WorkspaceApps | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  workspaceOrder?: number | null;
}

interface UpdateWorkspaceInput {
  workspaceId: string;
  orgId?: string | null;
  name?: string | null;
  parentWorkspaceId?: string | null;
  children?: WorkspaceChildren | null;
  apps?: WorkspaceApps | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  workspaceOrder?: number | null;
}

// Resolver arg types
interface WorkspaceArgs {
  workspaceId: string;
}

interface CreateWorkspaceArgs {
  input?: CreateWorkspaceInput | null;
}

interface UpdateWorkspaceArgs {
  input?: UpdateWorkspaceInput | null;
}

export interface WorkspaceChildren {
  workspaceIds: string[];
}

export interface WorkspaceApps {
  appIds: string[];
}

export interface WorkspaceAcl {
  roles: { [userId: string]: string[] };
}

export type Workspace = typeof workspaces.$inferSelect;
export type CreateWorkspace = typeof workspaces.$inferInsert;

const WorkspaceChildrenRef =
  builder.objectRef<WorkspaceChildren>("WorkspaceChildren");
WorkspaceChildrenRef.implement({
  fields: (t) => ({
    workspaceIds: t.exposeStringList("workspaceIds"),
  }),
});

const WorkspaceAppsRef = builder.objectRef<WorkspaceApps>("WorkspaceApps");
WorkspaceAppsRef.implement({
  fields: (t) => ({
    appIds: t.exposeStringList("appIds"),
  }),
});

const WorkspaceAclRef = builder.objectRef<WorkspaceAcl>("WorkspaceAcl");
type Role = { [userId: string]: string[] };
const RoleRef = builder.objectRef<Role>("Role");
WorkspaceAclRef.implement({
  fields: (t) => ({
    roles: t.field({
      type: RoleRef,
      resolve: (parent) => parent.roles,
    }),
  }),
});

const Role = RoleRef.implement({
  fields: (t) => ({
    userId: t.exposeStringList("userId"),
  }),
});

export const workspaceRef = builder.objectRef<WorkspaceBase>("Workspace");

workspaceRef.implement({
  //   interfaces: () => [BaseType],
  fields: (t) => ({
    workspaceId: t.field({ type: "ID", resolve: (p) => p.workspaceId }),
    orgId: t.field({ type: "ID", resolve: (p) => p.orgId }),
    // org: t.field({
    //   type: OrganizationRef,
    //   resolve: async (parent, _args, ctx) => {
    //     if (parent.orgId == null) {
    //       return null;
    //     }
    //     const db = getDB();
    //     const org = await db
    //       .select()
    //       .from(organizations)
    //       .where(eq(organizations.orgId, parent.orgId));
    //     return org[0];
    //   },
    // }),
    name: t.field({ type: "String", resolve: (p) => p.name }),
    parentWorkspaceId: t.field({
      type: "ID",
      resolve: (p) => p.parentWorkspaceId,
    }),
    children: t.field({
      type: WorkspaceChildrenRef,
      resolve: (p) => p.children || null,
    }),
    apps: t.field({ type: WorkspaceAppsRef, resolve: (p) => p.apps || null }),
    workspaceAcl: t.field({
      type: WorkspaceAclRef,
      resolve: (p) => p.workspaceAcl || null,
    }),
    createdAt: t.field({ type: "String", resolve: (p) => p.createdAt }),
    updatedAt: t.field({ type: "String", resolve: (p) => p.updatedAt }),
    workspaceOrder: t.field({ type: "Int", resolve: (p) => p.workspaceOrder }),
  }),
});

const CreateWorkspaceInput = builder.inputRef<CreateWorkspaceInput>(
  "CreateWorkspaceInput"
);
CreateWorkspaceInput.implement({
  fields: (t) => ({
    orgId: t.id({ required: true }),
    name: t.string({ required: true }),
    parentWorkspaceId: t.id(),
    children: t.field({ type: WorkspaceChildrenInput }),
    apps: t.field({ type: WorkspaceAppsInput }),
    workspaceAcl: t.field({ type: WorkspaceAclInput, required: true }),
    createdAt: t.string(),
    updatedAt: t.string(),
    workspaceOrder: t.int(),
  }),
});

const WorkspaceChildrenInput = builder
  .inputRef<WorkspaceChildren>("WorkspaceChildrenInput")
  .implement({
    fields: (t) => ({
      workspaceIds: t.stringList({ required: true }),
    }),
  });

const WorkspaceAppsInput = builder
  .inputRef<WorkspaceApps>("WorkspaceAppsInput")
  .implement({
    fields: (t) => ({
      appIds: t.stringList({ required: true }),
    }),
  });

const WorkspaceAclInput = builder
  .inputRef<WorkspaceAcl>("WorkspaceAclInput")
  .implement({
    fields: (t) => ({
      roles: t.field({ type: RoleInput, required: true }),
    }),
  });

const RoleInput = builder.inputRef<Role>("RoleInput").implement({
  fields: (t) => ({
    userId: t.stringList({ required: true }),
  }),
});

const UpdateWorkspaceInput = builder.inputRef<UpdateWorkspaceInput>(
  "UpdateWorkspaceInput"
);
UpdateWorkspaceInput.implement({
  fields: (t) => ({
    workspaceId: t.id({ required: true }),
    orgId: t.id(),
    name: t.string(),
    parentWorkspaceId: t.id(),
    children: t.field({ type: WorkspaceChildrenInput }),
    apps: t.field({ type: WorkspaceAppsInput }),
    workspaceAcl: t.field({ type: WorkspaceAclInput }),
    createdAt: t.string(),
    updatedAt: t.string(),
    workspaceOrder: t.int(),
  }),
});

builder.queryFields((t) => ({
  workspaces: t.field({
    type: [workspaceRef],
    resolve: getWorkspaces,
  }),
  workspace: t.field({
    type: workspaceRef,
    args: {
      workspaceId: t.arg.id({ required: true }),
    },
    resolve: getWorkspace,
  }),
}));

builder.mutationFields((t) => ({
  createWorkspace: t.field({
    type: workspaceRef,
    args: {
      input: t.arg({ type: CreateWorkspaceInput }),
    },
    resolve: createWorkspace,
  }),
  updateWorkspace: t.field({
    type: workspaceRef,
    args: {
      input: t.arg({ type: UpdateWorkspaceInput }),
    },
    resolve: updateWorkspace,
  }),
  deleteWorkspace: t.field({
    type: "Boolean",
    args: {
      workspaceId: t.arg.id({ required: true }),
    },
    resolve: deleteWorkspace,
  }),
}));

const getWorkspaces = async (_root: any, _args: any, ctx: Context) => {
  const db = getDB();
  const results = await db.select().from(workspaces);
  return results.map(deserializeWorkspaceData);
};

const getWorkspace = async (_root: any, args: WorkspaceArgs, ctx: Context) => {
  const db = getDB();
  const workspace = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.workspaceId, args.workspaceId));
  return workspace.length > 0 ? deserializeWorkspaceData(workspace[0]) : null;
};

const createWorkspace = async (
  _root: any,
  args: CreateWorkspaceArgs,
  ctx: Context
) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const newWorkspace = await db
    .insert(workspaces)
    .values({
      ...serializeWorkspaceData(args.input),
      workspaceId: nanoid(),
    })
    .returning();
  return newWorkspace.length > 0
    ? deserializeWorkspaceData(newWorkspace[0])
    : null;
};

const updateWorkspace = async (
  _root: any,
  args: UpdateWorkspaceArgs,
  ctx: Context
) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const updatedWorkspace = await db
    .update(workspaces)
    .set(serializeWorkspaceData(args.input))
    .where(eq(workspaces.workspaceId, args.input.workspaceId))
    .returning();
  return updatedWorkspace.length > 0
    ? deserializeWorkspaceData(updatedWorkspace[0])
    : null;
};

const deleteWorkspace = async (
  _root: any,
  args: WorkspaceArgs,
  ctx: Context
) => {
  const db = getDB();
  const deleted = await db
    .delete(workspaces)
    .where(eq(workspaces.workspaceId, args.workspaceId));
  return deleted !== null;
};

const serializeWorkspaceData = (data: any): any => ({
  ...data,
  children: data.children ? JSON.stringify(data.children) : null,
  apps: data.apps ? JSON.stringify(data.apps) : null,
  workspaceAcl: data.workspaceAcl ? JSON.stringify(data.workspaceAcl) : null,
});

const deserializeWorkspaceData = (data: any): any => ({
  ...data,
  children: data.children ? JSON.parse(data.children) : null,
  apps: data.apps ? JSON.parse(data.apps) : null,
  workspaceAcl: data.workspaceAcl ? JSON.parse(data.workspaceAcl) : null,
});
