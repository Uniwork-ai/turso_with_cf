import { config } from "dotenv";
import { getEnv } from "../..";

config();
interface TenantDBUrl {
  platform: string;
  jira: string;
  gitlab: string;
  jenkins: string;
  sonarqube: string;
  sonarscanner: string;
  sonarcloud: string;
}
interface TenantDb {
  tenantId: TenantDBUrl;
}
// this is only for local development, later we will replace this with lib service call where it will fetch the tenant db url from KV store
export const getTenantDBUrl = (tenantId: string, service: string) => {
  const env = getEnv();
  const db_url: TenantDb = {
    tenantId: {
      platform: env.PLATFORM_DB_URL,
      jira: env.JIRA_DB_URL,
      gitlab: env.GITLAB_DB_URL,
      jenkins: env.JENKINS_DB_URL,
      sonarqube: env.SONARQUBE_DB_URL,
      sonarscanner: env.SONARSCANNER_DB_URL,
      sonarcloud: env.SONARCLOUD_DB_URL,
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
