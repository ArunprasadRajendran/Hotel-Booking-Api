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

-- Dumping structure for procedure hotel_booking_db.api_update_booking
DELIMITER //
CREATE PROCEDURE `api_update_booking`(
	IN `data` JSON
)
BEGIN

  DECLARE id INT;
  DECLARE room_id INT;
  DECLARE check_in_date DATE;
  DECLARE check_out_date DATE;
  DECLARE booking_date DATE;
  DECLARE adults INT;
  DECLARE childrens INT;
  DECLARE total_price DOUBLE;
  DECLARE payment_status VARCHAR(50);
  DECLARE errorMessage VARCHAR(50);
  
  SET id = JSON_EXTRACT(data, "$.id");
  SET room_id = JSON_EXTRACT(data, "$.room_id");
  SET check_in_date = JSON_UNQUOTE(JSON_EXTRACT(data, "$.check_in_date"));
  SET check_out_date = JSON_UNQUOTE(JSON_EXTRACT(data, "$.check_out_date"));
  SET booking_date = JSON_UNQUOTE(JSON_EXTRACT(data, "$.booking_date"));
  SET adults = JSON_EXTRACT(data, "$.adults");
  SET childrens = JSON_EXTRACT(data, "$.childrens");
  SET total_price = JSON_EXTRACT(data, "$.total_price");
  SET payment_status = JSON_UNQUOTE(JSON_EXTRACT(data, "$.payment_status"));
  
	IF EXISTS (SELECT DISTINCT B.room_id
            FROM Bookings B
            WHERE B.room_id = room_id AND (
                (B.check_in_date >= check_in_date AND B.check_in_date <= check_out_date)
                OR
                (B.check_out_date >= check_in_date AND B.check_out_date <= check_out_date)
                OR
                (B.check_in_date <= check_in_date AND B.check_out_date >= check_out_date)
            ) AND B.id != id AND B.active =1) THEN
      SET errorMessage = "Selected room already booked at this time";
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = errorMessage;
   END IF;
   
   Update Bookings B
        SET B.check_in_date = check_in_date,
        B.check_out_date =  check_out_date,
        B.adults = adults, 
        B.childrens = childrens,
        B.total_price = total_price,
        B.payment_status = payment_status,
        B.updated_time = NOW()
        WHERE B.id = id;
  
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
