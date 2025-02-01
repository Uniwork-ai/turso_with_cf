import { config } from "dotenv";
import { getCtx } from "../../index";

config();
interface TenantDBUrl {
  platform: string;
  jira: string;
}
interface TenantDb {
  [key: string]: TenantDBUrl;
}
// this is only for local development, later we will replace this with lib service call where it will fetch the tenant db url from KV store
export const getTenantDBUrl = (tenantId: string, service: string) => {
  const ctx = getCtx();
  const db_url: TenantDb = {
    [tenantId]: {
      platform: ctx.env.PLATFORM_DB_URL,
      jira: ctx.env.JIRA_DB_URL,
    },
  };
  const url =
    db_url[tenantId as keyof typeof db_url][
      service as keyof typeof db_url.tenantId
    ];
  if (!url) {
    throw new Error(`Service ${service} not found`);
  }
  return url;
};
