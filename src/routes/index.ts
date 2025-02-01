import { Hono } from "hono";
import { getOrganizationByDomain } from "../services";
import { getDB } from "../modules/db";
import { appInstances } from "../modules/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { Bindings, getCtx } from "..";
import { getApp, getOrgByTenantId } from "../modules/core";
import { setCookie, setSignedCookie } from "hono/cookie";

export const createAuthRoutes = (app: Hono<{ Bindings: Bindings }>) => {
  app.post("/api/v1/app/:appName", async (c) => {
    const ctx = getCtx();
    // const params = await c.req.json();
    const tenantId = ctx.tenantId;
    const appName = c.req.param("appName");
    // const app = getApp(appName);
    const org = getOrgByTenantId(tenantId);
    if (!org) {
      return c.json({ error: "org not found" }, 400);
    }
    if (!app) {
      return c.json({ error: "app not found" }, 400);
    }

    try {
      const db = getDB();
      const appInstance = await db
        .select({
          instanceId: appInstances.instanceId,
          orgId: appInstances.orgId,
          appId: appInstances.appId,
        })
        .from(appInstances)
        .where(
          and(
            eq(appInstances.orgId, org.org_id),
            eq(appInstances.name, appName)
          )
        )
        .limit(1);

      if (appInstance.length === 0) {
        return c.redirect("/login"); // Redirect to login page
      }

      return c.json({
        appInstance: appInstance[0],
        app: getApp(appInstance[0].appId),
      });
    } catch (error) {
      console.error("Error in /app route:", error);
      return c.json({ error: "Failed to fetch app metadata" }, 500);
    }
  });

  app.post("/api/v1/users/:userId/getCustomToken", async (c) => {
    const ctx = getCtx();
    const userId = c.req.param("userId");
    const params = await c.req.json();
    if (!params.accessToken) {
      return c.json({ error: "accessToken is required" }, 400);
    }
    const resp = await c.env.unilib.verifyFirebaseIdToken(params.accessToken);
    const claims = await resp.json();
    if (!claims) {
      return c.json({ error: "Invalid access token" }, 400);
    }
    const cookie_secret = ctx.env.COOKIE_SECRET;
    setSignedCookie(c, "accessToken", params.accessToken, cookie_secret, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 60 * 60, // 1 hour
    });
    return c.json({ token: params.accessToken });
  });

  app.post("/api/v1/users/:userId/logout", async (c) => {
    const ctx = getCtx();
    const userId = c.req.param("userId");
    const params = await c.req.json();
    if (!params.accessToken) {
      return c.json({ error: "accessToken is required" }, 400);
    }
    const resp = await c.env.unilib.verifyFirebaseIdToken(params.accessToken);
    const claims = await resp.json();
    if (!claims) {
      return c.json({ error: "Invalid access token" }, 400);
    }
  });
};

// const unilib = ctx.env.unilib;
// const token = await unilib.createFirebaseCustomToken(userId, {
//   tenantId: ctx.tenantId,
// });
