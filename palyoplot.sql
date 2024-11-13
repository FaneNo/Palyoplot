/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: palyoplot
-- ------------------------------------------------------
-- Server version	10.11.8-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES
(1,'Can add log entry',1,'add_logentry'),
(2,'Can change log entry',1,'change_logentry'),
(3,'Can delete log entry',1,'delete_logentry'),
(4,'Can view log entry',1,'view_logentry'),
(5,'Can add permission',2,'add_permission'),
(6,'Can change permission',2,'change_permission'),
(7,'Can delete permission',2,'delete_permission'),
(8,'Can view permission',2,'view_permission'),
(9,'Can add group',3,'add_group'),
(10,'Can change group',3,'change_group'),
(11,'Can delete group',3,'delete_group'),
(12,'Can view group',3,'view_group'),
(13,'Can add user',4,'add_user'),
(14,'Can change user',4,'change_user'),
(15,'Can delete user',4,'delete_user'),
(16,'Can view user',4,'view_user'),
(17,'Can add content type',5,'add_contenttype'),
(18,'Can change content type',5,'change_contenttype'),
(19,'Can delete content type',5,'delete_contenttype'),
(20,'Can view content type',5,'view_contenttype'),
(21,'Can add session',6,'add_session'),
(22,'Can change session',6,'change_session'),
(23,'Can delete session',6,'delete_session'),
(24,'Can view session',6,'view_session'),
(25,'Can add csv file',7,'add_csvfile'),
(26,'Can change csv file',7,'change_csvfile'),
(27,'Can delete csv file',7,'delete_csvfile'),
(28,'Can view csv file',7,'view_csvfile'),
(29,'Can add dataset',8,'add_dataset'),
(30,'Can change dataset',8,'change_dataset'),
(31,'Can delete dataset',8,'delete_dataset'),
(32,'Can view dataset',8,'view_dataset');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES
(1,'pbkdf2_sha256$870000$AWKhgbBHLmAX90ipHMkpAg$n6wEFB248B+WA5pWHU1R5kCokNy0HDhpfjF9DD6IMjo=','2024-09-21 03:12:45.601998',1,'csc190191','','','',1,1,'2024-09-21 03:12:27.962565'),
(2,'pbkdf2_sha256$720000$qYKS1NDwYNtLbrvGl5Lyk1$8pLjvPtriRbOTMPhT5A8fZkfQLJC9Titmvy6FyVrwWc=',NULL,0,'test','','','123@gmail.com',0,1,'2024-09-21 03:19:26.366036');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `csv_columns`
--

DROP TABLE IF EXISTS `csv_columns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `csv_columns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_id` int(11) DEFAULT NULL,
  `column_name` varchar(255) NOT NULL,
  `column_order` int(11) NOT NULL,
  `data_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  CONSTRAINT `csv_columns_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `csv_files` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csv_columns`
--

