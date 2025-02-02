import { Context, Next } from "hono";
import { deleteCookie, getSignedCookie } from "hono/cookie";

export const authMiddleware = async (c: Context, next: Next) => {
  const accessToken = await getSignedCookie(
    c,
    c.env.COOKIE_SECRET,
    "accessToken"
  );
  console.log("accessToken: verification", accessToken);
  if (!accessToken) {
    clearCookie(c);
    return c.json({ error: "Unauthorized" }, 401);
  }
  const resp = await c.env.unilib.verifyFirebaseIdToken(accessToken);
  const claims = await resp.json();
  //   console.log(claims);
  if (!claims) {
    clearCookie(c);
    return c.json({ error: "Invalid access token" }, 401);
  }
  // assert that tenantId from claims matches the tenantId from the request is same
  if (claims.firebase.tenant !== c.req.header("X-Tenant-Id")) {
    clearCookie(c);
    return c.json({ error: "Invalid tenant ID" }, 401);
  }
  await next();
};

export const clearCookie = (c: Context) => {
  deleteCookie(c, "accessToken");
};

/*
sample claims:
{
  iss: 'https://securetoken.google.com/uniwork-ai',
  aud: 'uniwork-ai',
  auth_time: 1738442417,
  user_id: 'ogAxMwhgN8TVJQKFToc8FpTee0V2',
  sub: 'ogAxMwhgN8TVJQKFToc8FpTee0V2',
  iat: 1738442417,
  exp: 1738446017,
  email: 'svijayaraagavan@gmail.com',
  email_verified: false,
  firebase: {
    identities: { email: [Array] },
    sign_in_provider: 'password',
    tenant: 'uniwork-sc4q0'
  }
}
*/
