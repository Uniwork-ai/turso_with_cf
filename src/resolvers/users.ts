import { eq } from "drizzle-orm";
import { builder, Context } from "../builder";
import { getDB } from "../modules/db/index";
import { users } from "../modules/db/schema";
import { nanoid } from "nanoid";

// Base type for User
interface UserBase {
  userId: string;
  orgId: string;
  username: string | null;
  email: string;
  platformRole: string | null;
  orgRole: string | null;
  groups: UserGroups | null;
  myWorkspace: UserMyWorkspace | null;
  workspaces: UserWorkspaces | null;
  profileSettings: UserProfileSettings | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Input types for mutations
interface CreateUserInput {
  orgId: string;
  username: string;
  email: string;
  platformRole?: string | null;
  orgRole?: string | null;
  groups?: UserGroups | null;
  myWorkspace?: UserMyWorkspace | null;
  workspaces?: UserWorkspaces | null;
  profileSettings?: UserProfileSettings | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface UpdateUserInput {
  userId: string;
  orgId?: string | null;
  username?: string | null;
  email?: string | null;
  platformRole?: string | null;
  orgRole?: string | null;
  groups?: UserGroups | null;
  myWorkspace?: UserMyWorkspace | null;
  workspaces?: UserWorkspaces | null;
  profileSettings?: UserProfileSettings | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Resolver arg types
interface UserArgs {
  userId: string;
}

interface CreateUserArgs {
  input?: CreateUserInput | null;
}

interface UpdateUserArgs {
  input?: UpdateUserInput | null;
}

// Keep existing interface definitions
interface UserProfileSettings {
  theme?: string | null;
  notifications?: boolean | null;
}

interface UserGroups {
  groupIds: string[];
}

interface UserMyWorkspace {
  workspaceId: string;
}

interface UserWorkspaces {
  workspaceIds: string[];
}

export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;

const UserProfileSettingsRef = builder.objectRef<UserProfileSettings>(
  "UserProfileSettings"
);
UserProfileSettingsRef.implement({
  fields: (t) => ({
    theme: t.exposeString("theme", { nullable: true }),
    notifications: t.exposeBoolean("notifications", { nullable: true }),
    // Add other fields as needed
  }),
});

const UserGroupsRef = builder.objectRef<UserGroups>("UserGroups");
UserGroupsRef.implement({
  fields: (t) => ({
    groupIds: t.exposeStringList("groupIds", { nullable: true }),
    // Add other fields as needed
  }),
});

const UserMyWorkspaceRef =
  builder.objectRef<UserMyWorkspace>("UserMyWorkspace");
UserMyWorkspaceRef.implement({
  fields: (t) => ({
    workspaceId: t.exposeString("workspaceId", { nullable: true }),
    // Add other fields as needed
  }),
});

const UserWorkspacesRef = builder.objectRef<UserWorkspaces>("UserWorkspaces");
UserWorkspacesRef.implement({
  fields: (t) => ({
    workspaceIds: t.exposeStringList("workspaceIds", { nullable: true }),
    // Add other fields as needed
  }),
});

export const userRef = builder.objectRef<UserBase>("User");

userRef.implement({
  fields: (t) => ({
    userId: t.field({ type: "ID", resolve: (p) => p.userId }),
    // org: t.field({
    //   type: OrganizationRef,
    //   resolve: async (parent, _args, ctx) => {
    //     if (parent.orgId == null) {
    //       return null;
    //     }
    //     const db = getDB(ctx);
    //     const org = await db
    //       .select()
    //       .from(organizations)
    //       .where(eq(organizations.orgId, parent.orgId));
    //     return org[0];
    //   },
    // }),
    username: t.field({ type: "String", resolve: (p) => p.username }),
    email: t.field({ type: "String", resolve: (p) => p.email }),
    platformRole: t.field({ type: "String", resolve: (p) => p.platformRole }),
    orgRole: t.field({ type: "String", resolve: (p) => p.orgRole }),
    groups: t.field({ type: UserGroupsRef, resolve: (p) => p.groups }),
    myWorkspace: t.field({
      type: UserMyWorkspaceRef,
      resolve: (p) => p.myWorkspace,
    }),
    workspaces: t.field({
      type: UserWorkspacesRef,
      resolve: (p) => p.workspaces,
    }),
    profileSettings: t.field({
      type: UserProfileSettingsRef,
      resolve: (p) => p.profileSettings,
    }),
    createdAt: t.field({ type: "String", resolve: (p) => p.createdAt }),
    updatedAt: t.field({ type: "String", resolve: (p) => p.updatedAt }),
  }),
});

const CreateUserInput = builder.inputRef<CreateUserInput>("CreateUserInput");
CreateUserInput.implement({
  fields: (t) => ({
    orgId: t.id({ required: true }),
    username: t.string({ required: true }),
    email: t.string({ required: true }),
    platformRole: t.string(),
    orgRole: t.string(),
    groups: t.field({ type: UserGroupsInput }),
    myWorkspace: t.field({ type: UserMyWorkspaceInput }),
    workspaces: t.field({ type: UserWorkspacesInput }),
    profileSettings: t.field({
      type: UserProfileSettingsInput,
    }),
    createdAt: t.string(),
    updatedAt: t.string(),
  }),
});

const UserProfileSettingsInput = builder
  .inputRef<UserProfileSettings>("UserProfileSettingsInput")
  .implement({
    fields: (t) => ({
      theme: t.string(),
      notifications: t.boolean(),
      // Add other input fields as needed
    }),
  });

const UserGroupsInput = builder
  .inputRef<UserGroups>("UserGroupsInput")
  .implement({
    fields: (t) => ({
      groupIds: t.stringList({ required: true }),
      // Add other input fields as needed
    }),
  });

const UserMyWorkspaceInput = builder
  .inputRef<UserMyWorkspace>("UserMyWorkspaceInput")
  .implement({
    fields: (t) => ({
      workspaceId: t.string({ required: true }),
      // Add other input fields as needed
    }),
  });

const UserWorkspacesInput = builder
  .inputRef<UserWorkspaces>("UserWorkspacesInput")
  .implement({
    fields: (t) => ({
      workspaceIds: t.stringList({ required: true }),
      // Add other input fields as needed
    }),
  });

const UpdateUserInput = builder.inputRef<UpdateUserInput>("UpdateUserInput");
UpdateUserInput.implement({
  fields: (t) => ({
    userId: t.id({ required: true }),
    orgId: t.id(),
    username: t.string(),
    email: t.string(),
    platformRole: t.string(),
    orgRole: t.string(),
    groups: t.field({ type: UserGroupsInput }),
    myWorkspace: t.field({ type: UserMyWorkspaceInput }),
    workspaces: t.field({ type: UserWorkspacesInput }),
    profileSettings: t.field({ type: UserProfileSettingsInput }),
    createdAt: t.string(),
    updatedAt: t.string(),
  }),
});

builder.queryFields((t) => ({
  users: t.field({
    type: [userRef],
    resolve: getUsers,
  }),
  user: t.field({
    type: userRef,
    args: {
      userId: t.arg.id({ required: true }),
    },
    resolve: getUser,
  }),
}));

builder.mutationFields((t) => ({
  createUser: t.field({
    type: userRef,
    args: {
      input: t.arg({ type: CreateUserInput }),
    },
    resolve: createUser,
  }),
  updateUser: t.field({
    type: userRef,
    args: {
      input: t.arg({ type: UpdateUserInput }),
    },
    resolve: updateUser,
  }),
  deleteUser: t.field({
    type: "Boolean",
    args: {
      userId: t.arg.id({ required: true }),
    },
    resolve: deleteUser,
  }),
}));

const getUsers = async (_root: any, _args: any, ctx: Context) => {
  const db = getDB();
  const results = await db.select().from(users);
  return results.map(deserializeUserData);
};

const getUser = async (_root: any, args: UserArgs, ctx: Context) => {
  const db = getDB();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.userId, args.userId));
  return user.length > 0 ? deserializeUserData(user[0]) : null;
};

const createUser = async (_root: any, args: CreateUserArgs, ctx: Context) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const newUser = await db
    .insert(users)
    .values({
      ...serializeUserData(args.input),
      userId: nanoid(),
    })
    .returning();
  return newUser.length > 0 ? deserializeUserData(newUser[0]) : null;
};

