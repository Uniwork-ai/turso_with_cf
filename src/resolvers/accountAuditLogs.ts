import { eq } from "drizzle-orm";
import { builder, Context } from "../builder";
import { getDB } from "../modules/db/index";
import { accountAuditLogs, users } from "../modules/db/schema";
import { User, userRef } from "./users"; // Assuming you have a User resolver

// Define interfaces for nested JSONB fields if needed. Examples:
interface EventMetadata {
  sessionId: string;
  userAgent: string;
}

interface OldState {
  [key: string]: any; // Replace with a more specific type if known
}

interface NewState {
  [key: string]: any; // Replace with a more specific type if known
}

// Base type for AccountAuditLog
interface AccountAuditLogBase {
  auditId: string;
  orgId: string;
  userId: string;
  eventCategory: string;
  eventDescription: string;
  eventMetadata: EventMetadata | null;
  clientIp: string;
  userAgent: string;
  oldState: OldState | null;
  newState: NewState | null;
  createdAt: string | null;
  eventType: string;
}

// Input types for mutations
interface CreateAccountAuditLogInput {
  orgId: string;
  userId: string;
  eventCategory: string;
  eventDescription: string;
  eventMetadata: EventMetadata;
  clientIp: string;
  userAgent: string;
  oldState: OldState;
  newState: NewState;
  createdAt?: string | null;
  eventType: string;
}

interface UpdateAccountAuditLogInput {
  auditId: string;
  orgId?: string | null;
  userId?: string | null;
  eventCategory?: string | null;
  eventDescription?: string | null;
  eventMetadata?: EventMetadata | null;
  clientIp?: string | null;
  userAgent?: string | null;
  oldState?: OldState | null;
  newState?: NewState | null;
  createdAt?: string | null;
  eventType?: string | null;
}

// Resolver arg types
interface AccountAuditLogArgs {
  auditId: string;
}

interface CreateAccountAuditLogArgs {
  input?: CreateAccountAuditLogInput | null;
}

interface UpdateAccountAuditLogArgs {
  input?: UpdateAccountAuditLogInput | null;
}

export type AccountAuditLog = typeof accountAuditLogs.$inferSelect;
export type CreateAccountAuditLog = typeof accountAuditLogs.$inferInsert;

const EventMetadataRef = builder.objectRef<EventMetadata>("EventMetadata");
EventMetadataRef.implement({
  fields: (t) => ({
    userAgent: t.exposeString("userAgent"),
    sessionId: t.exposeString("sessionId"),
    // Add fields here based on the structure of your EventMetadata
  }),
});

const OldStateRef = builder.objectRef<OldState>("OldState");
OldStateRef.implement({
  fields: (t) => ({
    state: t.exposeString("state"),
    // Add fields here based on the structure of your OldState
  }),
});

const NewStateRef = builder.objectRef<NewState>("NewState");
NewStateRef.implement({
  fields: (t) => ({
    state: t.exposeString("state"),
    // Add fields here based on the structure of your NewState
  }),
});

const accountAuditLogRef =
  builder.objectRef<AccountAuditLogBase>("AccountAuditLog");

accountAuditLogRef.implement({
  //   interfaces: () => [BaseType],
  fields: (t) => ({
    auditId: t.field({ type: "ID", resolve: (p) => p.auditId }),
    orgId: t.field({ type: "String", resolve: (p) => p.orgId }),
    user: t.field({
      type: userRef,
      resolve: async (parent) => {
        if (parent.userId == null) {
          return null;
        }
        const db = getDB();
        const user = await db
          .select()
          .from(users)
          .where(eq(users.userId, parent.userId));
        return user[0];
      },
    }),
    eventCategory: t.field({ type: "String", resolve: (p) => p.eventCategory }),
    eventDescription: t.field({
      type: "String",
      resolve: (p) => p.eventDescription,
    }),
    eventMetadata: t.field({
      type: EventMetadataRef,
      resolve: (p) => p.eventMetadata,
    }),
    clientIp: t.field({ type: "String", resolve: (p) => p.clientIp }),
    userAgent: t.field({ type: "String", resolve: (p) => p.userAgent }),
    oldState: t.field({ type: OldStateRef, resolve: (p) => p.oldState }),
    newState: t.field({ type: NewStateRef, resolve: (p) => p.newState }),
    createdAt: t.field({ type: "String", resolve: (p) => p.createdAt }),
    eventType: t.field({ type: "String", resolve: (p) => p.eventType }),
  }),
});

const EventMetadataInput = builder
  .inputRef<EventMetadata>("EventMetadataInput")
  .implement({
    fields: (t) => ({
      sessionId: t.string({ required: true }),
      userAgent: t.string({ required: true }),
      // Add other input fields as needed
    }),
  });

const OldStateInput = builder.inputRef<OldState>("OldStateInput").implement({
  fields: (t) => ({
    state: t.string({ required: true }),
    // Add input fields here based on the structure of your OldState. Example:
    // previousName: t.string(),
  }),
});

const NewStateInput = builder.inputRef<NewState>("NewStateInput").implement({
  fields: (t) => ({
    state: t.string({ required: true }),

    // Add input fields here based on the structure of your NewState. Example:
    // newName: t.string(),
  }),
});

