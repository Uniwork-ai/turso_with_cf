CREATE TABLE `foo` (
	`bar` text DEFAULT 'Hey!' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
);
