import { sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const fooTable = sqliteTable("foo", {
  bar: text("bar").notNull().default("Hey!"),
});

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});
