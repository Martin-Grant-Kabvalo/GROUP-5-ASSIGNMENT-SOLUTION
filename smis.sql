-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2023 at 11:43 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smis`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `assessmentID` int(11) NOT NULL,
  `assessmentName` varchar(255) NOT NULL,
  `moduleCode` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`assessmentID`, `assessmentName`, `moduleCode`, `class`) VALUES
(5, 'Test Assessment 5', 'ACC-COA-322', 'BIS3'),
(6, 'Test Assessment 5', 'CIT-OPS-322', 'BIT3'),
(7, 'CVP Analysis', 'ACC-COA-322', 'BIS3'),
(8, 'Cost Allocation', 'ACC-COA-322', 'BIS3'),
(9, 'Portfolio', 'CIT-PRG-321', 'BIS3'),
(10, 'Portfolio', 'CIT-PRG-321', 'BIT3');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `classCode` varchar(255) NOT NULL,
  `className` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`classCode`, `className`) VALUES
('BIS3', 'Information Systems Year 3'),
('BIT2', 'Information Technology 2'),
('BIT3', 'Information Technology Year 3');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `gradeID` int(11) NOT NULL,
  `regNo` varchar(20) DEFAULT NULL,
  `assessmentID` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`gradeID`, `regNo`, `assessmentID`, `score`) VALUES
(1, 'BIS/19/SS/002', 5, 85),
(2, 'BIS/20/SS/004', 5, 99),
(3, 'BIS/20/SS/026', 5, 82),
(5, 'BIT/19/SS/007', 6, 80),
(6, 'BIS/17/SS/030', 7, 30),
(7, 'BIS/19/SS/002', 7, 30),
(8, 'BIS/19/SS/014', 7, 25),
(9, 'BIS/20/SS/004', 7, 45),
(10, 'BIS/20/SS/026', 7, 30),
(11, 'BIT/19/SS/007', 10, 25),
(12, 'BIT/20/SS/007', 10, 30),
(13, 'BIS/17/SS/030', 9, 50),
(14, 'BIS/19/SS/002', 9, 70),
(15, 'BIS/19/SS/014', 9, 60),
(16, 'BIS/20/SS/004', 9, 77),
(17, 'BIS/20/SS/026', 9, 55);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `moduleCode` varchar(255) NOT NULL,
  `moduleName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`moduleCode`, `moduleName`) VALUES
('ACC-COA-322', 'COST ACCOUNTING II'),
('ACC-FIN-425', 'FINANCIAL ACCOUNTING V'),
('CIT-OPS-322', 'OPERATING SYSTEMS II'),
('CIT-PRG-321', 'SCRIPT PROGRAMMING'),
('CIT-RES-321', 'RESEARCH METHODS'),
('CIT-SYS-321', 'INFORMATION SYSTEMS AUDITS');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `regNo` varchar(20) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`regNo`, `firstname`, `lastname`, `gender`, `email`, `class`) VALUES
('BIS/17/SS/030', 'Alfred', 'Onesi', 'Male', 'bis17-aonesi@poly.ac.mw', 'BIS3'),
('BIS/19/SS/002', 'Mary', 'Bwanali', 'Female', 'bis19-mbwanali@poly.ac.mw', 'BIS3'),
('BIS/19/SS/014', 'Shakirah', 'Lundu', 'Female', 'bis19-slundu@poly.ac.mw', 'BIS3'),
('BIS/20/SS/004', 'Martin', 'Kabvalo', 'Male', 'bis20-mkabvalo@poly.ac.mw', 'BIS3'),
('BIS/20/SS/026', 'Jamerah', 'Shaibu', 'Female', 'bis20-jshaibu@poly.ac.mw', 'BIS3'),
('BIS/21/SS/004', 'Grant', 'Kabvalo', 'Male', 'bis21-gkabvalo@poly.ac.mw', 'BIT2'),
('BIT/19/SS/007', 'Gideon', 'Chawinga', 'Male', 'bit19-gchawinga@poly.ac.mw', 'BIT3'),
('BIT/20/SS/007', 'Blessings', 'Isaac', 'Male', 'bit20-bisaac@poly.ac.mw', 'BIT3');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`assessmentID`),
  ADD KEY `moduleCode` (`moduleCode`),
  ADD KEY `fk_assessment_class` (`class`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`classCode`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`gradeID`),
  ADD UNIQUE KEY `unique_grade` (`regNo`,`assessmentID`),
  ADD KEY `assessmentID` (`assessmentID`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`moduleCode`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`regNo`),
  ADD KEY `class` (`class`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `assessmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `gradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`moduleCode`) REFERENCES `modules` (`moduleCode`),
  ADD CONSTRAINT `fk_assessment_class` FOREIGN KEY (`class`) REFERENCES `classes` (`classCode`);

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`regNo`) REFERENCES `students` (`regNo`),
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`assessmentID`) REFERENCES `assessments` (`assessmentID`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`class`) REFERENCES `classes` (`classCode`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
