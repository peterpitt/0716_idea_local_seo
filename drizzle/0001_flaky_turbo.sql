CREATE TABLE `analysis_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`idea` text NOT NULL,
	`stage1` text,
	`stage2` text,
	`stage3` text,
	`stage4` text,
	`stage5` text,
	`status` enum('pending','stage1','stage2','stage3','stage4','stage5','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analysis_sessions_id` PRIMARY KEY(`id`)
);
