import { builder, Context } from "../builder";
import { getDB } from "../modules/db";
import { eq } from "drizzle-orm";
import { themes } from "../modules/db/schema";
import { nanoid } from "nanoid";

// Base type and input interfaces
interface ThemeBase {
  themeId: string;
  orgId: string;
  appInstanceId?: string;
  theme: string; // This will store the theme JSON
  createdAt: string;
  updatedAt: string;
}

interface CreateThemeInput {
  orgId: string;
  appInstanceId?: string;
  theme: string; // JSON string containing theme data
}

interface UpdateThemeInput {
  themeId: string;
  theme: string; // JSON string containing theme data
}

// Resolver arg types
interface ThemeArgs {
  themeId: string;
}

interface CreateThemeArgs {
  input: CreateThemeInput;
}

interface UpdateThemeArgs {
  input: UpdateThemeInput;
}

export type Theme = typeof themes.$inferSelect;
export type CreateTheme = typeof themes.$inferInsert;

// Define Theme object type
export const themeRef = builder.objectRef<ThemeBase>("Theme");

themeRef.implement({
  fields: (t) => ({
    themeId: t.field({ type: "ID", resolve: (p) => p.themeId }),
    orgId: t.field({ type: "String", resolve: (p) => p.orgId }),
    appInstanceId: t.field({
      type: "String",
      nullable: true,
      resolve: (p) => p.appInstanceId,
    }),
    theme: t.field({ type: "String", resolve: (p) => p.theme }),
    createdAt: t.field({ type: "String", resolve: (p) => p.createdAt }),
    updatedAt: t.field({ type: "String", resolve: (p) => p.updatedAt }),
  }),
});

// Input type definitions
const CreateThemeInput = builder.inputRef<CreateThemeInput>("CreateThemeInput");
CreateThemeInput.implement({
  fields: (t) => ({
    orgId: t.string({ required: true }),
    appInstanceId: t.string(),
    theme: t.string({ required: true }), // JSON string
  }),
});

const UpdateThemeInput = builder.inputRef<UpdateThemeInput>("UpdateThemeInput");
UpdateThemeInput.implement({
  fields: (t) => ({
    themeId: t.string({ required: true }),
    theme: t.string({ required: true }), // JSON string
  }),
});

// Query fields
builder.queryFields((t) => ({
  themes: t.field({
    type: [themeRef],
    resolve: getThemes,
  }),
  theme: t.field({
    type: themeRef,
    args: {
      themeId: t.arg.id({ required: true }),
    },
    resolve: getTheme,
  }),
}));

// Mutation fields
builder.mutationFields((t) => ({
  createTheme: t.field({
    type: themeRef,
    args: {
      input: t.arg({ type: CreateThemeInput, required: true }),
    },
    resolve: createTheme,
  }),
  updateTheme: t.field({
    type: themeRef,
    args: {
      input: t.arg({ type: UpdateThemeInput, required: true }),
    },
    resolve: updateTheme,
  }),
  deleteTheme: t.field({
    type: "Boolean",
    args: {
      themeId: t.arg.id({ required: true }),
    },
    resolve: deleteTheme,
  }),
}));

// Resolver functions
const getThemes = async (_root: any, _args: any, ctx: Context) => {
  const db = getDB();
  return await db.select().from(themes);
};

const getTheme = async (_root: any, args: ThemeArgs, ctx: Context) => {
  const db = getDB();
  const theme = await db
    .select()
    .from(themes)
    .where(eq(themes.themeId, args.themeId)); // Use themeId instead of id
  return theme[0] || null;
};

const createTheme = async (_root: any, args: CreateThemeArgs, ctx: Context) => {
  const db = getDB();
  const result = await db
    .insert(themes)
    .values({
      themeId: nanoid(),
      orgId: args.input.orgId,
      appInstanceId: args.input.appInstanceId,
      theme: args.input.theme,
    })
    .returning();
  return result[0];
};

const updateTheme = async (_root: any, args: UpdateThemeArgs, ctx: Context) => {
  const db = getDB();
  const result = await db
    .update(themes)
    .set({
      theme: args.input.theme,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(themes.themeId, args.input.themeId))
    .returning();
  return result[0];
};

const deleteTheme = async (_root: any, args: ThemeArgs, ctx: Context) => {
  const db = getDB();
  const deleted = await db
    .delete(themes)
    .where(eq(themes.themeId, args.themeId))
    .returning();
  return deleted.length > 0;
};
