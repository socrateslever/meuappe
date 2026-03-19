CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` int,
	`changes` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`hash` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collectionMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competencyId` int NOT NULL,
	`tenantId` int NOT NULL,
	`ownerId` int NOT NULL,
	`messageType` enum('pre_due','due_notice','friendly','formal','rescission') NOT NULL,
	`channel` enum('whatsapp','email','sms') NOT NULL DEFAULT 'whatsapp',
	`content` text NOT NULL,
	`status` enum('draft','sent','failed') NOT NULL DEFAULT 'draft',
	`sentAt` timestamp,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collectionMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`imageUrl` text,
	`category` varchar(100),
	`status` enum('published','draft','archived') NOT NULL DEFAULT 'published',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `communityPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contractId` int NOT NULL,
	`tenantId` int NOT NULL,
	`propertyId` int NOT NULL,
	`ownerId` int NOT NULL,
	`month` date NOT NULL,
	`rentAmount` decimal(10,2) NOT NULL,
	`fineAmount` decimal(10,2) DEFAULT 0,
	`interestAmount` decimal(10,2) DEFAULT 0,
	`totalAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','partial','overdue') NOT NULL DEFAULT 'pending',
	`dueDate` date NOT NULL,
	`paidDate` date,
	`paidAmount` decimal(10,2) DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`tenantId` int NOT NULL,
	`ownerId` int NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date,
	`monthlyRent` decimal(10,2) NOT NULL,
	`depositAmount` decimal(10,2),
	`status` enum('active','terminated','expired') NOT NULL DEFAULT 'active',
	`terminationReason` text,
	`terminationDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `irpfConsolidation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`year` int NOT NULL,
	`totalRentReceived` decimal(12,2) DEFAULT 0,
	`totalExpenses` decimal(12,2) DEFAULT 0,
	`totalTaxable` decimal(12,2) DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `irpfConsolidation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `maintenanceTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`tenantId` int,
	`ownerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','completed','cancelled') NOT NULL DEFAULT 'open',
	`category` varchar(100),
	`estimatedCost` decimal(10,2),
	`actualCost` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenanceTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplaceServices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`providerName` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`phone` varchar(20),
	`email` varchar(320),
	`imageUrl` text,
	`rating` decimal(3,1) DEFAULT 0,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketplaceServices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competencyId` int NOT NULL,
	`tenantId` int NOT NULL,
	`propertyId` int NOT NULL,
	`ownerId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentMethod` enum('cash','transfer','pix','check','other') NOT NULL,
	`paymentDate` date NOT NULL,
	`receiptUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portalConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`heroTitle` text,
	`heroSubtitle` text,
	`whatsappPhone` varchar(20),
	`showServices` boolean DEFAULT true,
	`showBanners` boolean DEFAULT true,
	`showMap` boolean DEFAULT true,
	`marketplaceActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portalConfig_id` PRIMARY KEY(`id`),
	CONSTRAINT `portalConfig_ownerId_unique` UNIQUE(`ownerId`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`number` varchar(50) NOT NULL,
	`type` enum('apartment','quitinete','commercial') NOT NULL,
	`bedrooms` int DEFAULT 0,
	`bathrooms` int DEFAULT 0,
	`area` decimal(8,2),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zipCode` varchar(10),
	`status` enum('vacant','occupied','maintenance') NOT NULL DEFAULT 'vacant',
	`monthlyRent` decimal(10,2) NOT NULL,
	`imageUrl` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`cpf` varchar(20),
	`status` enum('active','inactive','evicted') NOT NULL DEFAULT 'active',
	`inadimplencyScore` int DEFAULT 0,
	`totalDebt` decimal(12,2) DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `auditLogs` ADD CONSTRAINT `auditLogs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collectionMessages` ADD CONSTRAINT `collectionMessages_competencyId_competencies_id_fk` FOREIGN KEY (`competencyId`) REFERENCES `competencies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collectionMessages` ADD CONSTRAINT `collectionMessages_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collectionMessages` ADD CONSTRAINT `collectionMessages_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityPosts` ADD CONSTRAINT `communityPosts_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `competencies` ADD CONSTRAINT `competencies_contractId_contracts_id_fk` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `competencies` ADD CONSTRAINT `competencies_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `competencies` ADD CONSTRAINT `competencies_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `competencies` ADD CONSTRAINT `competencies_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contracts` ADD CONSTRAINT `contracts_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `irpfConsolidation` ADD CONSTRAINT `irpfConsolidation_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceTickets` ADD CONSTRAINT `maintenanceTickets_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceTickets` ADD CONSTRAINT `maintenanceTickets_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenanceTickets` ADD CONSTRAINT `maintenanceTickets_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marketplaceServices` ADD CONSTRAINT `marketplaceServices_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_competencyId_competencies_id_fk` FOREIGN KEY (`competencyId`) REFERENCES `competencies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `portalConfig` ADD CONSTRAINT `portalConfig_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `properties` ADD CONSTRAINT `properties_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_userId` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_action` ON `auditLogs` (`action`);--> statement-breakpoint
CREATE INDEX `idx_createdAt` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_tenantId` ON `collectionMessages` (`tenantId`);--> statement-breakpoint
CREATE INDEX `idx_messageType` ON `collectionMessages` (`messageType`);--> statement-breakpoint
CREATE INDEX `idx_ownerId` ON `communityPosts` (`ownerId`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `communityPosts` (`status`);--> statement-breakpoint
CREATE INDEX `idx_tenantId` ON `competencies` (`tenantId`);--> statement-breakpoint
CREATE INDEX `idx_propertyId` ON `competencies` (`propertyId`);--> statement-breakpoint
CREATE INDEX `idx_month` ON `competencies` (`month`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `competencies` (`status`);--> statement-breakpoint
CREATE INDEX `idx_propertyId` ON `contracts` (`propertyId`);--> statement-breakpoint
CREATE INDEX `idx_tenantId` ON `contracts` (`tenantId`);--> statement-breakpoint
CREATE INDEX `idx_ownerId` ON `contracts` (`ownerId`);--> statement-breakpoint
CREATE INDEX `idx_ownerId` ON `irpfConsolidation` (`ownerId`);--> statement-breakpoint
CREATE INDEX `idx_year` ON `irpfConsolidation` (`year`);--> statement-breakpoint
CREATE INDEX `idx_propertyId` ON `maintenanceTickets` (`propertyId`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `maintenanceTickets` (`status`);--> statement-breakpoint
CREATE INDEX `idx_ownerId` ON `marketplaceServices` (`ownerId`);--> statement-breakpoint
CREATE INDEX `idx_category` ON `marketplaceServices` (`category`);--> statement-breakpoint
CREATE INDEX `idx_tenantId` ON `payments` (`tenantId`);--> statement-breakpoint
CREATE INDEX `idx_paymentDate` ON `payments` (`paymentDate`);--> statement-breakpoint
CREATE INDEX `idx_ownerId` ON `portalConfig` (`ownerId`);--> statement-breakpoint
CREATE INDEX `idx_ownerId` ON `properties` (`ownerId`);--> statement-breakpoint
CREATE INDEX `idx_ownerId` ON `tenants` (`ownerId`);--> statement-breakpoint
CREATE INDEX `idx_userId` ON `tenants` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_openId` ON `users` (`openId`);