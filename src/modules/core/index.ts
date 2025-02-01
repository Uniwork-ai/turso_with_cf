import { config } from "dotenv";
import { getCtx } from "../../index";
import { getDB } from "../db";

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
/* 
    this is only for local development, later we will replace this with lib service call where it will 
    all the global platform tables such as orgs, apps, etc. from KV store
*/
export const getOrgByTenantId = (tenantId: string) => {
  const org = getOrgs().find((org) => org.tenant_id === tenantId);
  return org;
};

export const getApp = (appId: string) => {
  return getApps().find((app) => app.app_id === appId);
};

export const getOrgs = () => {
  return [
    {
      org_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "yahoos",
      type: null,
      subdomain: "yahoos.uniwork.ai",
      category: null,
      employee_size: null,
      logo_url: null,
      status: "active",
      status_reason: null,
      status_changed_at: null,
      address: {},
      default_privacy_settings: null,
      global_settings: null,
      security_settings: null,
      theme: null,
      platform_role: null,
      org_roles: [
        {
          role: "CEO",
          role_id: "550e8400-e29b-41d4-a716-446655440000",
          group_id: "g-exec",
        },
        {
          role: "CTO",
          role_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          group_id: "g-eng",
        },
        {
          role: "VP Engineering",
          role_id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
          group_id: "g-eng",
        },
        {
          role: "Engineering Manager",
          role_id: "6ba7b812-9dad-11d1-80b4-00c04fd430c0",
          group_id: "g-eng-backend",
        },
        {
          role: "Senior Software Engineer",
          role_id: "6ba7b813-9dad-11d1-80b4-00c04fd430c1",
          group_id: "g-eng-backend",
        },
        {
          role: "Software Engineer",
          role_id: "6ba7b814-9dad-11d1-80b4-00c04fd430c2",
          group_id: "g-eng-frontend",
        },
      ],
      custom_groups: {
        groups: [
          {
            name: "Departments",
            group_id: "g-dept",
            subgroups: ["g-exec", "g-eng", "g-prod", "g-sales"],
            description: "Root group for all departments",
            parent_group: null,
            is_assignable: false,
          },
          {
            name: "Executive",
            group_id: "g-exec",
            subgroups: [],
            description: "Executive department",
            parent_group: "g-dept",
            is_assignable: true,
          },
          {
            name: "Engineering",
            group_id: "g-eng",
            subgroups: ["g-eng-backend", "g-eng-frontend", "g-eng-devops"],
            description: "Engineering department",
            parent_group: "g-dept",
            is_assignable: true,
          },
          {
            name: "Backend Team",
            group_id: "g-eng-backend",
            subgroups: [],
            description: "Backend development team",
            parent_group: "g-eng",
            is_assignable: true,
          },
          {
            name: "Frontend Team",
            group_id: "g-eng-frontend",
            subgroups: [],
            description: "Frontend development team",
            parent_group: "g-eng",
            is_assignable: true,
          },
          {
            name: "DevOps Team",
            group_id: "g-eng-devops",
            subgroups: [],
            description: "DevOps team",
            parent_group: "g-eng",
            is_assignable: true,
          },
        ],
      },
      created_at: "2024-10-12 17:00:00+00",
      updated_at: "2024-12-07 18:43:50.832211+00",
      tenant_id: null,
    },
    {
      org_id: "550e8400-e29b-41d4-a716-446655440003",
      name: "a2b",
      type: null,
      subdomain: "suk.uniwork.ai",
      category: null,
      employee_size: null,
      logo_url: null,
      status: "setup",
      status_reason: null,
      status_changed_at: null,
      address: {},
      default_privacy_settings: null,
      global_settings: null,
      security_settings: null,
      theme: null,
      platform_role: null,
      org_roles: [
        {
          role: "CEO",
          roleId: "550e8400-e29b-41d4-a716-446655440000",
          groupId: "g-exec",
        },
        {
          role: "CTO",
          roleId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          groupId: "g-eng",
        },
        {
          role: "VP Engineering",
          roleId: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
          groupId: "g-eng",
        },
        {
          role: "Engineering Manager",
          roleId: "6ba7b812-9dad-11d1-80b4-00c04fd430c0",
          groupId: "g-eng-backend",
        },
        {
          role: "Senior Software Engineer",
          roleId: "6ba7b813-9dad-11d1-80b4-00c04fd430c1",
          groupId: "g-eng-backend",
        },
        {
          role: "Software Engineer",
          roleId: "6ba7b814-9dad-11d1-80b4-00c04fd430c2",
          groupId: "g-eng-frontend",
        },
      ],
      custom_groups: { groups: [] },
      created_at: "2024-10-12 17:00:00+00",
      updated_at: "2024-12-07 18:43:50.832+00",
      tenant_id: null,
    },
    {
      org_id: "aea8fd46-0df0-41f1-a849-0a325ce31122",
      name: "Example Organization",
      type: "Company",
      subdomain: "example-org",
      category: "Technology",
      employee_size: 50,
      logo_url: "https://example.com/logo.png",
      status: "active",
      status_reason: "Initial setup",
      status_changed_at: "2024-03-08 12:00:00+00",
      address: {
        city: "Anytown",
        country: "USA",
        state: "CA",
        street: "123 Main St",
        zip: "90210",
      },
      default_privacy_settings: {
        dataRetention: 365,
        dataSharing: true,
      },
      global_settings: {
        currency: "USD",
        language: "en",
        timeZone: "America/Los_Angeles",
      },
      security_settings: {
        passwordPolicy: "Minimum 8 characters",
        twoFactorAuth: false,
      },
      theme: "#007bff",
      platform_role: "admin",
      org_roles: {
        admin: ["user1@example.com"],
        editor: [],
        viewer: [],
      },
      custom_groups: {
        group1: ["user2@example.com"],
        group2: [],
      },
      created_at: "2024-03-08 12:00:00+00",
      updated_at: "2024-03-08 12:00:00+00",
      tenant_id: null,
    },
    {
      org_id: "eb1bacd4-8752-4f4a-9f14-8c1ef7ba6184",
      name: "Playzuno",
      type: "Company",
      subdomain: "zuno.com",
      category: "Technology",
      employee_size: 50,
      logo_url: "https://example.com/logo.png",
      status: "active",
      status_reason: "Initial setup",
      status_changed_at: "2024-03-08 12:00:00+00",
      address: {
        city: "Anytown",
        country: "USA",
        state: "CA",
        street: "123 Main St",
        zip: "90210",
      },
      default_privacy_settings: {
        dataRetention: 365,
        dataSharing: true,
      },
      global_settings: {
        currency: "USD",
        language: "en",
        timeZone: "America/Los_Angeles",
      },
      security_settings: {
        passwordPolicy: "Minimum 8 characters",
        twoFactorAuth: false,
      },
      theme: "#007bff",
      platform_role: "admin",
      org_roles: {
        admin: ["sukuna4anime@gmail.com"],
        editor: [],
        viewer: [],
      },
      custom_groups: {
        group1: ["user2@example.com"],
        group2: [],
      },
      created_at: "2024-03-08 12:00:00+00",
      updated_at: "2025-02-01 07:40:43.535865+00",
      tenant_id: "zuno-fpkpg",
    },
  ];
};

export const getApps = () => {
  return [
    {
      app_id: "af85b767-2465-40b6-b955-e83733824ff0",
      name: "Tasks",
      type: "standalone",
      version: "1",
      status: "approved",
      frontend_url: "https://uniwork.zuno.com/apps/tasks",
      backend_url: "http://localhost:3000/api/v2",
      logo_url: null,
      category: "Tech",
      subcategory: null,
      keywords: null,
      description: "note taking utility",
      metadata: {
        companyName: "Zuno",
        contactEmail: "sukuna@gmail.com",
      },
      suitable_workspaces: null,
      approved_by: null,
      approved_at: null,
      approval_notes: null,
      created_by: "d654e6ba-70a3-48ef-a95d-37c8d8a79013",
      team_type: "internal",
      created_at: "2025-01-26 10:21:47.890424+00",
      updated_at: "2025-01-26 10:21:47.890424+00",
    },
  ];
};
