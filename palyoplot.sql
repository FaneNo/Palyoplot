/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.19-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: palyoplot
-- ------------------------------------------------------
-- Server version	10.6.19-MariaDB-ubu2204

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
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add dataset',7,'add_dataset'),(26,'Can change dataset',7,'change_dataset'),(27,'Can delete dataset',7,'delete_dataset'),(28,'Can view dataset',7,'view_dataset'),(29,'Can add csv file',8,'add_csvfile'),(30,'Can change csv file',8,'change_csvfile'),(31,'Can delete csv file',8,'delete_csvfile'),(32,'Can view csv file',8,'view_csvfile');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$720000$XtbOfmZei5Z8Ni79ROpue5$r+TfeRFAQUj+Q6onHEhC8QyDuJ0QySgTeMx3V51EA14=','2024-11-05 04:02:58.131096',1,'csc190191','','','',1,1,'2024-09-21 03:12:27.962565'),(2,'pbkdf2_sha256$720000$qYKS1NDwYNtLbrvGl5Lyk1$8pLjvPtriRbOTMPhT5A8fZkfQLJC9Titmvy6FyVrwWc=',NULL,0,'test','','','123@gmail.com',0,1,'2024-09-21 03:19:26.366036'),(19,'pbkdf2_sha256$720000$mgIGg8opSJXTcIeEY0C4O0$ZbK13Go3GFsmt5YJTO1wZIhkEtGQ4QiylROoo+sEMCI=',NULL,0,'testuser_mb2mzsf6','','','test_mb2mzsf6@example.com',0,1,'2024-11-07 09:58:13.094255'),(20,'pbkdf2_sha256$720000$XGRSv3U6SBHsTz0qR53swv$DtIb7xCsA+81WtygaKCnpGOjV7iffl9rqHmeo9e/YQU=',NULL,0,'testuser_pizg7thb','','','test_pizg7thb@example.com',0,1,'2024-11-07 10:00:56.547732');
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
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csv_columns`
--

LOCK TABLES `csv_columns` WRITE;
/*!40000 ALTER TABLE `csv_columns` DISABLE KEYS */;
INSERT INTO `csv_columns` VALUES (1,1,'',1,NULL),(2,1,'age',2,NULL),(3,1,'adj_depth',3,NULL),(4,1,'core_depth',4,NULL),(5,1,'Pinus',5,NULL),(6,1,'Cupressaceae',6,NULL),(7,1,'Fraxinus',7,NULL),(8,1,'Abies',8,NULL),(9,1,'Quercus',9,NULL),(10,1,'Rosaceae',10,NULL),(11,1,'Chrysolepis',11,NULL),(12,1,'Artemisia',12,NULL),(13,1,'Salix',13,NULL),(14,1,'Amaranthaceae',14,NULL),(15,1,'Apiaceae',15,NULL),(16,1,'Asteracea',16,NULL),(17,1,'Poaceae',17,NULL),(18,1,'Indeterminate',18,NULL),(19,1,'Unknown',19,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=7041 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csv_data`
--

