import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    ping: String
    users: [User!]!
    user(userId: ID!): User
    workspaces: [Workspace!]!
    workspace(workspaceId: ID!): Workspace
    appInstances: [AppInstance!]!
    appInstance(instanceId: ID!): AppInstance
    appInstanceByAppId(appId: ID!, workspaceId: ID): AppInstance
    accountAuditLogs: [AccountAuditLog!]!
    accountAuditLog(auditId: ID!): AccountAuditLog
    themes: [Theme!]!
    theme(themeId: ID!): Theme
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    updateUser(input: UpdateUserInput): User
    deleteUser(userId: ID!): Boolean
    createWorkspace(input: CreateWorkspaceInput): Workspace
    updateWorkspace(input: UpdateWorkspaceInput): Workspace
    deleteWorkspace(workspaceId: ID!): Boolean
    createAppInstance(input: CreateAppInstanceInput): AppInstance
    updateAppInstance(input: UpdateAppInstanceInput): AppInstance
    deleteAppInstance(instanceId: ID!): Boolean
    createAccountAuditLog(input: CreateAccountAuditLogInput): AccountAuditLog
    updateAccountAuditLog(input: UpdateAccountAuditLogInput): AccountAuditLog
    deleteAccountAuditLog(auditId: ID!): Boolean
    createTheme(input: CreateThemeInput!): Theme
    updateTheme(input: UpdateThemeInput!): Theme
    deleteTheme(themeId: ID!): Boolean
  }

  type User {
    userId: ID!
    orgId: String
    username: String
    email: String!
    platformRole: String
    orgRole: String
    groups: UserGroups
    myWorkspace: UserMyWorkspace
    workspaces: UserWorkspaces
    profileSettings: UserProfileSettings
    createdAt: String
    updatedAt: String
  }

  type UserGroups {
    groupIds: [String!]
  }

  type UserMyWorkspace {
    workspaceId: String
  }

  type UserWorkspaces {
    workspaceIds: [String!]
  }

  type UserProfileSettings {
    theme: String
    notifications: Boolean
  }

  input CreateUserInput {
    orgId: ID!
    username: String!
    email: String!
    platformRole: String
    orgRole: String
    groups: UserGroupsInput
    myWorkspace: UserMyWorkspaceInput
    workspaces: UserWorkspacesInput
    profileSettings: UserProfileSettingsInput
    createdAt: String
    updatedAt: String
  }

  input UpdateUserInput {
    userId: ID!
    orgId: ID
    username: String
    email: String
    platformRole: String
    orgRole: String
    groups: UserGroupsInput
    myWorkspace: UserMyWorkspaceInput
    workspaces: UserWorkspacesInput
    profileSettings: UserProfileSettingsInput
    createdAt: String
    updatedAt: String
  }

  input UserGroupsInput {
    groupIds: [String!]!
  }

  input UserMyWorkspaceInput {
    workspaceId: String!
  }

  input UserWorkspacesInput {
    workspaceIds: [String!]!
  }

  input UserProfileSettingsInput {
    theme: String
    notifications: Boolean
  }

  type Workspace {
    workspaceId: ID!
    orgId: ID!
    name: String!
    parentWorkspaceId: ID
    children: WorkspaceChildren
    apps: WorkspaceApps
    workspaceAcl: WorkspaceAcl
    createdAt: String
    updatedAt: String
    workspaceOrder: Int
  }

  type WorkspaceChildren {
    workspaceIds: [String!]!
  }

  type WorkspaceApps {
    appIds: [String!]!
  }

  type WorkspaceAcl {
    roles: Role
  }

  type Role {
    userId: [String!]!
  }

  input CreateWorkspaceInput {
    orgId: ID!
    name: String!
    parentWorkspaceId: ID
    children: WorkspaceChildrenInput
    apps: WorkspaceAppsInput
    workspaceAcl: WorkspaceAclInput!
    createdAt: String
    updatedAt: String
    workspaceOrder: Int
  }

  input UpdateWorkspaceInput {
    workspaceId: ID!
    orgId: ID
    name: String
    parentWorkspaceId: ID
    children: WorkspaceChildrenInput
    apps: WorkspaceAppsInput
    workspaceAcl: WorkspaceAclInput
    createdAt: String
    updatedAt: String
    workspaceOrder: Int
  }

  input WorkspaceChildrenInput {
    workspaceIds: [String!]!
  }

  input WorkspaceAppsInput {
    appIds: [String!]!
  }

  input WorkspaceAclInput {
    roles: RoleInput!
  }

  input RoleInput {
    userId: [String!]!
  }

  type AppInstance {
    instanceId: ID!
    appId: ID!
    orgId: ID!
    workspace: Workspace
    tenantDbIdentifier: String
    instanceMetadata: InstanceMetadata
    isActive: Boolean
    status: String
    createdAt: String
    updatedAt: String
    name: String
    theme: Theme
  }

  type InstanceMetadata {
    name: String!
    description: String
    version: String!
    config: InstanceConfig!
  }

  type InstanceConfig {
    port: Int!
    logLevel: String!
    maxConnections: Int!
  }

  input CreateAppInstanceInput {
    appId: ID!
    workspaceId: ID!
    orgId: ID!
    tenantDbIdentifier: String
    instanceMetadata: InstanceMetadataInput!
    isActive: Boolean
    status: String
    createdAt: String
    updatedAt: String
    name: String
  }

  input UpdateAppInstanceInput {
    instanceId: ID!
    appId: ID
    workspaceId: ID
    orgId: ID
    tenantDbIdentifier: String
    instanceMetadata: InstanceMetadataInput
    isActive: Boolean
    status: String
    createdAt: String
    updatedAt: String
    name: String
  }

  input InstanceMetadataInput {
    name: String!
    description: String
    version: String!
    config: InstanceConfigInput!
  }

  input InstanceConfigInput {
    port: Int!
    logLevel: LogLevel!
    maxConnections: Int!
  }

  enum LogLevel {
    debug
    info
    warn
    error
  }

  type AccountAuditLog {
    auditId: ID!
    orgId: String!
    user: User
    eventCategory: String!
    eventDescription: String!
    eventMetadata: EventMetadata!
    clientIp: String!
    userAgent: String!
    oldState: OldState!
    newState: NewState!
    createdAt: String
    eventType: String!
  }

  type EventMetadata {
    userAgent: String!
    sessionId: String!
  }

  type OldState {
    state: String!
  }

  type NewState {
    state: String!
  }

  input CreateAccountAuditLogInput {
    auditId: ID!
    orgId: String!
    userId: ID!
    eventCategory: String!
    eventDescription: String!
    eventMetadata: EventMetadataInput!
    clientIp: String!
    userAgent: String!
    oldState: OldStateInput!
    newState: NewStateInput!
    createdAt: String
    eventType: String!
  }

  input UpdateAccountAuditLogInput {
    auditId: ID!
    orgId: String
    userId: ID
    eventCategory: String
    eventDescription: String
    eventMetadata: EventMetadataInput
    clientIp: String
    userAgent: String
    oldState: OldStateInput
    newState: NewStateInput
    createdAt: String
    eventType: String
  }

  input EventMetadataInput {
    sessionId: String!
    userAgent: String!
  }

  input OldStateInput {
    state: String!
  }

  input NewStateInput {
    state: String!
  }

  type Theme {
    themeId: ID!
    orgId: String!
    appInstanceId: String
    theme: String
    createdAt: String
    updatedAt: String
  }

  input CreateThemeInput {
    orgId: String!
    appInstanceId: String
    theme: String!
  }

  input UpdateThemeInput {
    themeId: String!
    theme: String!
  }
`;