const CreateAccountAuditLogInput = builder.inputRef<CreateAccountAuditLogInput>(
  "CreateAccountAuditLogInput"
);
CreateAccountAuditLogInput.implement({
  fields: (t) => ({
    auditId: t.id({}),
    orgId: t.string({ required: true }),
    userId: t.id({ required: true }),
    eventCategory: t.string({ required: true }),
    eventDescription: t.string({ required: true }),
    eventMetadata: t.field({ type: EventMetadataInput, required: true }),
    clientIp: t.string({ required: true }),
    userAgent: t.string({ required: true }),
    oldState: t.field({ type: OldStateInput, required: true }),
    newState: t.field({ type: NewStateInput, required: true }),
    createdAt: t.string(),
    eventType: t.string({ required: true }),
  }),
});

const UpdateAccountAuditLogInput = builder.inputRef<UpdateAccountAuditLogInput>(
  "UpdateAccountAuditLogInput"
);
UpdateAccountAuditLogInput.implement({
  fields: (t) => ({
    auditId: t.id({ required: true }),
    orgId: t.string(),
    userId: t.id(),
    eventCategory: t.string(),
    eventDescription: t.string(),
    eventMetadata: t.field({ type: EventMetadataInput }),
    clientIp: t.string(),
    userAgent: t.string(),
    oldState: t.field({ type: OldStateInput }),
    newState: t.field({ type: NewStateInput }),
    createdAt: t.string(),
    eventType: t.string(),
  }),
});

builder.queryFields((t) => ({
  accountAuditLogs: t.field({
    type: [accountAuditLogRef],
    resolve: getAccountAuditLogs,
  }),
  accountAuditLog: t.field({
    type: accountAuditLogRef,
    args: {
      auditId: t.arg.id({ required: true }),
    },
    resolve: getAccountAuditLog,
  }),
}));

builder.mutationFields((t) => ({
  createAccountAuditLog: t.field({
    type: accountAuditLogRef,
    args: {
      input: t.arg({ type: CreateAccountAuditLogInput }),
    },
    resolve: createAccountAuditLog,
  }),
  updateAccountAuditLog: t.field({
    type: accountAuditLogRef,
    args: {
      input: t.arg({ type: UpdateAccountAuditLogInput }),
    },
    resolve: updateAccountAuditLog,
  }),
  deleteAccountAuditLog: t.field({
    type: "Boolean",
    args: {
      auditId: t.arg.id({ required: true }),
    },
    resolve: deleteAccountAuditLog,
  }),
}));

const getAccountAuditLogs = async (_root: any, _args: any, ctx: Context) => {
  const db = getDB();
  const results = await db.select().from(accountAuditLogs);
  return results.map(deserializeAccountAuditLogData);
};

const getAccountAuditLog = async (
  _root: any,
  args: AccountAuditLogArgs,
  ctx: Context
) => {
  const db = getDB();
  const accountAuditLog = await db
    .select()
    .from(accountAuditLogs)
    .where(eq(accountAuditLogs.auditId, args.auditId));
  return accountAuditLog.length > 0
    ? deserializeAccountAuditLogData(accountAuditLog[0])
    : null;
};

const createAccountAuditLog = async (
  _root: any,
  args: CreateAccountAuditLogArgs,
  ctx: Context
) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const newAccountAuditLog = await db
    .insert(accountAuditLogs)
    .values(serializeAccountAuditLogData(args.input))
    .returning();
  return newAccountAuditLog.length > 0
    ? deserializeAccountAuditLogData(newAccountAuditLog[0])
    : null;
};

const updateAccountAuditLog = async (
  _root: any,
  args: UpdateAccountAuditLogArgs,
  ctx: Context
) => {
  if (!args.input) {
    throw new Error("Input is required");
  }
  const db = getDB();
  const updatedAccountAuditLog = await db
    .update(accountAuditLogs)
    .set(serializeAccountAuditLogData(args.input))
    .where(eq(accountAuditLogs.auditId, args.input.auditId))
    .returning();
  return updatedAccountAuditLog.length > 0
    ? deserializeAccountAuditLogData(updatedAccountAuditLog[0])
    : null;
};

const deleteAccountAuditLog = async (
  _root: any,
  args: AccountAuditLogArgs,
  ctx: Context
) => {
  const db = getDB();
  const deleted = await db
    .delete(accountAuditLogs)
    .where(eq(accountAuditLogs.auditId, args.auditId));
  return deleted !== null;
};

const serializeAccountAuditLogData = (data: any): any => ({
  ...data,
  eventMetadata: data.eventMetadata ? JSON.stringify(data.eventMetadata) : null,
  oldState: data.oldState ? JSON.stringify(data.oldState) : null,
  newState: data.newState ? JSON.stringify(data.newState) : null,
});

const deserializeAccountAuditLogData = (data: any): any => ({
  ...data,
  eventMetadata: data.eventMetadata ? JSON.parse(data.eventMetadata) : null,
  oldState: data.oldState ? JSON.parse(data.oldState) : null,
  newState: data.newState ? JSON.parse(data.newState) : null,
});