const updateUser = async (_root: any, args: UpdateUserArgs, ctx: Context) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const updatedUser = await db
    .update(users)
    .set(serializeUserData(args.input))
    .where(eq(users.userId, args.input.userId))
    .returning();
  return updatedUser.length > 0 ? deserializeUserData(updatedUser[0]) : null;
};

const deleteUser = async (_root: any, args: UserArgs, ctx: Context) => {
  const db = getDB();
  const deleted = await db.delete(users).where(eq(users.userId, args.userId));
  return deleted !== null;
};

const serializeUserData = (data: any): any => ({
  ...data,
  groups: data.groups ? JSON.stringify(data.groups) : null,
  myWorkspace: data.myWorkspace ? JSON.stringify(data.myWorkspace) : null,
  workspaces: data.workspaces ? JSON.stringify(data.workspaces) : null,
  profileSettings: data.profileSettings
    ? JSON.stringify(data.profileSettings)
    : null,
});

const deserializeUserData = (data: any): any => ({
  ...data,
  groups: data.groups ? JSON.parse(data.groups) : null,
  myWorkspace: data.myWorkspace ? JSON.parse(data.myWorkspace) : null,
  workspaces: data.workspaces ? JSON.parse(data.workspaces) : null,
  profileSettings: data.profileSettings
    ? JSON.parse(data.profileSettings)
    : null,
});