LOCK TABLES `csv_data` WRITE;
/*!40000 ALTER TABLE `csv_data` DISABLE KEYS */;
INSERT INTO `csv_data` VALUES (1,1,1,1,'1'),(2,1,1,2,'-61'),(3,1,1,3,'0'),(4,1,1,4,'2'),(5,1,1,5,'25.3012'),(6,1,1,6,'6.506'),(7,1,1,7,'1.2048'),(8,1,1,8,'27.4699'),(9,1,1,9,'22.4096'),(10,1,1,10,'2.1687'),(11,1,1,11,'0.241'),(12,1,1,12,'0.241'),(13,1,1,13,'0.4819'),(14,1,1,14,'0.7229'),(15,1,1,15,'0'),(16,1,1,16,'1.4458'),(17,1,1,17,'5.5422'),(18,1,1,18,'4.5783'),(19,1,1,19,'0.9639'),(20,1,2,1,'2'),(21,1,2,2,'-40'),(22,1,2,3,'1'),(23,1,2,4,'3'),(24,1,2,5,'32.9177'),(25,1,2,6,'7.4813'),(26,1,2,7,'0.2494'),(27,1,2,8,'18.2045'),(28,1,2,9,'22.4439'),(29,1,2,10,'1.2469'),(30,1,2,11,'0.4988'),(31,1,2,12,'0.2494'),(32,1,2,13,'0.2494'),(33,1,2,14,'0.4988'),(34,1,2,15,'0.2494'),(35,1,2,16,'0.4988'),(36,1,2,17,'9.9751'),(37,1,2,18,'2.9925'),(38,1,2,19,'0.9975'),(39,1,3,1,'3'),(40,1,3,2,'1'),(41,1,3,3,'3'),(42,1,3,4,'5'),(43,1,3,5,'29.7297'),(44,1,3,6,'6.1425'),(45,1,3,7,'0.9828'),(46,1,3,8,'25.0614'),(47,1,3,9,'16.7076'),(48,1,3,10,'2.2113'),(49,1,3,11,'0.7371'),(50,1,3,12,'0.4914'),(51,1,3,13,'0.9828'),(52,1,3,14,'0.4914'),(53,1,3,15,'0.4914'),(54,1,3,16,'0.4914'),(55,1,3,17,'9.0909'),(56,1,3,18,'3.4398'),(57,1,3,19,'0.4914'),(58,1,4,1,'4'),(59,1,4,2,'22'),(60,1,4,3,'4'),(61,1,4,4,'6'),(62,1,4,5,'30.7692'),(63,1,4,6,'14.1439'),(64,1,4,7,'0.7444'),(65,1,4,8,'17.3697'),(66,1,4,9,'15.8809'),(67,1,4,10,'1.2407'),(68,1,4,11,'0.2481'),(69,1,4,12,'0'),(70,1,4,13,'0.9926'),(71,1,4,14,'0'),(72,1,4,15,'0.4963'),(73,1,4,16,'0.7444'),(74,1,4,17,'9.4293'),(75,1,4,18,'6.9479'),(76,1,4,19,'0'),(77,1,5,1,'5'),(78,1,5,2,'43'),(79,1,5,3,'5'),(80,1,5,4,'7'),(81,1,5,5,'31.9712'),(82,1,5,6,'9.1346'),(83,1,5,7,'0.4808'),(84,1,5,8,'18.2692'),(85,1,5,9,'18.5096'),(86,1,5,10,'1.4423'),(87,1,5,11,'0.7212'),(88,1,5,12,'0.2404'),(89,1,5,13,'0.9615'),(90,1,5,14,'0.4808'),(91,1,5,15,'0.2404'),(92,1,5,16,'0.4808'),(93,1,5,17,'10.5769'),(94,1,5,18,'3.6058'),(95,1,5,19,'0.4808'),(96,1,6,1,'6'),(97,1,6,2,'66'),(98,1,6,3,'6'),(99,1,6,4,'8'),(100,1,6,5,'32.4937'),(101,1,6,6,'10.3275'),(102,1,6,7,'0.7557'),(103,1,6,8,'14.6096'),(104,1,6,9,'11.0831'),(105,1,6,10,'1.5113'),(106,1,6,11,'0.5038'),(107,1,6,12,'0.2519'),(108,1,6,13,'1.2594'),(109,1,6,14,'0'),(110,1,6,15,'0.7557'),(111,1,6,16,'0.7557'),(112,1,6,17,'13.3501'),(113,1,6,18,'9.068'),(114,1,6,19,'1.7632'),(115,1,7,1,'7'),(116,1,7,2,'113'),(117,1,7,3,'8'),(118,1,7,4,'10'),(119,1,7,5,'48.6081'),(120,1,7,6,'6.424'),(121,1,7,7,'0.6424'),(122,1,7,8,'10.0642'),(123,1,7,9,'13.4904'),(124,1,7,10,'1.9272'),(125,1,7,11,'0.4283'),(126,1,7,12,'0'),(127,1,7,13,'0.8565'),(128,1,7,14,'0.4283'),(129,1,7,15,'0.4283'),(130,1,7,16,'0.6424'),(131,1,7,17,'7.0664'),(132,1,7,18,'6.8522'),(133,1,7,19,'0.2141'),(134,1,8,1,'8'),(135,1,8,2,'160'),(136,1,8,3,'10'),(137,1,8,4,'12'),(138,1,8,5,'40.5'),(139,1,8,6,'13'),(140,1,8,7,'0.25'),(141,1,8,8,'16'),(142,1,8,9,'9'),(143,1,8,10,'4.75'),(144,1,8,11,'0.25'),(145,1,8,12,'0.25'),(146,1,8,13,'0.25'),(147,1,8,14,'0.5'),(148,1,8,15,'0.5'),(149,1,8,16,'1'),(150,1,8,17,'5.75'),(151,1,8,18,'5.5'),(152,1,8,19,'0'),(153,1,9,1,'9'),(154,1,9,2,'220'),(155,1,9,3,'12'),(156,1,9,4,'14'),(157,1,9,5,'39.5522'),(158,1,9,6,'13.6816'),(159,1,9,7,'0.995'),(160,1,9,8,'10.4478'),(161,1,9,9,'11.194'),(162,1,9,10,'5.2239'),(163,1,9,11,'0'),(164,1,9,12,'0.2488'),(165,1,9,13,'0'),(166,1,9,14,'0.995'),(167,1,9,15,'0.4975'),(168,1,9,16,'0.995'),(169,1,9,17,'4.4776'),(170,1,9,18,'6.4677'),(171,1,9,19,'1.99'),(172,1,10,1,'10'),(173,1,10,2,'278'),(174,1,10,3,'14'),(175,1,10,4,'16'),(176,1,10,5,'44.8529'),(177,1,10,6,'14.7059'),(178,1,10,7,'0.7353'),(179,1,10,8,'9.8039'),(180,1,10,9,'8.5784'),(181,1,10,10,'4.1667'),(182,1,10,11,'0.2451'),(183,1,10,12,'0.4902'),(184,1,10,13,'0.9804'),(185,1,10,14,'0.2451'),(186,1,10,15,'1.2255'),(187,1,10,16,'0.4902'),(188,1,10,17,'7.1078'),(189,1,10,18,'3.6765'),(190,1,10,19,'0.4902'),(191,1,11,1,'11'),(192,1,11,2,'340'),(193,1,11,3,'16'),(194,1,11,4,'18'),(195,1,11,5,'45.6221'),(196,1,11,6,'10.8295'),(197,1,11,7,'0.9217'),(198,1,11,8,'9.6774'),(199,1,11,9,'13.3641'),(200,1,11,10,'2.9954'),(201,1,11,11,'0.9217'),(202,1,11,12,'0.6912'),(203,1,11,13,'0.4608'),(204,1,11,14,'1.1521'),(205,1,11,15,'0.2304'),(206,1,11,16,'0.9217'),(207,1,11,17,'5.7604'),(208,1,11,18,'4.3779'),(209,1,11,19,'0.6912'),(210,1,12,1,'12'),(211,1,12,2,'372'),(212,1,12,3,'17'),(213,1,12,4,'19'),(214,1,12,5,'48.9157'),(215,1,12,6,'9.3976'),(216,1,12,7,'1.2048'),(217,1,12,8,'10.6024'),(218,1,12,9,'11.3253'),(219,1,12,10,'2.6506'),(220,1,12,11,'0.241'),(221,1,12,12,'0'),(222,1,12,13,'1.2048'),(223,1,12,14,'0.241'),(224,1,12,15,'0'),(225,1,12,16,'0.241'),(226,1,12,17,'7.4699'),(227,1,12,18,'5.0602'),(228,1,12,19,'0.4819'),(229,1,13,1,'13'),(230,1,13,2,'403'),(231,1,13,3,'18'),(232,1,13,4,'20'),(233,1,13,5,'47.2772'),(234,1,13,6,'10.8911'),(235,1,13,7,'0.495'),(236,1,13,8,'11.1386'),(237,1,13,9,'9.4059'),(238,1,13,10,'2.7228'),(239,1,13,11,'0.495'),(240,1,13,12,'0'),(241,1,13,13,'0.7426'),(242,1,13,14,'0.495'),(243,1,13,15,'0.7426'),(244,1,13,16,'1.9802'),(245,1,13,17,'3.4653'),(246,1,13,18,'3.7129'),(247,1,13,19,'3.2178'),(248,1,14,1,'14'),(249,1,14,2,'466'),(250,1,14,3,'20'),(251,1,14,4,'22'),(252,1,14,5,'41.0628'),(253,1,14,6,'14.2512'),(254,1,14,7,'0.2415'),(255,1,14,8,'11.3527'),(256,1,14,9,'10.3865'),(257,1,14,10,'2.4155'),(258,1,14,11,'1.2077'),(259,1,14,12,'0'),(260,1,14,13,'0.9662'),(261,1,14,14,'1.2077'),(262,1,14,15,'0.9662'),(263,1,14,16,'1.6908'),(264,1,14,17,'7.2464'),(265,1,14,18,'3.6232'),(266,1,14,19,'0.9662'),(267,1,15,1,'15'),(268,1,15,2,'501'),(269,1,15,3,'21'),(270,1,15,4,'23'),(271,1,15,5,'48.5915'),(272,1,15,6,'6.338'),(273,1,15,7,'0.4695'),(274,1,15,8,'14.7887'),(275,1,15,9,'12.6761'),(276,1,15,10,'0.2347'),(277,1,15,11,'0.2347'),(278,1,15,12,'0.7042'),(279,1,15,13,'1.8779'),(280,1,15,14,'1.1737'),(281,1,15,15,'0.4695'),(282,1,15,16,'1.1737'),(283,1,15,17,'5.8685'),(284,1,15,18,'3.2864'),(285,1,15,19,'0'),(286,1,16,1,'16'),(287,1,16,2,'538'),(288,1,16,3,'22'),(289,1,16,4,'24'),(290,1,16,5,'47.7723'),(291,1,16,6,'9.6535'),(292,1,16,7,'0.495'),(293,1,16,8,'12.3762'),(294,1,16,9,'9.4059'),(295,1,16,10,'2.9703'),(296,1,16,11,'0.2475'),(297,1,16,12,'0'),(298,1,16,13,'0.2475'),(299,1,16,14,'1.9802'),(300,1,16,15,'0.495'),(301,1,16,16,'0.9901'),(302,1,16,17,'6.1881'),(303,1,16,18,'3.2178'),(304,1,16,19,'1.7327'),(305,1,17,1,'17'),(306,1,17,2,'574'),(307,1,17,3,'23'),(308,1,17,4,'25'),(309,1,17,5,'49.3671'),(310,1,17,6,'8.6076'),(311,1,17,7,'0.2532'),(312,1,17,8,'13.4177'),(313,1,17,9,'6.8354'),(314,1,17,10,'2.0253'),(315,1,17,11,'0.7595'),(316,1,17,12,'0.5063'),(317,1,17,13,'1.0127'),(318,1,17,14,'0.7595'),(319,1,17,15,'1.0127'),(320,1,17,16,'1.519'),(321,1,17,17,'9.6203'),(322,1,17,18,'2.7848'),(323,1,17,19,'0'),(324,1,18,1,'18'),(325,1,18,2,'611'),(326,1,18,3,'24'),(327,1,18,4,'26'),(328,1,18,5,'49.0521'),(329,1,18,6,'9.4787'),(330,1,18,7,'0.237'),(331,1,18,8,'12.0853'),(332,1,18,9,'12.5592'),(333,1,18,10,'3.5545'),(334,1,18,11,'0'),(335,1,18,12,'0.237'),(336,1,18,13,'0.7109'),(337,1,18,14,'1.4218'),(338,1,18,15,'1.1848'),(339,1,18,16,'1.6588'),(340,1,18,17,'3.3175'),(341,1,18,18,'1.8957'),(342,1,18,19,'0'),(343,1,19,1,'19'),(344,1,19,2,'647'),(345,1,19,3,'25'),(346,1,19,4,'27'),(347,1,19,5,'49.3671'),(348,1,19,6,'8.6076'),(349,1,19,7,'0.2532'),(350,1,19,8,'13.4177'),(351,1,19,9,'6.8354'),(352,1,19,10,'2.0253'),(353,1,19,11,'0.7595'),(354,1,19,12,'0.5063'),(355,1,19,13,'1.0127'),(356,1,19,14,'0.7595'),(357,1,19,15,'1.0127'),(358,1,19,16,'1.519'),(359,1,19,17,'9.6203'),(360,1,19,18,'2.7848'),(361,1,19,19,'0'),(362,1,20,1,'20'),(363,1,20,2,'680'),(364,1,20,3,'26'),(365,1,20,4,'28'),(366,1,20,5,'53.7713'),(367,1,20,6,'6.326'),(368,1,20,7,'0'),(369,1,20,8,'12.1655'),(370,1,20,9,'8.0292'),(371,1,20,10,'2.6764'),(372,1,20,11,'0.9732'),(373,1,20,12,'0'),(374,1,20,13,'0.2433'),(375,1,20,14,'0.9732'),(376,1,20,15,'1.2165'),(377,1,20,16,'2.1898'),(378,1,20,17,'4.3796'),(379,1,20,18,'6.0827'),(380,1,20,19,'0.2433'),(381,1,21,1,'21'),(382,1,21,2,'746'),(383,1,21,3,'28'),(384,1,21,4,'30'),(385,1,21,5,'48.184'),(386,1,21,6,'10.4116'),(387,1,21,7,'0'),(388,1,21,8,'14.2857'),(389,1,21,9,'7.9903'),(390,1,21,10,'2.4213'),(391,1,21,11,'0.7264'),(392,1,21,12,'0'),(393,1,21,13,'0.2421'),(394,1,21,14,'0.9685'),(395,1,21,15,'0.7264'),(396,1,21,16,'1.937'),(397,1,21,17,'5.8111'),(398,1,21,18,'2.1792'),(399,1,21,19,'2.6634'),(400,1,22,1,'22'),(401,1,22,2,'812'),(402,1,22,3,'30'),(403,1,22,4,'32'),(404,1,22,5,'42.2803'),(405,1,22,6,'10.9264'),(406,1,22,7,'0.2375'),(407,1,22,8,'11.639'),(408,1,22,9,'8.7886'),(409,1,22,10,'2.6128'),(410,1,22,11,'0.2375'),(411,1,22,12,'0.7126'),(412,1,22,13,'0.4751'),(413,1,22,14,'1.1876'),(414,1,22,15,'0.7126'),(415,1,22,16,'2.6128'),(416,1,22,17,'10.4513'),(417,1,22,18,'3.3254'),(418,1,22,19,'1.1876'),(419,1,23,1,'23'),(420,1,23,2,'893'),(421,1,23,3,'32'),(422,1,23,4,'34'),(423,1,23,5,'43.75'),(424,1,23,6,'11.0577'),(425,1,23,7,'0'),(426,1,23,8,'12.5'),(427,1,23,9,'6.7308'),(428,1,23,10,'2.1635'),(429,1,23,11,'0.2404'),(430,1,23,12,'0.2404'),(431,1,23,13,'0'),(432,1,23,14,'0.9615'),(433,1,23,15,'0.7212'),(434,1,23,16,'1.6827'),(435,1,23,17,'13.2212'),(436,1,23,18,'3.6058'),(437,1,23,19,'1.9231'),(438,1,24,1,'24'),(439,1,24,2,'975'),(440,1,24,3,'34'),(441,1,24,4,'36'),(442,1,24,5,'47.0024'),(443,1,24,6,'7.6739'),(444,1,24,7,'0.2398'),(445,1,24,8,'10.0719'),(446,1,24,9,'9.8321'),(447,1,24,10,'1.9185'),(448,1,24,11,'0.2398'),(449,1,24,12,'0.4796'),(450,1,24,13,'0.4796'),(451,1,24,14,'0.2398'),(452,1,24,15,'0.9592'),(453,1,24,16,'2.1583'),(454,1,24,17,'7.6739'),(455,1,24,18,'8.1535'),(456,1,24,19,'0'),(457,1,25,1,'25'),(458,1,25,2,'1044'),(459,1,25,3,'36'),(460,1,25,4,'38'),(461,1,25,5,'46.3415'),(462,1,25,6,'7.561'),(463,1,25,7,'0.7317'),(464,1,25,8,'12.439'),(465,1,25,9,'9.5122'),(466,1,25,10,'3.9024'),(467,1,25,11,'0.9756'),(468,1,25,12,'1.2195'),(469,1,25,13,'0'),(470,1,25,14,'0.2439'),(471,1,25,15,'0.9756'),(472,1,25,16,'1.4634'),(473,1,25,17,'8.2927'),(474,1,25,18,'4.6341'),(475,1,25,19,'0.4878'),(476,1,26,1,'26'),(477,1,26,2,'1103'),(478,1,26,3,'38'),(479,1,26,4,'40'),(480,1,26,5,'52.1226'),(481,1,26,6,'6.1321'),(482,1,26,7,'0.2358'),(483,1,26,8,'9.1981'),(484,1,26,9,'7.3113'),(485,1,26,10,'2.3585'),(486,1,26,11,'0.2358'),(487,1,26,12,'0.4717'),(488,1,26,13,'0.7075'),(489,1,26,14,'1.1792'),(490,1,26,15,'1.1792'),(491,1,26,16,'1.1792'),(492,1,26,17,'6.6038'),(493,1,26,18,'6.3679'),(494,1,26,19,'2.1226'),(495,1,27,1,'27'),(496,1,27,2,'1162'),(497,1,27,3,'40'),(498,1,27,4,'42'),(499,1,27,5,'50.9901'),(500,1,27,6,'9.1584'),(501,1,27,7,'0.2475'),(502,1,27,8,'12.3762'),(503,1,27,9,'8.9109'),(504,1,27,10,'1.4851'),(505,1,27,11,'1.7327'),(506,1,27,12,'0.2475'),(507,1,27,13,'1.7327'),(508,1,27,14,'1.4851'),(509,1,27,15,'0.495'),(510,1,27,16,'1.2376'),(511,1,27,17,'3.9604'),(512,1,27,18,'3.4653'),(513,1,27,19,'1.2376'),(514,1,28,1,'28'),(515,1,28,2,'1310'),(516,1,28,3,'42'),(517,1,28,4,'44'),(518,1,28,5,'43.6451'),(519,1,28,6,'8.8729'),(520,1,28,7,'0'),(521,1,28,8,'10.0719'),(522,1,28,9,'11.9904'),(523,1,28,10,'2.6379'),(524,1,28,11,'0.7194'),(525,1,28,12,'0.4796'),(526,1,28,13,'1.4388'),(527,1,28,14,'1.199'),(528,1,28,15,'0.7194'),(529,1,28,16,'3.1175'),(530,1,28,17,'4.3165'),(531,1,28,18,'5.9952'),(532,1,28,19,'2.8777'),(533,1,29,1,'29'),(534,1,29,2,'1383'),(535,1,29,3,'43'),(536,1,29,4,'45'),(537,1,29,5,'51.1278'),(538,1,29,6,'4.5113'),(539,1,29,7,'0'),(540,1,29,8,'14.5363'),(541,1,29,9,'11.2782'),(542,1,29,10,'2.5063'),(543,1,29,11,'0.5013'),(544,1,29,12,'0'),(545,1,29,13,'1.0025'),(546,1,29,14,'1.0025'),(547,1,29,15,'0.7519'),(548,1,29,16,'1.0025'),(549,1,29,17,'5.7644'),(550,1,29,18,'3.7594'),(551,1,29,19,'0.2506'),(552,1,30,1,'30'),(553,1,30,2,'1457'),(554,1,30,3,'44'),(555,1,30,4,'46'),(556,1,30,5,'43.7811'),(557,1,30,6,'6.9652'),(558,1,30,7,'0.7463'),(559,1,30,8,'12.6866'),(560,1,30,9,'10.199'),(561,1,30,10,'1.99'),(562,1,30,11,'10.9453'),(563,1,30,12,'0'),(564,1,30,13,'0.4975'),(565,1,30,14,'0.7463'),(566,1,30,15,'0.995'),(567,1,30,16,'0.7463'),(568,1,30,17,'3.9801'),(569,1,30,18,'4.9751'),(570,1,30,19,'0.2488'),(571,1,31,1,'31'),(572,1,31,2,'1554'),(573,1,31,3,'46'),(574,1,31,4,'48'),(575,1,31,5,'54.1667'),(576,1,31,6,'6.1275'),(577,1,31,7,'0'),(578,1,31,8,'12.0098'),(579,1,31,9,'6.8627'),(580,1,31,10,'0.7353'),(581,1,31,11,'0.2451'),(582,1,31,12,'0.2451'),(583,1,31,13,'0.9804'),(584,1,31,14,'0.7353'),(585,1,31,15,'0.7353'),(586,1,31,16,'0.9804'),(587,1,31,17,'10.049'),(588,1,31,18,'4.902'),(589,1,31,19,'0.4902'),(590,1,32,1,'32'),(591,1,32,2,'1599'),(592,1,32,3,'47.9'),(593,1,32,4,'64'),(594,1,32,5,'45.122'),(595,1,32,6,'2.9268'),(596,1,32,7,'0'),(597,1,32,8,'10'),(598,1,32,9,'9.0244'),(599,1,32,10,'2.9268'),(600,1,32,11,'0'),(601,1,32,12,'0.2439'),(602,1,32,13,'0.4878'),(603,1,32,14,'0'),(604,1,32,15,'9.5122'),(605,1,32,16,'4.6341'),(606,1,32,17,'9.0244'),(607,1,32,18,'2.439'),(608,1,32,19,'0.4878'),(609,1,33,1,'33'),(610,1,33,2,'1601'),(611,1,33,3,'48'),(612,1,33,4,'50'),(613,1,33,5,'41.5584'),(614,1,33,6,'9.8701'),(615,1,33,7,'0'),(616,1,33,8,'14.026'),(617,1,33,9,'9.3506'),(618,1,33,10,'3.1169'),(619,1,33,11,'0.7792'),(620,1,33,12,'0.2597'),(621,1,33,13,'0'),(622,1,33,14,'0.2597'),(623,1,33,15,'1.039'),(624,1,33,16,'0.5195'),(625,1,33,17,'11.4286'),(626,1,33,18,'4.9351'),(627,1,33,19,'1.039'),(628,1,34,1,'34'),(629,1,34,2,'1662'),(630,1,34,3,'50.5'),(631,1,34,4,'66'),(632,1,34,5,'46.0094'),(633,1,34,6,'3.2864'),(634,1,34,7,'0'),(635,1,34,8,'7.9812'),(636,1,34,9,'9.6244'),(637,1,34,10,'3.9906'),(638,1,34,11,'0.4695'),(639,1,34,12,'0.7042'),(640,1,34,13,'0.2347'),(641,1,34,14,'0.4695'),(642,1,34,15,'7.9812'),(643,1,34,16,'5.6338'),(644,1,34,17,'10.3286'),(645,1,34,18,'1.8779'),(646,1,34,19,'0.2347'),(647,1,35,1,'35'),(648,1,35,2,'1760'),(649,1,35,3,'54.6'),(650,1,35,4,'69'),(651,1,35,5,'55.7178'),(652,1,35,6,'8.7591'),(653,1,35,7,'0'),(654,1,35,8,'5.3528'),(655,1,35,9,'10.219'),(656,1,35,10,'1.9465'),(657,1,35,11,'0'),(658,1,35,12,'0'),(659,1,35,13,'0.7299'),(660,1,35,14,'0.4866'),(661,1,35,15,'1.2165'),(662,1,35,16,'2.4331'),(663,1,35,17,'11.1922'),(664,1,35,18,'0.9732'),(665,1,35,19,'0'),(666,1,36,1,'36'),(667,1,36,2,'1828'),(668,1,36,3,'57.3'),(669,1,36,4,'71'),(670,1,36,5,'47.1264'),(671,1,36,6,'5.7471'),(672,1,36,7,'0.2299'),(673,1,36,8,'7.1264'),(674,1,36,9,'16.092'),(675,1,36,10,'0.9195'),(676,1,36,11,'0.2299'),(677,1,36,12,'0.2299'),(678,1,36,13,'0.6897'),(679,1,36,14,'0.9195'),(680,1,36,15,'0.4598'),(681,1,36,16,'1.1494'),(682,1,36,17,'15.6322'),(683,1,36,18,'2.069'),(684,1,36,19,'0'),(685,1,37,1,'37'),(686,1,37,2,'1928'),(687,1,37,3,'61.3'),(688,1,37,4,'74'),(689,1,37,5,'59.25'),(690,1,37,6,'9.25'),(691,1,37,7,'0'),(692,1,37,8,'6'),(693,1,37,9,'9.25'),(694,1,37,10,'2.75'),(695,1,37,11,'0'),(696,1,37,12,'0.25'),(697,1,37,13,'0.25'),(698,1,37,14,'0.5'),(699,1,37,15,'0.25'),(700,1,37,16,'2'),(701,1,37,17,'8'),(702,1,37,18,'1.5'),(703,1,37,19,'0'),(704,1,38,1,'38'),(705,1,38,2,'1993'),(706,1,38,3,'63.9'),(707,1,38,4,'76'),(708,1,38,5,'58.9109'),(709,1,38,6,'4.2079'),(710,1,38,7,'0'),(711,1,38,8,'7.9208'),(712,1,38,9,'7.4257'),(713,1,38,10,'2.7228'),(714,1,38,11,'0.9901'),(715,1,38,12,'0'),(716,1,38,13,'0.495'),(717,1,38,14,'1.4851'),(718,1,38,15,'0'),(719,1,38,16,'1.4851'),(720,1,38,17,'11.6337'),(721,1,38,18,'1.4851'),(722,1,38,19,'0'),(723,1,39,1,'39'),(724,1,39,2,'2082'),(725,1,39,3,'68'),(726,1,39,4,'79'),(727,1,39,5,'41.4758'),(728,1,39,6,'4.3257'),(729,1,39,7,'1.2723'),(730,1,39,8,'10.1781'),(731,1,39,9,'9.4148'),(732,1,39,10,'2.799'),(733,1,39,11,'0.2545'),(734,1,39,12,'0.5089'),(735,1,39,13,'0.2545'),(736,1,39,14,'1.0178'),(737,1,39,15,'0'),(738,1,39,16,'1.5267'),(739,1,39,17,'24.173'),(740,1,39,18,'2.5445'),(741,1,39,19,'0'),(742,1,40,1,'40'),(743,1,40,2,'2137'),(744,1,40,3,'70.7'),(745,1,40,4,'81'),(746,1,40,5,'38.9908'),(747,1,40,6,'4.8165'),(748,1,40,7,'0.9174'),(749,1,40,8,'14.2202'),(750,1,40,9,'11.2385'),(751,1,40,10,'8.7156'),(752,1,40,11,'0.6881'),(753,1,40,12,'0.2294'),(754,1,40,13,'0.9174'),(755,1,40,14,'0.9174'),(756,1,40,15,'0.2294'),(757,1,40,16,'1.3761'),(758,1,40,17,'12.844'),(759,1,40,18,'3.211'),(760,1,40,19,'0'),(761,1,41,1,'41'),(762,1,41,2,'2212'),(763,1,41,3,'75'),(764,1,41,4,'87'),(765,1,41,5,'50.8197'),(766,1,41,6,'5.7377'),(767,1,41,7,'0.4098'),(768,1,41,8,'10.6557'),(769,1,41,9,'8.6066'),(770,1,41,10,'3.6885'),(771,1,41,11,'0.2049'),(772,1,41,12,'0.2049'),(773,1,41,13,'3.0738'),(774,1,41,14,'1.2295'),(775,1,41,15,'1.6393'),(776,1,41,16,'1.0246'),(777,1,41,17,'9.8361'),(778,1,41,18,'2.459'),(779,1,41,19,'0'),(780,1,42,1,'42'),(781,1,42,2,'2266'),(782,1,42,3,'78.1'),(783,1,42,4,'90'),(784,1,42,5,'42.1801'),(785,1,42,6,'6.6351'),(786,1,42,7,'0'),(787,1,42,8,'6.3981'),(788,1,42,9,'8.0569'),(789,1,42,10,'2.6066'),(790,1,42,11,'0'),(791,1,42,12,'0.237'),(792,1,42,13,'8.2938'),(793,1,42,14,'1.6588'),(794,1,42,15,'0.4739'),(795,1,42,16,'1.8957'),(796,1,42,17,'18.4834'),(797,1,42,18,'0.9479'),(798,1,42,19,'0.4739'),(799,1,43,1,'43'),(800,1,43,2,'2340'),(801,1,43,3,'82.2'),(802,1,43,4,'94'),(803,1,43,5,'32.8537'),(804,1,43,6,'5.7554'),(805,1,43,7,'0.2398'),(806,1,43,8,'3.3573'),(807,1,43,9,'9.5923'),(808,1,43,10,'2.8777'),(809,1,43,11,'0'),(810,1,43,12,'0'),(811,1,43,13,'0.9592'),(812,1,43,14,'1.6787'),(813,1,43,15,'0.9592'),(814,1,43,16,'1.9185'),(815,1,43,17,'33.8129'),(816,1,43,18,'3.1175'),(817,1,43,19,'1.4388'),(818,1,44,1,'44'),(819,1,44,2,'3183'),(820,1,44,3,'113.8'),(821,1,44,4,'125'),(822,1,44,5,'59.5078'),(823,1,44,6,'6.264'),(824,1,44,7,'0'),(825,1,44,8,'11.6331'),(826,1,44,9,'8.5011'),(827,1,44,10,'1.566'),(828,1,44,11,'0.2237'),(829,1,44,12,'0'),(830,1,44,13,'0.4474'),(831,1,44,14,'0.8949'),(832,1,44,15,'0.6711'),(833,1,44,16,'2.2371'),(834,1,44,17,'4.2506'),(835,1,44,18,'1.3423'),(836,1,44,19,'0');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csv_files`
--

LOCK TABLES `csv_files` WRITE;
/*!40000 ALTER TABLE `csv_files` DISABLE KEYS */;
INSERT INTO `csv_files` VALUES (1,1,1,'data_Pollen.csv','2024-11-07 09:13:34',44);
/*!40000 ALTER TABLE `csv_files` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2024-11-07 09:12:05.744224','8','testuser_vrfrgxge',3,'',4,1),(2,'2024-11-07 09:12:11.105114','5','testuser_takaklpu',3,'',4,1),(3,'2024-11-07 09:12:14.847285','7','testuser_lf95hyyu',3,'',4,1),(4,'2024-11-07 09:12:18.926402','4','testuser_kepccchi',3,'',4,1),(5,'2024-11-07 09:12:22.895238','3','testuser_emmm79ue',3,'',4,1),(6,'2024-11-07 09:12:26.756310','6','testuser_2avztp4f',3,'',4,1),(7,'2024-11-07 09:12:30.075831','10','testuser_10nee302',3,'',4,1),(8,'2024-11-07 09:12:33.231552','9','testuser_0nu69vyl',3,'',4,1),(9,'2024-11-07 09:32:21.753462','12','testuser_letfrjn5',3,'',4,1),(10,'2024-11-07 09:32:25.611064','11','testuser_e7ywzw7v',3,'',4,1),(11,'2024-11-07 09:32:30.137270','13','testuser_2x3xwj4q',3,'',4,1),(12,'2024-11-07 09:32:33.521449','14','testuser_16bfyma8',3,'',4,1),(13,'2024-11-07 09:55:42.763571','16','testuser_xlplm8bd',3,'',4,1),(14,'2024-11-07 09:55:47.200042','17','testuser_nljg1eo3',3,'',4,1),(15,'2024-11-07 09:55:51.042002','18','testuser_erqsq89s',3,'',4,1),(16,'2024-11-07 09:55:54.671342','15','testuser_0o6vwbmg',3,'',4,1);
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
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(8,'myapi','csvfile'),(7,'myapi','dataset'),(6,'sessions','session');
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-09-21 03:07:16.400396'),(2,'auth','0001_initial','2024-09-21 03:07:16.489716'),(3,'admin','0001_initial','2024-09-21 03:07:16.522127'),(4,'admin','0002_logentry_remove_auto_add','2024-09-21 03:07:16.528686'),(5,'admin','0003_logentry_add_action_flag_choices','2024-09-21 03:07:16.535071'),(6,'contenttypes','0002_remove_content_type_name','2024-09-21 03:07:16.562704'),(7,'auth','0002_alter_permission_name_max_length','2024-09-21 03:07:16.581967'),(8,'auth','0003_alter_user_email_max_length','2024-09-21 03:07:16.594871'),(9,'auth','0004_alter_user_username_opts','2024-09-21 03:07:16.602273'),(10,'auth','0005_alter_user_last_login_null','2024-09-21 03:07:16.615482'),(11,'auth','0006_require_contenttypes_0002','2024-09-21 03:07:16.616086'),(12,'auth','0007_alter_validators_add_error_messages','2024-09-21 03:07:16.619240'),(13,'auth','0008_alter_user_username_max_length','2024-09-21 03:07:16.629168'),(14,'auth','0009_alter_user_last_name_max_length','2024-09-21 03:07:16.635234'),(15,'auth','0010_alter_group_name_max_length','2024-09-21 03:07:16.646476'),(16,'auth','0011_update_proxy_permissions','2024-09-21 03:07:16.652803'),(17,'auth','0012_alter_user_first_name_max_length','2024-09-21 03:07:16.664453'),(18,'sessions','0001_initial','2024-09-21 03:07:16.679574'),(19,'myapi','0001_initial','2024-11-07 09:08:40.008739');
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
INSERT INTO `django_session` VALUES ('60onkc620q94ymdthdzmx18lbq8fgtaj','.eJxVjMsOgjAUBf-la9PQ0gutS_d8Q3MfrUUNJBRWxn8XEha6PTNz3iritpa41bTEUdRVGXX53Qj5maYDyAOn-6x5ntZlJH0o-qRVD7Ok1-10_w4K1rLX2fRgGUPG3jryfTBeugbEUmLvBE1iR9A4ATZIYAKFrm2Acm79rrH6fAHqzDgr:1srqY9:aFTTY-_SivmCxm-JBDS5YL5EuVA7o1_hNNjfq3DVyJ8','2024-10-05 03:12:45.604073'),('csft2eyqqiyko7922ac4xia1n3f2lu7f','.eJxVjDsOwjAQBe_iGlnYjn-U9DlDtLte4wCypTipEHeHSCmgfTPzXmKCbS3T1nmZ5iQuQonT74ZAD647SHeotyap1XWZUe6KPGiXY0v8vB7u30GBXr61x5R0YLLEYLQJzjlrkKICnS2r6CAOQ_DoIxuFnIksZtAcszXGwVm8P_a_OG8:1t8AmQ:reOVlIV3Ga3hV-Aps1NTyRDNbikxtK3dbFHXgOuz6Ig','2024-11-19 04:02:58.133555'),('iwt8y90b8yrno5miy6r0rnm0jb9jjhk1','.eJxVjMsOgjAUBf-la9PQ0gutS_d8Q3MfrUUNJBRWxn8XEha6PTNz3iritpa41bTEUdRVGXX53Qj5maYDyAOn-6x5ntZlJH0o-qRVD7Ok1-10_w4K1rLX2fRgGUPG3jryfTBeugbEUmLvBE1iR9A4ATZIYAKFrm2Acm79rrH6fAHqzDgr:1t2cvO:EZI8TXw_NSMN_treMm2bWZa962OkCgoWd30EtcURCJw','2024-11-03 20:53:18.939823');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `myapi_dataset`
--

LOCK TABLES `myapi_dataset` WRITE;
/*!40000 ALTER TABLE `myapi_dataset` DISABLE KEYS */;
/*!40000 ALTER TABLE `myapi_dataset` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visualization_preferences`
--

LOCK TABLES `visualization_preferences` WRITE;
/*!40000 ALTER TABLE `visualization_preferences` DISABLE KEYS */;
INSERT INTO `visualization_preferences` VALUES (1,1,'bar','blue',1,2,'Example Graph','{\"Stuff\": \"Example Stuff\"}');
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

-- Dump completed on 2024-11-07  2:03:05
