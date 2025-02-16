import { Hono } from "hono";
import { typeDefs } from "./modules/graphql/schema";
import { resolvers } from "./modules/graphql/resolver";
import { createAuthRoutes } from "./routes";
import { authMiddleware } from "./modules/core/middlewares";
import { cors } from "hono/cors";
// import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/dist/esm/plugin/landingPage/default";
import { ApolloServer } from "@apollo/server";
import { honoApollo } from "./hono-apollo";
// import client, { createUser, createUserTable, getTables } from "./modules/db";

export type Bindings = {
  // MY_BUCKET: R2Bucket;
  USERNAME: string;
  PASSWORD: string;
  PLATFORM_DB_URL: string;
  TURSO_DATABASE_AUTH_TOKEN: string;
  JIRA_DB_URL: string;
  unilib: any;
  COOKIE_SECRET: string;
};

interface Context {
  env: Bindings;
  tenantId: string;
}

const app = new Hono<{ Bindings: Bindings }>();

let globalCtx: Context | null = null;
export const getCtx = (): Context => {
  if (!globalCtx) {
    throw new Error("Context not initialized");
  }
  return globalCtx;
};

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3001",
      "https://zuno.uniwork.ai.dev:5173",
      "http://zuno.uniwork.ai.test:3001",
    ],
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const tenantId = c.req.header("X-Tenant-Id");
  // if (tenantId) {
  //   return c.json({ error: "Tenant ID is required" }, 400);
  // }
  globalCtx = {
    env: c.env,
    tenantId: tenantId,
  };
  await next();
});

// public routes
createAuthRoutes(app);

// private routes
// app.use("*", authMiddleware);
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers ,
  introspection: true,
  plugins: [
    // ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});

server.start();

app.route(
  '/graphql',
  honoApollo(server, async ctx => getCtx()),
);

// Access to environment values
app.put("/upload/:key", async (c, next) => {
  const key = c.req.param("key");
  // await c.env.MY_BUCKET.put(key, c.req.body);
  console.log(c.env.USERNAME);
  return c.text(`Put ${key} successfully!`);
});

// app.get("/", async (c) => {
//   console.log(getCtx()?.env.USERNAME);
//   getTables();
//   return c.text("Hello Hono!");
// });

// app.post("/create-user-table", async (c) => {
//   await createUserTable();
//   return c.text("User table created successfully!");
// });

// app.post("/create-user", async (c) => {
//   const user = await c.req.json();
//   await createUser(user);
//   return c.text("User created successfully!");
// });

export default app;
