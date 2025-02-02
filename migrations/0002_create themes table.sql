CREATE TABLE `themes` (
	`theme_id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`app_instance_id` text,
	`theme` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`app_instance_id`) REFERENCES `app_instances`(`instance_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_themes_org` ON `themes` (`org_id`);--> statement-breakpoint
CREATE INDEX `idx_themes_app_instance` ON `themes` (`app_instance_id`);