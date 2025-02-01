import { createClient } from "@libsql/client";
import { getCtx } from "../..";
// import { usersTable } from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { getTenantDBUrl } from "../core";
console.log(process.env.TURSO_DATABASE_URL);
const client = () => {
  const ctx = getCtx();
  return createClient({
    url: ctx?.env.PLATFORM_DB_URL ?? "",
    authToken: ctx?.env.TURSO_DATABASE_AUTH_TOKEN ?? "",
  });
};

export const db = () => drizzle(client(), { logger: true });

export default client;

// export const getTables = async () => {
//   const result = await client().execute("SELECT * FROM users");
//   console.log(result.rows);
// };

// export const createUserTable = async () => {
//   const result = await client().execute(
//     "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)"
//   );
//   console.log(result);
// };

// export const createUser = async (user: { name: string; email: string }) => {
//   console.log(user);
//   if (!user.name || !user.email) {
//     console.error("User name or email is missing:", user);
//     return;
//   }
//   const result = await db().insert(usersTable).values({
//     name: user.name,
//     email: user.email,
//   });
//   console.log(result);
// };

export const getDB = (service?: string) => {
  if (!service) {
    service = "platform";
  }
  const ctx = getCtx();
  const url = getTenantDBUrl(ctx.tenantId, service);
  return drizzle(
    createClient({ url, authToken: ctx.env.TURSO_DATABASE_AUTH_TOKEN })
  );
};
