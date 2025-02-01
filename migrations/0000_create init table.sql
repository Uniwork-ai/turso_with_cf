CREATE TABLE `account_audit_logs` (
	`audit_id` text PRIMARY KEY NOT NULL,
	`org_id` text,
	`user_id` text,
	`event_category` text,
	`event_description` text,
	`event_metadata` text,
	`client_ip` text,
	`user_agent` text,
	`old_state` text,
	`new_state` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`event_type` text
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_org` ON `account_audit_logs` (`org_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_logs_timestamp` ON `account_audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_audit_logs_user` ON `account_audit_logs` (`user_id`);--> statement-breakpoint
CREATE TABLE `app_instances` (
	`instance_id` text PRIMARY KEY NOT NULL,
	`app_id` text,
	`workspace_id` text,
	`org_id` text,
	`tenant_db_identifier` text,
	`instance_metadata` text DEFAULT '{}',
	`is_active` integer DEFAULT true,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`workspace_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_app_instances_org` ON `app_instances` (`org_id`);--> statement-breakpoint
CREATE INDEX `idx_app_instances_workspace` ON `app_instances` (`workspace_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`org_id` text,
	`username` text,
	`email` text NOT NULL,
	`platform_role` text,
	`org_role` text,
	`groups` text,
	`my_workspace` text,
	`workspaces` text,
	`profile_settings` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_key` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_key` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`workspace_id` text PRIMARY KEY NOT NULL,
	`org_id` text,
	`name` text NOT NULL,
	`parent_workspace_id` text,
	`children` text,
	`apps` text,
	`workspace_acl` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`workspace_order` integer,
	FOREIGN KEY (`parent_workspace_id`) REFERENCES `workspaces`(`workspace_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_workspace_org` ON `workspaces` (`org_id`);--> statement-breakpoint
CREATE INDEX `idx_workspaces_order` ON `workspaces` (`workspace_order`);