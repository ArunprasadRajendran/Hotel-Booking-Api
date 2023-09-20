-- --------------------------------------------------------
-- Host:                         hotel-bookings.ch8tsmm0xnkk.ap-south-1.rds.amazonaws.com
-- Server version:               10.11.5-MariaDB-log - managed by https://aws.amazon.com/rds/
-- Server OS:                    Linux
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for hotel_booking_db
CREATE DATABASE IF NOT EXISTS `hotel_booking_db` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `hotel_booking_db`;

-- Dumping structure for procedure hotel_booking_db.api_create_booking
DELIMITER //
CREATE PROCEDURE `api_create_booking`(
	IN `data` JSON
)
BEGIN

  DECLARE room_id INT;
  DECLARE guest_id INT;
  DECLARE check_in_date DATE;
  DECLARE check_out_date DATE;
  DECLARE booking_date DATE;
  DECLARE adults INT;
  DECLARE childrens INT;
  DECLARE total_price DOUBLE;
  DECLARE payment_status VARCHAR(50);
  
  DECLARE guest_details LONGTEXT;
  DECLARE first_name VARCHAR(50);
  DECLARE last_name VARCHAR(50);
  DECLARE phone_number BIGINT;
  DECLARE email_id VARCHAR(50);
  DECLARE date_of_birth DATE;
  DECLARE address VARCHAR(100);
  DECLARE city VARCHAR(50);
  DECLARE state VARCHAR(50);
  DECLARE country VARCHAR(50);
  DECLARE postal_code INT;
  DECLARE passport_number VARCHAR(50);
  DECLARE address_proof VARCHAR(500);
  DECLARE errorMessage VARCHAR(50);

  SET room_id = JSON_EXTRACT(data, "$.room_id");
  SET guest_id = JSON_EXTRACT(data, "$.guest_id");
  SET check_in_date = JSON_UNQUOTE(JSON_EXTRACT(data, "$.check_in_date"));
  SET check_out_date = JSON_UNQUOTE(JSON_EXTRACT(data, "$.check_out_date"));
  SET booking_date = JSON_UNQUOTE(JSON_EXTRACT(data, "$.booking_date"));
  SET adults = JSON_EXTRACT(data, "$.adults");
  SET childrens = JSON_EXTRACT(data, "$.childrens");
  SET total_price = JSON_EXTRACT(data, "$.total_price");
  SET payment_status = JSON_UNQUOTE(JSON_EXTRACT(data, "$.payment_status"));
  
  SET guest_details = JSON_UNQUOTE(JSON_EXTRACT(data, '$.guest_details'));
  SET first_name = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.first_name"));
  SET last_name = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.last_name"));
  SET phone_number = JSON_EXTRACT(guest_details, "$.phone_number");
  SET email_id = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.email_id"));
  SET date_of_birth = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.date_of_birth"));
  SET address = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.address"));
  SET city = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.city"));
  SET state = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.state"));
  SET country = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.country"));
  SET postal_code = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.postal_code"));
  SET passport_number = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.passport_number"));
  SET address_proof = JSON_UNQUOTE(JSON_EXTRACT(guest_details, "$.address_proof"));
  
   IF EXISTS (SELECT DISTINCT B.room_id
            FROM Bookings B
            WHERE B.room_id = room_id AND (
                (B.check_in_date >= check_in_date AND B.check_in_date <= check_out_date)
                OR
                (B.check_out_date >= check_in_date AND B.check_out_date <= check_out_date)
                OR
                (B.check_in_date <= check_in_date AND B.check_out_date >= check_out_date)
            ) AND B.active =1) THEN
      SET errorMessage = "Selected room already booked at this time";
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = errorMessage;
   END IF;
	
  -- Check guest_id is alrerady present or not
  IF guest_id IS NOT NULL AND guest_id != 'null' THEN
  
   -- Insert the Bookings record
   INSERT INTO Bookings (room_id, guest_id, check_in_date, check_out_date, booking_date, adults, childrens, total_price, payment_status, created_time, active) 
	VALUES (room_id, guest_id, check_in_date, check_out_date, booking_date, adults, childrens, total_price, payment_status, NOW(), 1);
   	
  ELSE
  
   -- Insert the Guest record
   INSERT INTO Guest (first_name, last_name, phone_number, email_id, date_of_birth, address,city,state,country,postal_code,passport_number,address_proof) 
   VALUES (first_name, last_name, phone_number, email_id, date_of_birth, address,city,state,country,postal_code,passport_number,address_proof);
   SET @last_insert_id = LAST_INSERT_ID();

   -- Insert the Bookings record
   INSERT INTO Bookings (room_id, guest_id, check_in_date, check_out_date, booking_date, adults, childrens, total_price,payment_status, created_time, active) 
	VALUES (room_id, @last_insert_id, check_in_date, check_out_date, booking_date, adults, childrens, total_price,payment_status, NOW(), 1);
   
  END IF;
   
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