LOCK TABLES `csv_columns` WRITE;
/*!40000 ALTER TABLE `csv_columns` DISABLE KEYS */;
INSERT INTO `csv_columns` VALUES
(1,7,'',1,NULL),
(2,7,'age',2,NULL),
(3,7,'adj_depth',3,NULL),
(4,7,'core_depth',4,NULL),
(5,7,'Pinus',5,NULL),
(6,7,'Cupressaceae',6,NULL),
(7,7,'Fraxinus',7,NULL),
(8,7,'Abies',8,NULL),
(9,7,'Quercus',9,NULL),
(10,7,'Rosaceae',10,NULL),
(11,7,'Chrysolepis',11,NULL),
(12,7,'Artemisia',12,NULL),
(13,7,'Salix',13,NULL),
(14,7,'Amaranthaceae',14,NULL),
(15,7,'Apiaceae',15,NULL),
(16,7,'Asteracea',16,NULL),
(17,7,'Poaceae',17,NULL),
(18,7,'Indeterminate',18,NULL),
(19,7,'Unknown',19,NULL);
/*!40000 ALTER TABLE `csv_columns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `csv_data`
--

DROP TABLE IF EXISTS `csv_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `csv_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_id` int(11) DEFAULT NULL,
  `row_number` int(11) NOT NULL,
  `column_id` int(11) DEFAULT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `column_id` (`column_id`),
  CONSTRAINT `csv_data_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `csv_files` (`id`),
  CONSTRAINT `csv_data_ibfk_2` FOREIGN KEY (`column_id`) REFERENCES `csv_columns` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=837 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csv_data`
--

LOCK TABLES `csv_data` WRITE;
/*!40000 ALTER TABLE `csv_data` DISABLE KEYS */;
INSERT INTO `csv_data` VALUES
(1,7,1,1,'1'),
(2,7,1,2,'-61'),
(3,7,1,3,'0'),
(4,7,1,4,'2'),
(5,7,1,5,'25.3012'),
(6,7,1,6,'6.506'),
(7,7,1,7,'1.2048'),
(8,7,1,8,'27.4699'),
(9,7,1,9,'22.4096'),
(10,7,1,10,'2.1687'),
(11,7,1,11,'0.241'),
(12,7,1,12,'0.241'),
(13,7,1,13,'0.4819'),
(14,7,1,14,'0.7229'),
(15,7,1,15,'0'),
(16,7,1,16,'1.4458'),
(17,7,1,17,'5.5422'),
(18,7,1,18,'4.5783'),
(19,7,1,19,'0.9639'),
(20,7,2,1,'2'),
(21,7,2,2,'-40'),
(22,7,2,3,'1'),
(23,7,2,4,'3'),
(24,7,2,5,'32.9177'),
(25,7,2,6,'7.4813'),
(26,7,2,7,'0.2494'),
(27,7,2,8,'18.2045'),
(28,7,2,9,'22.4439'),
(29,7,2,10,'1.2469'),
(30,7,2,11,'0.4988'),
(31,7,2,12,'0.2494'),
(32,7,2,13,'0.2494'),
(33,7,2,14,'0.4988'),
(34,7,2,15,'0.2494'),
(35,7,2,16,'0.4988'),
(36,7,2,17,'9.9751'),
(37,7,2,18,'2.9925'),
(38,7,2,19,'0.9975'),
(39,7,3,1,'3'),
(40,7,3,2,'1'),
(41,7,3,3,'3'),
(42,7,3,4,'5'),
(43,7,3,5,'29.7297'),
(44,7,3,6,'6.1425'),
(45,7,3,7,'0.9828'),
(46,7,3,8,'25.0614'),
(47,7,3,9,'16.7076'),
(48,7,3,10,'2.2113'),
(49,7,3,11,'0.7371'),
(50,7,3,12,'0.4914'),
(51,7,3,13,'0.9828'),
(52,7,3,14,'0.4914'),
(53,7,3,15,'0.4914'),
(54,7,3,16,'0.4914'),
(55,7,3,17,'9.0909'),
(56,7,3,18,'3.4398'),
(57,7,3,19,'0.4914'),
(58,7,4,1,'4'),
(59,7,4,2,'22'),
(60,7,4,3,'4'),
(61,7,4,4,'6'),
(62,7,4,5,'30.7692'),
(63,7,4,6,'14.1439'),
(64,7,4,7,'0.7444'),
(65,7,4,8,'17.3697'),
(66,7,4,9,'15.8809'),
(67,7,4,10,'1.2407'),
(68,7,4,11,'0.2481'),
(69,7,4,12,'0'),
(70,7,4,13,'0.9926'),
(71,7,4,14,'0'),
(72,7,4,15,'0.4963'),
(73,7,4,16,'0.7444'),
(74,7,4,17,'9.4293'),
(75,7,4,18,'6.9479'),
(76,7,4,19,'0'),
(77,7,5,1,'5'),
(78,7,5,2,'43'),
(79,7,5,3,'5'),
(80,7,5,4,'7'),
(81,7,5,5,'31.9712'),
(82,7,5,6,'9.1346'),
(83,7,5,7,'0.4808'),
(84,7,5,8,'18.2692'),
(85,7,5,9,'18.5096'),
(86,7,5,10,'1.4423'),
(87,7,5,11,'0.7212'),
(88,7,5,12,'0.2404'),
(89,7,5,13,'0.9615'),
(90,7,5,14,'0.4808'),
(91,7,5,15,'0.2404'),
(92,7,5,16,'0.4808'),
(93,7,5,17,'10.5769'),
(94,7,5,18,'3.6058'),
(95,7,5,19,'0.4808'),
(96,7,6,1,'6'),
(97,7,6,2,'66'),
(98,7,6,3,'6'),
(99,7,6,4,'8'),
(100,7,6,5,'32.4937'),
(101,7,6,6,'10.3275'),
(102,7,6,7,'0.7557'),
(103,7,6,8,'14.6096'),
(104,7,6,9,'11.0831'),
(105,7,6,10,'1.5113'),
(106,7,6,11,'0.5038'),
(107,7,6,12,'0.2519'),
(108,7,6,13,'1.2594'),
(109,7,6,14,'0'),
(110,7,6,15,'0.7557'),
(111,7,6,16,'0.7557'),
(112,7,6,17,'13.3501'),
(113,7,6,18,'9.068'),
(114,7,6,19,'1.7632'),
(115,7,7,1,'7'),
(116,7,7,2,'113'),
(117,7,7,3,'8'),
(118,7,7,4,'10'),
(119,7,7,5,'48.6081'),
(120,7,7,6,'6.424'),
(121,7,7,7,'0.6424'),
(122,7,7,8,'10.0642'),
(123,7,7,9,'13.4904'),
(124,7,7,10,'1.9272'),
(125,7,7,11,'0.4283'),
(126,7,7,12,'0'),
(127,7,7,13,'0.8565'),
(128,7,7,14,'0.4283'),
(129,7,7,15,'0.4283'),
(130,7,7,16,'0.6424'),
(131,7,7,17,'7.0664'),
(132,7,7,18,'6.8522'),
(133,7,7,19,'0.2141'),
(134,7,8,1,'8'),
(135,7,8,2,'160'),
(136,7,8,3,'10'),
(137,7,8,4,'12'),
(138,7,8,5,'40.5'),
(139,7,8,6,'13'),
(140,7,8,7,'0.25'),
(141,7,8,8,'16'),
(142,7,8,9,'9'),
(143,7,8,10,'4.75'),
(144,7,8,11,'0.25'),
(145,7,8,12,'0.25'),
(146,7,8,13,'0.25'),
(147,7,8,14,'0.5'),
(148,7,8,15,'0.5'),
(149,7,8,16,'1'),
(150,7,8,17,'5.75'),
(151,7,8,18,'5.5'),
(152,7,8,19,'0'),
(153,7,9,1,'9'),
(154,7,9,2,'220'),
(155,7,9,3,'12'),
(156,7,9,4,'14'),
(157,7,9,5,'39.5522'),
(158,7,9,6,'13.6816'),
(159,7,9,7,'0.995'),
(160,7,9,8,'10.4478'),
(161,7,9,9,'11.194'),
(162,7,9,10,'5.2239'),
(163,7,9,11,'0'),
(164,7,9,12,'0.2488'),
(165,7,9,13,'0'),
(166,7,9,14,'0.995'),
(167,7,9,15,'0.4975'),
(168,7,9,16,'0.995'),
(169,7,9,17,'4.4776'),
(170,7,9,18,'6.4677'),
(171,7,9,19,'1.99'),
(172,7,10,1,'10'),
(173,7,10,2,'278'),
(174,7,10,3,'14'),
(175,7,10,4,'16'),
(176,7,10,5,'44.8529'),
(177,7,10,6,'14.7059'),
(178,7,10,7,'0.7353'),
(179,7,10,8,'9.8039'),
(180,7,10,9,'8.5784'),
(181,7,10,10,'4.1667'),
(182,7,10,11,'0.2451'),
(183,7,10,12,'0.4902'),
(184,7,10,13,'0.9804'),
(185,7,10,14,'0.2451'),
(186,7,10,15,'1.2255'),
(187,7,10,16,'0.4902'),
(188,7,10,17,'7.1078'),
(189,7,10,18,'3.6765'),
(190,7,10,19,'0.4902'),
(191,7,11,1,'11'),
(192,7,11,2,'340'),
(193,7,11,3,'16'),
(194,7,11,4,'18'),
(195,7,11,5,'45.6221'),
(196,7,11,6,'10.8295'),
(197,7,11,7,'0.9217'),
(198,7,11,8,'9.6774'),
(199,7,11,9,'13.3641'),
(200,7,11,10,'2.9954'),
(201,7,11,11,'0.9217'),
(202,7,11,12,'0.6912'),
(203,7,11,13,'0.4608'),
(204,7,11,14,'1.1521'),
(205,7,11,15,'0.2304'),
(206,7,11,16,'0.9217'),
(207,7,11,17,'5.7604'),
(208,7,11,18,'4.3779'),
(209,7,11,19,'0.6912'),
(210,7,12,1,'12'),
(211,7,12,2,'372'),
(212,7,12,3,'17'),
(213,7,12,4,'19'),
(214,7,12,5,'48.9157'),
(215,7,12,6,'9.3976'),
(216,7,12,7,'1.2048'),
(217,7,12,8,'10.6024'),
(218,7,12,9,'11.3253'),
(219,7,12,10,'2.6506'),
(220,7,12,11,'0.241'),
(221,7,12,12,'0'),
(222,7,12,13,'1.2048'),
(223,7,12,14,'0.241'),
(224,7,12,15,'0'),
(225,7,12,16,'0.241'),
(226,7,12,17,'7.4699'),
(227,7,12,18,'5.0602'),
(228,7,12,19,'0.4819'),
(229,7,13,1,'13'),
(230,7,13,2,'403'),
(231,7,13,3,'18'),
(232,7,13,4,'20'),
(233,7,13,5,'47.2772'),
(234,7,13,6,'10.8911'),
(235,7,13,7,'0.495'),
(236,7,13,8,'11.1386'),
(237,7,13,9,'9.4059'),
(238,7,13,10,'2.7228'),
(239,7,13,11,'0.495'),
(240,7,13,12,'0'),
(241,7,13,13,'0.7426'),
(242,7,13,14,'0.495'),
(243,7,13,15,'0.7426'),
(244,7,13,16,'1.9802'),
(245,7,13,17,'3.4653'),
(246,7,13,18,'3.7129'),
(247,7,13,19,'3.2178'),
(248,7,14,1,'14'),
(249,7,14,2,'466'),
(250,7,14,3,'20'),
(251,7,14,4,'22'),
(252,7,14,5,'41.0628'),
(253,7,14,6,'14.2512'),
(254,7,14,7,'0.2415'),
(255,7,14,8,'11.3527'),
(256,7,14,9,'10.3865'),
(257,7,14,10,'2.4155'),
(258,7,14,11,'1.2077'),
(259,7,14,12,'0'),
(260,7,14,13,'0.9662'),
(261,7,14,14,'1.2077'),
(262,7,14,15,'0.9662'),
(263,7,14,16,'1.6908'),
(264,7,14,17,'7.2464'),
(265,7,14,18,'3.6232'),
(266,7,14,19,'0.9662'),
(267,7,15,1,'15'),
(268,7,15,2,'501'),
(269,7,15,3,'21'),
(270,7,15,4,'23'),
(271,7,15,5,'48.5915'),
(272,7,15,6,'6.338'),
(273,7,15,7,'0.4695'),
(274,7,15,8,'14.7887'),
(275,7,15,9,'12.6761'),
(276,7,15,10,'0.2347'),
(277,7,15,11,'0.2347'),
(278,7,15,12,'0.7042'),
(279,7,15,13,'1.8779'),
(280,7,15,14,'1.1737'),
(281,7,15,15,'0.4695'),
(282,7,15,16,'1.1737'),
(283,7,15,17,'5.8685'),
(284,7,15,18,'3.2864'),
(285,7,15,19,'0'),
(286,7,16,1,'16'),
(287,7,16,2,'538'),
(288,7,16,3,'22'),
(289,7,16,4,'24'),
(290,7,16,5,'47.7723'),
(291,7,16,6,'9.6535'),
(292,7,16,7,'0.495'),
(293,7,16,8,'12.3762'),
(294,7,16,9,'9.4059'),
(295,7,16,10,'2.9703'),
(296,7,16,11,'0.2475'),
(297,7,16,12,'0'),
(298,7,16,13,'0.2475'),
(299,7,16,14,'1.9802'),
(300,7,16,15,'0.495'),
(301,7,16,16,'0.9901'),
(302,7,16,17,'6.1881'),
(303,7,16,18,'3.2178'),
(304,7,16,19,'1.7327'),
(305,7,17,1,'17'),
(306,7,17,2,'574'),
(307,7,17,3,'23'),
(308,7,17,4,'25'),
(309,7,17,5,'49.3671'),
(310,7,17,6,'8.6076'),
(311,7,17,7,'0.2532'),
(312,7,17,8,'13.4177'),
(313,7,17,9,'6.8354'),
(314,7,17,10,'2.0253'),
(315,7,17,11,'0.7595'),
(316,7,17,12,'0.5063'),
(317,7,17,13,'1.0127'),
(318,7,17,14,'0.7595'),
(319,7,17,15,'1.0127'),
(320,7,17,16,'1.519'),
(321,7,17,17,'9.6203'),
(322,7,17,18,'2.7848'),
(323,7,17,19,'0'),
(324,7,18,1,'18'),
(325,7,18,2,'611'),
(326,7,18,3,'24'),
(327,7,18,4,'26'),
(328,7,18,5,'49.0521'),
(329,7,18,6,'9.4787'),
(330,7,18,7,'0.237'),
(331,7,18,8,'12.0853'),
(332,7,18,9,'12.5592'),
(333,7,18,10,'3.5545'),
(334,7,18,11,'0'),
(335,7,18,12,'0.237'),
(336,7,18,13,'0.7109'),
(337,7,18,14,'1.4218'),
(338,7,18,15,'1.1848'),
(339,7,18,16,'1.6588'),
(340,7,18,17,'3.3175'),
(341,7,18,18,'1.8957'),
(342,7,18,19,'0'),
(343,7,19,1,'19'),
(344,7,19,2,'647'),
(345,7,19,3,'25'),
(346,7,19,4,'27'),
(347,7,19,5,'49.3671'),
(348,7,19,6,'8.6076'),
(349,7,19,7,'0.2532'),
(350,7,19,8,'13.4177'),
(351,7,19,9,'6.8354'),
(352,7,19,10,'2.0253'),
(353,7,19,11,'0.7595'),
(354,7,19,12,'0.5063'),
(355,7,19,13,'1.0127'),
(356,7,19,14,'0.7595'),
(357,7,19,15,'1.0127'),
(358,7,19,16,'1.519'),
(359,7,19,17,'9.6203'),
(360,7,19,18,'2.7848'),
(361,7,19,19,'0'),
(362,7,20,1,'20'),
(363,7,20,2,'680'),
(364,7,20,3,'26'),
(365,7,20,4,'28'),
(366,7,20,5,'53.7713'),
(367,7,20,6,'6.326'),
(368,7,20,7,'0'),
(369,7,20,8,'12.1655'),
(370,7,20,9,'8.0292'),
(371,7,20,10,'2.6764'),
(372,7,20,11,'0.9732'),
(373,7,20,12,'0'),
(374,7,20,13,'0.2433'),
(375,7,20,14,'0.9732'),
(376,7,20,15,'1.2165'),
(377,7,20,16,'2.1898'),
(378,7,20,17,'4.3796'),
(379,7,20,18,'6.0827'),
(380,7,20,19,'0.2433'),
(381,7,21,1,'21'),
(382,7,21,2,'746'),
(383,7,21,3,'28'),
(384,7,21,4,'30'),
(385,7,21,5,'48.184'),
(386,7,21,6,'10.4116'),
(387,7,21,7,'0'),
(388,7,21,8,'14.2857'),
(389,7,21,9,'7.9903'),
(390,7,21,10,'2.4213'),
(391,7,21,11,'0.7264'),
(392,7,21,12,'0'),
(393,7,21,13,'0.2421'),
(394,7,21,14,'0.9685'),
(395,7,21,15,'0.7264'),
(396,7,21,16,'1.937'),
(397,7,21,17,'5.8111'),
(398,7,21,18,'2.1792'),
(399,7,21,19,'2.6634'),
(400,7,22,1,'22'),
(401,7,22,2,'812'),
(402,7,22,3,'30'),
(403,7,22,4,'32'),
(404,7,22,5,'42.2803'),
(405,7,22,6,'10.9264'),
(406,7,22,7,'0.2375'),
(407,7,22,8,'11.639'),
(408,7,22,9,'8.7886'),
(409,7,22,10,'2.6128'),
(410,7,22,11,'0.2375'),
(411,7,22,12,'0.7126'),
(412,7,22,13,'0.4751'),
(413,7,22,14,'1.1876'),
(414,7,22,15,'0.7126'),
(415,7,22,16,'2.6128'),
(416,7,22,17,'10.4513'),
(417,7,22,18,'3.3254'),
(418,7,22,19,'1.1876'),
(419,7,23,1,'23'),
(420,7,23,2,'893'),
(421,7,23,3,'32'),
(422,7,23,4,'34'),
(423,7,23,5,'43.75'),
(424,7,23,6,'11.0577'),
(425,7,23,7,'0'),
(426,7,23,8,'12.5'),
(427,7,23,9,'6.7308'),
(428,7,23,10,'2.1635'),
(429,7,23,11,'0.2404'),
(430,7,23,12,'0.2404'),
(431,7,23,13,'0'),
(432,7,23,14,'0.9615'),
(433,7,23,15,'0.7212'),
(434,7,23,16,'1.6827'),
(435,7,23,17,'13.2212'),
(436,7,23,18,'3.6058'),
(437,7,23,19,'1.9231'),
(438,7,24,1,'24'),
(439,7,24,2,'975'),
(440,7,24,3,'34'),
(441,7,24,4,'36'),
(442,7,24,5,'47.0024'),
(443,7,24,6,'7.6739'),
(444,7,24,7,'0.2398'),
(445,7,24,8,'10.0719'),
(446,7,24,9,'9.8321'),
(447,7,24,10,'1.9185'),
(448,7,24,11,'0.2398'),
(449,7,24,12,'0.4796'),
(450,7,24,13,'0.4796'),
(451,7,24,14,'0.2398'),
(452,7,24,15,'0.9592'),
(453,7,24,16,'2.1583'),
(454,7,24,17,'7.6739'),
(455,7,24,18,'8.1535'),
(456,7,24,19,'0'),
(457,7,25,1,'25'),
(458,7,25,2,'1044'),
(459,7,25,3,'36'),
(460,7,25,4,'38'),
(461,7,25,5,'46.3415'),
(462,7,25,6,'7.561'),
(463,7,25,7,'0.7317'),
(464,7,25,8,'12.439'),
(465,7,25,9,'9.5122'),
(466,7,25,10,'3.9024'),
(467,7,25,11,'0.9756'),
(468,7,25,12,'1.2195'),
(469,7,25,13,'0'),
(470,7,25,14,'0.2439'),
(471,7,25,15,'0.9756'),
(472,7,25,16,'1.4634'),
(473,7,25,17,'8.2927'),
(474,7,25,18,'4.6341'),
(475,7,25,19,'0.4878'),
(476,7,26,1,'26'),
(477,7,26,2,'1103'),
(478,7,26,3,'38'),
(479,7,26,4,'40'),
(480,7,26,5,'52.1226'),
(481,7,26,6,'6.1321'),
(482,7,26,7,'0.2358'),
(483,7,26,8,'9.1981'),
(484,7,26,9,'7.3113'),
(485,7,26,10,'2.3585'),
(486,7,26,11,'0.2358'),
(487,7,26,12,'0.4717'),
(488,7,26,13,'0.7075'),
(489,7,26,14,'1.1792'),
(490,7,26,15,'1.1792'),
(491,7,26,16,'1.1792'),
(492,7,26,17,'6.6038'),
(493,7,26,18,'6.3679'),
(494,7,26,19,'2.1226'),
(495,7,27,1,'27'),
(496,7,27,2,'1162'),
(497,7,27,3,'40'),
(498,7,27,4,'42'),
(499,7,27,5,'50.9901'),
(500,7,27,6,'9.1584'),
(501,7,27,7,'0.2475'),
(502,7,27,8,'12.3762'),
(503,7,27,9,'8.9109'),
(504,7,27,10,'1.4851'),
(505,7,27,11,'1.7327'),
(506,7,27,12,'0.2475'),
(507,7,27,13,'1.7327'),
(508,7,27,14,'1.4851'),
(509,7,27,15,'0.495'),
(510,7,27,16,'1.2376'),
(511,7,27,17,'3.9604'),
(512,7,27,18,'3.4653'),
(513,7,27,19,'1.2376'),
(514,7,28,1,'28'),
(515,7,28,2,'1310'),
(516,7,28,3,'42'),
(517,7,28,4,'44'),
(518,7,28,5,'43.6451'),
(519,7,28,6,'8.8729'),
(520,7,28,7,'0'),
(521,7,28,8,'10.0719'),
(522,7,28,9,'11.9904'),
(523,7,28,10,'2.6379'),
(524,7,28,11,'0.7194'),
(525,7,28,12,'0.4796'),
(526,7,28,13,'1.4388'),
(527,7,28,14,'1.199'),
(528,7,28,15,'0.7194'),
(529,7,28,16,'3.1175'),
(530,7,28,17,'4.3165'),
(531,7,28,18,'5.9952'),
(532,7,28,19,'2.8777'),
(533,7,29,1,'29'),
(534,7,29,2,'1383'),
(535,7,29,3,'43'),
(536,7,29,4,'45'),
(537,7,29,5,'51.1278'),
(538,7,29,6,'4.5113'),
(539,7,29,7,'0'),
(540,7,29,8,'14.5363'),
(541,7,29,9,'11.2782'),
(542,7,29,10,'2.5063'),
(543,7,29,11,'0.5013'),
(544,7,29,12,'0'),
(545,7,29,13,'1.0025'),
(546,7,29,14,'1.0025'),
(547,7,29,15,'0.7519'),
(548,7,29,16,'1.0025'),
(549,7,29,17,'5.7644'),
(550,7,29,18,'3.7594'),
(551,7,29,19,'0.2506'),
(552,7,30,1,'30'),
(553,7,30,2,'1457'),
(554,7,30,3,'44'),
(555,7,30,4,'46'),
(556,7,30,5,'43.7811'),
(557,7,30,6,'6.9652'),
(558,7,30,7,'0.7463'),
(559,7,30,8,'12.6866'),
(560,7,30,9,'10.199'),
(561,7,30,10,'1.99'),
(562,7,30,11,'10.9453'),
(563,7,30,12,'0'),
(564,7,30,13,'0.4975'),
(565,7,30,14,'0.7463'),
(566,7,30,15,'0.995'),
(567,7,30,16,'0.7463'),
(568,7,30,17,'3.9801'),
(569,7,30,18,'4.9751'),
(570,7,30,19,'0.2488'),
(571,7,31,1,'31'),
(572,7,31,2,'1554'),
(573,7,31,3,'46'),
(574,7,31,4,'48'),
(575,7,31,5,'54.1667'),
(576,7,31,6,'6.1275'),
(577,7,31,7,'0'),
(578,7,31,8,'12.0098'),
(579,7,31,9,'6.8627'),
(580,7,31,10,'0.7353'),
(581,7,31,11,'0.2451'),
(582,7,31,12,'0.2451'),
(583,7,31,13,'0.9804'),
(584,7,31,14,'0.7353'),
(585,7,31,15,'0.7353'),
(586,7,31,16,'0.9804'),
(587,7,31,17,'10.049'),
(588,7,31,18,'4.902'),
(589,7,31,19,'0.4902'),
(590,7,32,1,'32'),
(591,7,32,2,'1599'),
(592,7,32,3,'47.9'),
(593,7,32,4,'64'),
(594,7,32,5,'45.122'),
(595,7,32,6,'2.9268'),
(596,7,32,7,'0'),
(597,7,32,8,'10'),
(598,7,32,9,'9.0244'),
(599,7,32,10,'2.9268'),
(600,7,32,11,'0'),
(601,7,32,12,'0.2439'),
(602,7,32,13,'0.4878'),
(603,7,32,14,'0'),
(604,7,32,15,'9.5122'),
(605,7,32,16,'4.6341'),
(606,7,32,17,'9.0244'),
(607,7,32,18,'2.439'),
(608,7,32,19,'0.4878'),
(609,7,33,1,'33'),
(610,7,33,2,'1601'),
(611,7,33,3,'48'),
(612,7,33,4,'50'),
(613,7,33,5,'41.5584'),
(614,7,33,6,'9.8701'),
(615,7,33,7,'0'),
(616,7,33,8,'14.026'),
(617,7,33,9,'9.3506'),
(618,7,33,10,'3.1169'),
(619,7,33,11,'0.7792'),
(620,7,33,12,'0.2597'),
(621,7,33,13,'0'),
(622,7,33,14,'0.2597'),
(623,7,33,15,'1.039'),
(624,7,33,16,'0.5195'),
(625,7,33,17,'11.4286'),
(626,7,33,18,'4.9351'),
(627,7,33,19,'1.039'),
(628,7,34,1,'34'),
(629,7,34,2,'1662'),
(630,7,34,3,'50.5'),
(631,7,34,4,'66'),
(632,7,34,5,'46.0094'),
(633,7,34,6,'3.2864'),
(634,7,34,7,'0'),
(635,7,34,8,'7.9812'),
(636,7,34,9,'9.6244'),
(637,7,34,10,'3.9906'),
(638,7,34,11,'0.4695'),
(639,7,34,12,'0.7042'),
(640,7,34,13,'0.2347'),
(641,7,34,14,'0.4695'),
(642,7,34,15,'7.9812'),
(643,7,34,16,'5.6338'),
(644,7,34,17,'10.3286'),
(645,7,34,18,'1.8779'),
(646,7,34,19,'0.2347'),
(647,7,35,1,'35'),
(648,7,35,2,'1760'),
(649,7,35,3,'54.6'),
(650,7,35,4,'69'),
(651,7,35,5,'55.7178'),
(652,7,35,6,'8.7591'),
(653,7,35,7,'0'),
(654,7,35,8,'5.3528'),
(655,7,35,9,'10.219'),
(656,7,35,10,'1.9465'),
(657,7,35,11,'0'),
(658,7,35,12,'0'),
(659,7,35,13,'0.7299'),
(660,7,35,14,'0.4866'),
(661,7,35,15,'1.2165'),
(662,7,35,16,'2.4331'),
(663,7,35,17,'11.1922'),
(664,7,35,18,'0.9732'),
(665,7,35,19,'0'),
(666,7,36,1,'36'),
(667,7,36,2,'1828'),
(668,7,36,3,'57.3'),
(669,7,36,4,'71'),
(670,7,36,5,'47.1264'),
(671,7,36,6,'5.7471'),
(672,7,36,7,'0.2299'),
(673,7,36,8,'7.1264'),
(674,7,36,9,'16.092'),
(675,7,36,10,'0.9195'),
(676,7,36,11,'0.2299'),
(677,7,36,12,'0.2299'),
(678,7,36,13,'0.6897'),
(679,7,36,14,'0.9195'),
(680,7,36,15,'0.4598'),
(681,7,36,16,'1.1494'),
(682,7,36,17,'15.6322'),
(683,7,36,18,'2.069'),
(684,7,36,19,'0'),
(685,7,37,1,'37'),
(686,7,37,2,'1928'),
(687,7,37,3,'61.3'),
(688,7,37,4,'74'),
(689,7,37,5,'59.25'),
(690,7,37,6,'9.25'),
(691,7,37,7,'0'),
(692,7,37,8,'6'),
(693,7,37,9,'9.25'),
(694,7,37,10,'2.75'),
(695,7,37,11,'0'),
(696,7,37,12,'0.25'),
(697,7,37,13,'0.25'),
(698,7,37,14,'0.5'),
(699,7,37,15,'0.25'),
(700,7,37,16,'2'),
(701,7,37,17,'8'),
(702,7,37,18,'1.5'),
(703,7,37,19,'0'),
(704,7,38,1,'38'),
(705,7,38,2,'1993'),
(706,7,38,3,'63.9'),
(707,7,38,4,'76'),
(708,7,38,5,'58.9109'),
(709,7,38,6,'4.2079'),
(710,7,38,7,'0'),
(711,7,38,8,'7.9208'),
(712,7,38,9,'7.4257'),
(713,7,38,10,'2.7228'),
(714,7,38,11,'0.9901'),
(715,7,38,12,'0'),
(716,7,38,13,'0.495'),
(717,7,38,14,'1.4851'),
(718,7,38,15,'0'),
(719,7,38,16,'1.4851'),
(720,7,38,17,'11.6337'),
(721,7,38,18,'1.4851'),
(722,7,38,19,'0'),
(723,7,39,1,'39'),
(724,7,39,2,'2082'),
(725,7,39,3,'68'),
(726,7,39,4,'79'),
(727,7,39,5,'41.4758'),
(728,7,39,6,'4.3257'),
(729,7,39,7,'1.2723'),
(730,7,39,8,'10.1781'),
(731,7,39,9,'9.4148'),
(732,7,39,10,'2.799'),
(733,7,39,11,'0.2545'),
(734,7,39,12,'0.5089'),
(735,7,39,13,'0.2545'),
(736,7,39,14,'1.0178'),
(737,7,39,15,'0'),
(738,7,39,16,'1.5267'),
(739,7,39,17,'24.173'),
(740,7,39,18,'2.5445'),
(741,7,39,19,'0'),
(742,7,40,1,'40'),
(743,7,40,2,'2137'),
(744,7,40,3,'70.7'),
(745,7,40,4,'81'),
(746,7,40,5,'38.9908'),
(747,7,40,6,'4.8165'),
(748,7,40,7,'0.9174'),
(749,7,40,8,'14.2202'),
(750,7,40,9,'11.2385'),
(751,7,40,10,'8.7156'),
(752,7,40,11,'0.6881'),
(753,7,40,12,'0.2294'),
(754,7,40,13,'0.9174'),
(755,7,40,14,'0.9174'),
(756,7,40,15,'0.2294'),
(757,7,40,16,'1.3761'),
(758,7,40,17,'12.844'),
(759,7,40,18,'3.211'),
(760,7,40,19,'0'),
(761,7,41,1,'41'),
(762,7,41,2,'2212'),
(763,7,41,3,'75'),
(764,7,41,4,'87'),
(765,7,41,5,'50.8197'),
(766,7,41,6,'5.7377'),
(767,7,41,7,'0.4098'),
(768,7,41,8,'10.6557'),
(769,7,41,9,'8.6066'),
(770,7,41,10,'3.6885'),
(771,7,41,11,'0.2049'),
(772,7,41,12,'0.2049'),
(773,7,41,13,'3.0738'),
(774,7,41,14,'1.2295'),
(775,7,41,15,'1.6393'),
(776,7,41,16,'1.0246'),
(777,7,41,17,'9.8361'),
(778,7,41,18,'2.459'),
(779,7,41,19,'0'),
(780,7,42,1,'42'),
(781,7,42,2,'2266'),
(782,7,42,3,'78.1'),
(783,7,42,4,'90'),
(784,7,42,5,'42.1801'),
(785,7,42,6,'6.6351'),
(786,7,42,7,'0'),
(787,7,42,8,'6.3981'),
(788,7,42,9,'8.0569'),
(789,7,42,10,'2.6066'),
(790,7,42,11,'0'),
(791,7,42,12,'0.237'),
(792,7,42,13,'8.2938'),
(793,7,42,14,'1.6588'),
(794,7,42,15,'0.4739'),
(795,7,42,16,'1.8957'),
(796,7,42,17,'18.4834'),
(797,7,42,18,'0.9479'),
(798,7,42,19,'0.4739'),
(799,7,43,1,'43'),
(800,7,43,2,'2340'),
(801,7,43,3,'82.2'),
(802,7,43,4,'94'),
(803,7,43,5,'32.8537'),
(804,7,43,6,'5.7554'),
(805,7,43,7,'0.2398'),
(806,7,43,8,'3.3573'),
(807,7,43,9,'9.5923'),
(808,7,43,10,'2.8777'),
(809,7,43,11,'0'),
(810,7,43,12,'0'),
(811,7,43,13,'0.9592'),
(812,7,43,14,'1.6787'),
(813,7,43,15,'0.9592'),
(814,7,43,16,'1.9185'),
(815,7,43,17,'33.8129'),
(816,7,43,18,'3.1175'),
(817,7,43,19,'1.4388'),
(818,7,44,1,'44'),
(819,7,44,2,'3183'),
(820,7,44,3,'113.8'),
(821,7,44,4,'125'),
(822,7,44,5,'59.5078'),
(823,7,44,6,'6.264'),
(824,7,44,7,'0'),
(825,7,44,8,'11.6331'),
(826,7,44,9,'8.5011'),
(827,7,44,10,'1.566'),
(828,7,44,11,'0.2237'),
(829,7,44,12,'0'),
(830,7,44,13,'0.4474'),
(831,7,44,14,'0.8949'),
(832,7,44,15,'0.6711'),
(833,7,44,16,'2.2371'),
(834,7,44,17,'4.2506'),
(835,7,44,18,'1.3423'),
(836,7,44,19,'0');
/*!40000 ALTER TABLE `csv_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `csv_files`
--

DROP TABLE IF EXISTS `csv_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `csv_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `display_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `row_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `csv_files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csv_files`
--

LOCK TABLES `csv_files` WRITE;
/*!40000 ALTER TABLE `csv_files` DISABLE KEYS */;
INSERT INTO `csv_files` VALUES
(7,1,1,'data_Pollen.csv','2024-10-18 07:18:48',44);
/*!40000 ALTER TABLE `csv_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dataset`
--

DROP TABLE IF EXISTS `dataset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dataset` (
  `dataset_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `database_name` varchar(100) NOT NULL,
  `doi` varchar(100) DEFAULT NULL,
  `pis` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dataset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dataset`
--

LOCK TABLES `dataset` WRITE;
/*!40000 ALTER TABLE `dataset` DISABLE KEYS */;
/*!40000 ALTER TABLE `dataset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES
(1,'admin','logentry'),
(3,'auth','group'),
(2,'auth','permission'),
(4,'auth','user'),
(5,'contenttypes','contenttype'),
(7,'myapi','csvfile'),
(8,'myapi','dataset'),
(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES
(1,'contenttypes','0001_initial','2024-09-21 03:07:16.400396'),
(2,'auth','0001_initial','2024-09-21 03:07:16.489716'),
(3,'admin','0001_initial','2024-09-21 03:07:16.522127'),
(4,'admin','0002_logentry_remove_auto_add','2024-09-21 03:07:16.528686'),
(5,'admin','0003_logentry_add_action_flag_choices','2024-09-21 03:07:16.535071'),
(6,'contenttypes','0002_remove_content_type_name','2024-09-21 03:07:16.562704'),
(7,'auth','0002_alter_permission_name_max_length','2024-09-21 03:07:16.581967'),
(8,'auth','0003_alter_user_email_max_length','2024-09-21 03:07:16.594871'),
(9,'auth','0004_alter_user_username_opts','2024-09-21 03:07:16.602273'),
(10,'auth','0005_alter_user_last_login_null','2024-09-21 03:07:16.615482'),
(11,'auth','0006_require_contenttypes_0002','2024-09-21 03:07:16.616086'),
(12,'auth','0007_alter_validators_add_error_messages','2024-09-21 03:07:16.619240'),
(13,'auth','0008_alter_user_username_max_length','2024-09-21 03:07:16.629168'),
(14,'auth','0009_alter_user_last_name_max_length','2024-09-21 03:07:16.635234'),
(15,'auth','0010_alter_group_name_max_length','2024-09-21 03:07:16.646476'),
(16,'auth','0011_update_proxy_permissions','2024-09-21 03:07:16.652803'),
(17,'auth','0012_alter_user_first_name_max_length','2024-09-21 03:07:16.664453'),
(18,'sessions','0001_initial','2024-09-21 03:07:16.679574'),
(19,'myapi','0001_initial','2024-11-12 18:54:31.086088'),
(20,'myapi','0002_alter_dataset_image_data','2024-11-12 19:04:01.951198');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES
('60onkc620q94ymdthdzmx18lbq8fgtaj','.eJxVjMsOgjAUBf-la9PQ0gutS_d8Q3MfrUUNJBRWxn8XEha6PTNz3iritpa41bTEUdRVGXX53Qj5maYDyAOn-6x5ntZlJH0o-qRVD7Ok1-10_w4K1rLX2fRgGUPG3jryfTBeugbEUmLvBE1iR9A4ATZIYAKFrm2Acm79rrH6fAHqzDgr:1srqY9:aFTTY-_SivmCxm-JBDS5YL5EuVA7o1_hNNjfq3DVyJ8','2024-10-05 03:12:45.604073');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `graph_images`
--

DROP TABLE IF EXISTS `graph_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `graph_images` (
  `image_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `image_data` blob DEFAULT NULL,
  `metadata` longtext DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `graph_images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `graph_images`
--

LOCK TABLES `graph_images` WRITE;
/*!40000 ALTER TABLE `graph_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `graph_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `myapi_dataset`
--

DROP TABLE IF EXISTS `myapi_dataset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `myapi_dataset` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `filename` longtext NOT NULL,
  `dataset_type` varchar(50) NOT NULL,
  `csv_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`csv_data`)),
  `visualization_pref` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`visualization_pref`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `image_data` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `myapi_dataset_user_id_35204292_fk_auth_user_id` (`user_id`),
  CONSTRAINT `myapi_dataset_user_id_35204292_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `myapi_dataset`
--

LOCK TABLES `myapi_dataset` WRITE;
/*!40000 ALTER TABLE `myapi_dataset` DISABLE KEYS */;
INSERT INTO `myapi_dataset` VALUES
(1,'','',NULL,NULL,'2024-11-01 22:35:14.296471','2024-11-01 22:35:14.306143','graph.png',1),
(2,'','',NULL,NULL,'2024-11-01 22:35:50.880302','2024-11-01 22:35:50.882608','graph.png',1),
(3,'','',NULL,NULL,'2024-11-01 22:35:59.156428','2024-11-01 22:35:59.156972','graph.png',1),
(4,'','',NULL,NULL,'2024-11-01 22:45:19.548313','2024-11-01 22:45:19.549402','graph.png',1),
(5,'','',NULL,NULL,'2024-11-01 22:48:18.035186','2024-11-01 22:48:18.036063','graph.png',1),
(6,'','',NULL,NULL,'2024-11-01 22:48:20.696338','2024-11-01 22:48:20.697023','graph.png',1),
(7,'','',NULL,NULL,'2024-11-02 01:03:51.885477','2024-11-02 01:03:51.892756','images/graph.png',1),
(8,'','',NULL,NULL,'2024-11-02 01:04:02.057169','2024-11-02 01:04:02.058646','images/graph_cklKemf.png',1),
(9,'','',NULL,NULL,'2024-11-02 01:04:13.700163','2024-11-02 01:04:13.702119','images/graph_mUhpsPq.png',1),
(10,'','',NULL,NULL,'2024-11-02 01:04:37.619225','2024-11-02 01:04:37.622390','images/graph_gfRGR1e.png',1),
(11,'','',NULL,NULL,'2024-11-02 01:04:39.661578','2024-11-02 01:04:39.663571','images/graph_RL6FsAv.png',1),
(12,'','',NULL,NULL,'2024-11-02 01:05:53.849431','2024-11-02 01:05:53.850409','images/graph_1UyyVZp.png',1),
(13,'','',NULL,NULL,'2024-11-02 01:06:05.001940','2024-11-02 01:06:05.005568','images/graph_fsvk1yw.png',1),
(14,'','',NULL,NULL,'2024-11-02 01:06:50.698073','2024-11-02 01:06:50.703566','images/graph_DPGrxTF.png',1),
(15,'','',NULL,NULL,'2024-11-12 20:07:26.308335','2024-11-12 20:07:26.310129','images/graph_ERbaw7G.png',1),
(16,'','',NULL,NULL,'2024-11-12 20:08:38.815705','2024-11-12 20:08:38.817034','images/graph_obFRxZE.png',1),
(17,'','',NULL,NULL,'2024-11-12 20:18:06.580314','2024-11-12 20:18:06.582105','images/graph_CBlN5QD.png',1),
(18,'','',NULL,NULL,'2024-11-12 20:18:57.471478','2024-11-12 20:18:57.472793','images/graph_Soazc5J.png',1),
(19,'','',NULL,NULL,'2024-11-12 20:19:53.571219','2024-11-12 20:19:53.574314','images/graph_QCMl1sM.png',1),
(20,'','',NULL,NULL,'2024-11-12 20:27:05.368627','2024-11-12 20:27:05.372857','images/graph_xCkZiJm.png',1),
(21,'','',NULL,NULL,'2024-11-12 20:32:12.242004','2024-11-12 20:32:12.249153','images/graph_4XMtkVD.png',1),
(22,'','',NULL,NULL,'2024-11-13 02:57:32.724119','2024-11-13 02:57:32.747925','images/graph_R24EZcD.png',1);
/*!40000 ALTER TABLE `myapi_dataset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site`
--

DROP TABLE IF EXISTS `site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site` (
  `site_id` int(11) NOT NULL AUTO_INCREMENT,
  `dataset_id` int(11) NOT NULL,
  `site_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `longitude` decimal(10,8) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `altitude` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`site_id`),
  KEY `dataset_id` (`dataset_id`),
  CONSTRAINT `dataset_id` FOREIGN KEY (`dataset_id`) REFERENCES `dataset` (`dataset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site`
--

LOCK TABLES `site` WRITE;
/*!40000 ALTER TABLE `site` DISABLE KEYS */;
/*!40000 ALTER TABLE `site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visualization_preferences`
--

DROP TABLE IF EXISTS `visualization_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visualization_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_id` int(11) DEFAULT NULL,
  `graph_type` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `x_axis_column_id` int(11) DEFAULT NULL,
  `y_axis_column_id` int(11) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `additional_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_options`)),
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `x_axis_column_id` (`x_axis_column_id`),
  KEY `y_axis_column_id` (`y_axis_column_id`),
  CONSTRAINT `visualization_preferences_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `csv_files` (`id`),
  CONSTRAINT `visualization_preferences_ibfk_2` FOREIGN KEY (`x_axis_column_id`) REFERENCES `csv_columns` (`id`),
  CONSTRAINT `visualization_preferences_ibfk_3` FOREIGN KEY (`y_axis_column_id`) REFERENCES `csv_columns` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visualization_preferences`
--

LOCK TABLES `visualization_preferences` WRITE;
/*!40000 ALTER TABLE `visualization_preferences` DISABLE KEYS */;
INSERT INTO `visualization_preferences` VALUES
(1,7,'bar','blue',1,2,'Example Graph','{\"Stuff\": \"Example Stuff\"}');
/*!40000 ALTER TABLE `visualization_preferences` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-12 19:06:55
