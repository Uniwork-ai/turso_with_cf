import { Hono } from "hono";
import client, { createUser, createUserTable, getTables } from "./modules/db";

import { AsyncLocalStorage } from "node:async_hooks";
import { createMiddleware } from "hono/factory";

// const app = new Hono()
type Bindings = {
  // MY_BUCKET: R2Bucket;
  USERNAME: string;
  PASSWORD: string;
};

const app = new Hono<{ Bindings: Bindings }>();
let globalEnv: Env["Bindings"] | null = null;
export const getEnv = () => globalEnv;
app.use("*", async (c, next) => {
  globalEnv = c.env;
  await next();
});

// Access to environment values
app.put("/upload/:key", async (c, next) => {
  const key = c.req.param("key");
  // await c.env.MY_BUCKET.put(key, c.req.body);
  console.log(c.env.USERNAME);
  return c.text(`Put ${key} successfully!`);
});

app.get("/", async (c) => {
  console.log(globalEnv?.USERNAME);
  getTables();
  return c.text("Hello Hono!");
});

app.post("/create-user-table", async (c) => {
  await createUserTable();
  return c.text("User table created successfully!");
});

app.post("/create-user", async (c) => {
  const user = await c.req.json();
  await createUser(user);
  return c.text("User created successfully!");
});

export default app;
