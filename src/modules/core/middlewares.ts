import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

export const authMiddleware = async (c: Context, next: Next) => {
  const accessToken = await getSignedCookie(
    c,
    c.env.COOKIE_SECRET,
    "accessToken"
  );
  console.log("accessToken: verification", accessToken);
  if (!accessToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const resp = await c.env.unilib.verifyFirebaseIdToken(accessToken);
  const claims = await resp.json();
  //   console.log(claims);
  if (!claims) {
    return c.json({ error: "Invalid access token" }, 400);
  }
  // assert that tenantId from claims matches the tenantId from the request is same
  if (claims.firebase.tenant !== c.req.header("X-Tenant-Id")) {
    return c.json({ error: "Invalid tenant ID" }, 400);
  }
  await next();
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
