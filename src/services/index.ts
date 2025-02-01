import { eq } from "drizzle-orm";
import { getDB } from "../db";
import { organizations } from "../db/schema";
import { Context } from "../types";

export const getOrganizationByDomain = async (
  ctx: Context,
  domain?: string
) => {
  if (!domain) {
    throw new Error("Domain is required");
  }
  const db = getDB(ctx);
  const organization = await db
    .select()
    .from(organizations)
    .where(eq(organizations.subdomain, domain));
  return organization;
};
