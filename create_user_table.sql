CREATE TABLE `users` (
	`id` int NOT NULL auto_increment,
	`username` varchar(50) NOT NULL default '',
	`password` varchar(50) NOT NULL default '',
	PRIMARY KEY (`id`)
);

INSERT INTO `users`(`username`, `password`) VALUES ('admin','21232f297a57a5a743894a0e4a801fc3');