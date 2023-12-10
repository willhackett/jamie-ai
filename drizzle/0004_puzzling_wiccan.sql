CREATE TABLE `email_message` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`cc` text,
	`bcc` text,
	`subject` text NOT NULL,
	`text` text,
	`html` text,
	`attachments` text,
	`message_id` text,
	`in_reply_to` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `email_participant`;