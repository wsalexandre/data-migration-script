/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 11.6.2-MariaDB : Database - data-migration
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`data-migration` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;

USE `data-migration`;

/*Table structure for table `facility` */

DROP TABLE IF EXISTS `facility`;

CREATE TABLE `facility` (
  `facilityId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`facilityId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

/*Table structure for table `rentalcontract` */

DROP TABLE IF EXISTS `rentalcontract`;

CREATE TABLE `rentalcontract` (
  `rentalContractId` int(11) NOT NULL AUTO_INCREMENT,
  `unitId` int(11) NOT NULL,
  `renterId` int(11) NOT NULL,
  `startDate` timestamp NOT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `currentAmountOwed` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`rentalContractId`),
  KEY `unitId` (`unitId`),
  KEY `renterId` (`renterId`),
  CONSTRAINT `rentalcontract_ibfk_1` FOREIGN KEY (`unitId`) REFERENCES `unit` (`unitId`),
  CONSTRAINT `rentalcontract_ibfk_2` FOREIGN KEY (`renterId`) REFERENCES `tenant` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

/*Table structure for table `rentalinvoice` */

DROP TABLE IF EXISTS `rentalinvoice`;

CREATE TABLE `rentalinvoice` (
  `invoiceId` int(11) NOT NULL AUTO_INCREMENT,
  `rentalContractId` int(11) NOT NULL,
  `invoiceDueDate` timestamp NOT NULL,
  `invoiceAmount` decimal(10,2) DEFAULT NULL,
  `invoiceBalance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`invoiceId`),
  KEY `rentalContractId` (`rentalContractId`),
  CONSTRAINT `rentalinvoice_ibfk_1` FOREIGN KEY (`rentalContractId`) REFERENCES `rentalcontract` (`rentalContractId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

/*Table structure for table `tenant` */

DROP TABLE IF EXISTS `tenant`;

CREATE TABLE `tenant` (
  `tenantId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `unitId` int(11) NOT NULL AUTO_INCREMENT,
  `facilityId` int(11) NOT NULL,
  `number` varchar(10) NOT NULL,
  `unitWidth` float DEFAULT NULL,
  `unitLength` float DEFAULT NULL,
  `unitHeight` float DEFAULT NULL,
  `unitType` varchar(20) DEFAULT NULL,
  `monthlyRent` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`unitId`),
  KEY `facilityId` (`facilityId`),
  CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`facilityId`) REFERENCES `facility` (`facilityId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
