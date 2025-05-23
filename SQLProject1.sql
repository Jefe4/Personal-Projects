-- MySQL Script generated by MySQL Workbench
-- Wed Dec  7 14:23:04 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Game` (
  `idGame` INT NOT NULL,
  `Genre_id` INT NULL,
  `Title` VARCHAR(45) NULL,
  `idPublisher` INT NULL,
  `idRegion` INT NULL,
  `Release_year` INT NULL,
  PRIMARY KEY (`idGame`),
  INDEX `Genre_id_idx` (`Genre_id` ASC) VISIBLE,
  INDEX `Publisher_idx` (`idPublisher` ASC) VISIBLE,
  CONSTRAINT `Genre_id`
    FOREIGN KEY (`Genre_id`)
    REFERENCES `mydb`.`Genre` (`idGenre`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Publisher`
    FOREIGN KEY (`idPublisher`)
    REFERENCES `mydb`.`Publisher` (`idPublisher`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
	ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Genre` (
  `idGenre` INT NOT NULL,
  `Genre_name` VARCHAR(45) NULL,
  PRIMARY KEY (`idGenre`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Library`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Library` (
  `idLibrary` INT NOT NULL,
  `Number_Games` INT NULL,
  PRIMARY KEY (`idLibrary`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Publisher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Publisher` (
  `idPublisher` INT NOT NULL,
  `Publisher_name` VARCHAR(45) NULL,
  PRIMARY KEY (`idPublisher`),
  CONSTRAINT `Publisher_name`
    FOREIGN KEY (`idPublisher`)
    REFERENCES `mydb`.`Game` (`idGame`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Region`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Region` (
  `idRegion` INT NOT NULL,
  `Region_name` VARCHAR(45) NULL,
  PRIMARY KEY (`idRegion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Region_Sale`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Region_Sale` (
  `idRegion_Sale` INT NOT NULL,
  `Genre_id` INT NULL,
  `Num_Sales` INT NULL,
  PRIMARY KEY (`idRegion_Sale`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Store`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Store` (
  `idStore` INT NOT NULL,
  `Games_N_sold` TINYINT NULL,
  `Games_owned` TINYINT NULL,
  `Games_price` INT NULL,
  `Game_release` DATETIME NULL,
  `Game_id` INT NOT NULL,
  PRIMARY KEY (`idStore`, `Game_id`),
  UNIQUE INDEX `Game_id_UNIQUE` (`Game_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `idUser` INT NOT NULL,
  `First_name` VARCHAR(45) NOT NULL,
  `M_I` VARCHAR(1) NULL,
  `Last_name` VARCHAR(45) NOT NULL,
  `Username` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Phone_number` INT NOT NULL,
  `DOB` DATETIME NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(45) NULL,
  `Country` VARCHAR(45) NULL,
  `idLibrary` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Username`),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE,
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `idLibrary_UNIQUE` (`idLibrary` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `mydb`.`Game`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (1, 4, 'Madden 25', 7, 3, 2013);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (2, 4, 'Madden 20', 7, 2, 2019);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (3, 4, '2k16', 1, 1, 2015);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (4, 4, '2k17', 1, 4, 2016);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (5, 5, 'Rayman Legends', 4, 21, 2014);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (6, 2, 'Far Cry 3', 4, 4, 2012);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (7, 7, 'Assassin\'s Creed: Black Flag', 4, 6, 2013);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (8, 9, 'Sekiro: Shadows Die Twice', 2, 3, 2019);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (9, 2, 'Call of Duty 4: Modern Warfare ', 2, 11, 2007);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (10, 8, 'Final Fantasy XIV', 6, 4, 2013);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (11, 9, 'NieR: Automata ', 6, 11, 2017);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (12, 9, 'Dragon Quest XI S: Echoes Of An Elusive Age', 6, 3, 2017);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (13, 10, 'Grand Theft Auto IV', 1, 21, 2008);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (14, 11, 'Fall Guys', 3, 1, 2020);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (15, 11, 'Fortnite Battle Royale', 3, 21, 2017);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (16, 7, 'God of War Ragnork', 5, 2, 2022);
INSERT INTO `mydb`.`Game` (`idGame`, `Genre_id`, `Title`, `idPublisher`, `idRegion`, `Release_year`) VALUES (17, 7, 'Spiderman Miles Morales', 5, 3, 2020);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`Genre`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (1, 'Action');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (2, 'FPS');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (3, 'Adventure');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (4, 'Sports');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (5, 'Platform');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (6, 'Open World');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (7, 'Action Adventure');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (8, 'MMO');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (9, 'Role-Playing');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (10, 'Open World');
INSERT INTO `mydb`.`Genre` (`idGenre`, `Genre_name`) VALUES (11, 'Battle Royale');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`Library`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (1, 20);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (2, 8);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (3, 34);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (4, 4);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (5, 18);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (6, 43);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (7, 9);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (8, 14);
INSERT INTO `mydb`.`Library` (`idLibrary`, `Number_Games`) VALUES (9, 22);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`Publisher`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`Publisher` (`idPublisher`, `Publisher_name`) VALUES (1, 'Take-Two Interactive');
INSERT INTO `mydb`.`Publisher` (`idPublisher`, `Publisher_name`) VALUES (2, 'Activision');
INSERT INTO `mydb`.`Publisher` (`idPublisher`, `Publisher_name`) VALUES (3, 'Epic Games');
INSERT INTO `mydb`.`Publisher` (`idPublisher`, `Publisher_name`) VALUES (4, 'Ubisoft');
INSERT INTO `mydb`.`Publisher` (`idPublisher`, `Publisher_name`) VALUES (5, 'Sony Copmuter Entertainment');
INSERT INTO `mydb`.`Publisher` (`idPublisher`, `Publisher_name`) VALUES (6, 'Square Enix');
INSERT INTO `mydb`.`Publisher` (`idPublisher`, `Publisher_name`) VALUES (7, 'Electronics Art');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`Region`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`Region` (`idRegion`, `Region_name`) VALUES (1, 'Canada, United States');
INSERT INTO `mydb`.`Region` (`idRegion`, `Region_name`) VALUES (2, 'Western Europe, the Middle East, South Africa');
INSERT INTO `mydb`.`Region` (`idRegion`, `Region_name`) VALUES (3, 'Southeast Asia');
INSERT INTO `mydb`.`Region` (`idRegion`, `Region_name`) VALUES (4, 'Central America, South America, and Oceania');
INSERT INTO `mydb`.`Region` (`idRegion`, `Region_name`) VALUES (11, 'Mexico,Bermuda');
INSERT INTO `mydb`.`Region` (`idRegion`, `Region_name`) VALUES (21, 'Egypt, and Japan');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`Region_Sale`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (12, 2, 534,984);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (110, 10, 837,132);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (29, 9, 129,483);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (25, 5, 373,948);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (34, 4, 493,582);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (37, 7, 234,958);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (41, 1, 145,483);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (49, 9, 589,583);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (510, 10, 638,284);
INSERT INTO `mydb`.`Region_Sale` (`idRegion_Sale`, `Genre_id`, `Num_Sales`) VALUES (52, 2, 283,204);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`Store`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (1, 30,923, 37,128, $60, '01/07/2007', 2);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (2, 9,847, 10,843, $70, '09/23/2022', 16);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (3, 18,281, 21,382, $60, '08/19/2016', 4);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (4, 9,273, 11,394, $70, '06/28/2020', 17);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (5, 8,347, 9,482, $60, '09/18/2019', 8);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (6, 8,473, 10,384, $60, '01/07/2007', 2);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (7, 8,238, 8,508, $60, '05/23/2013', 1);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (8, 21,478, 21,478, $70, '09/23/2022', 16);
INSERT INTO `mydb`.`Store` (`idStore`, `Games_N_sold`, `Games_owned`, `Games_price`, `Game_release`, `Game_id`) VALUES (9, 20,238, 23,387, $60, '11/10/2013', 10);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`User`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (1, 'Jessica', 'A', 'William', 'LadyBug', 'JAWilliam@goojoo.com', 302-343-9638, '08/12/98', '********', '2718 Park Place Dr. ', 'USA', '6');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (7, 'Elijah', 'S', 'Davis', 'ThunderCat', 'Catman@yahoop.com', 804-456-7891, '03/12/89', '********', '6469 East Lavender Rd.', 'China', '9');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (3, 'Lewis', 'P', 'Suh', 'Suh321', 'SuhLewis@google.com', 302-649, '08/04/93', '********', '8425 Northpoint CT', 'Japan', '5');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (4, 'Ennis', 'J', 'Jenkins', 'EnnisMan', 'EJenkins@yelp.com', 240-234-1938, '12/22/00', '********', '4525 Running Dr.', 'USA', '7');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (5, 'Oliva', 'T', 'Lawrence', 'PrincessLiv', 'OTLawrence@google.com', 571, '10/19/95', '********', '6254 Mexico Pl. ', 'Mexico', '8');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (6, 'Sharmane', 'K', 'Taylor', 'SharkFin', 'SharShark83@bing.com', 443-183-1938 , '08/06/82', '********', '5425 Playstation Ct', 'Japan', '1');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (2, 'Alex', 'S', 'Jefferson', 'Squadboy', 'JeffAlex@bing.com', 301-564-3241, '02/29/73', '********', '4627 Landover Mills St.', 'Brazil', '2');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (8, 'Jolie', 'R', 'Denson', 'MyHeadItch', 'JD210@hotmail.com', 804-854-284, '01/24/79', '********', '4259 South Boston Ln.', 'Peru', '3');
INSERT INTO `mydb`.`User` (`idUser`, `First_name`, `M_I`, `Last_name`, `Username`, `Email`, `Phone_number`, `DOB`, `Password`, `Address`, `Country`, `idLibrary`) VALUES (9, 'Caleb', 'G', 'Scott', 'YoungJefeHolmes4', 'Poopla@google.com', 240-897-652, '09/10/92', '********', '8829 North France Dr.', 'France', '4');

COMMIT;

