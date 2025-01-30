import { createClient } from "@libsql/client";
import { getEnv } from "../..";
import { usersTable } from "./schema";
import { drizzle } from "drizzle-orm/libsql";
console.log(process.env.TURSO_DATABASE_URL);
const client = () => {
  const env = getEnv();
  return createClient({
    url: env?.TURSO_DATABASE_URL,
    authToken: env?.TURSO_DATABASE_AUTH_TOKEN,
  });
};

export const db = () => drizzle(client(), { logger: true });

export default client;

export const getTables = async () => {
  const result = await client().execute("SELECT * FROM users");
  console.log(result.rows);
};

export const createUserTable = async () => {
  const result = await client().execute(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)"
  );
  console.log(result);
};

export const createUser = async (user: { name: string; email: string }) => {
  console.log(user);
  if (!user.name || !user.email) {
    console.error("User name or email is missing:", user);
    return;
  }
  const result = await db().insert(usersTable).values({
    name: user.name,
    email: user.email,
  });
  console.log(result);
};
