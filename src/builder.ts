import SchemaBuilder from "@pothos/core";
// export const builder = new SchemaBuilder<{ Context: {} }>({});
// export const builder = new SchemaBuilder<{
//   Objects: { Plan: typeof plans.$inferSelect };
// }>({});
export interface Context {
  userId?: string;
}
export const builder = new SchemaBuilder<{
  Context: Context;
}>({});
