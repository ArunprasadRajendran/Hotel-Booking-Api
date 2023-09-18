/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from 'winston';
import moment from 'moment';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, label, timestamp, printf } = winston.format;
// Custom format for Logging Mechanism
const logFormat: any = printf(({ level, message, label, timestamp }: any) => {
    return `${label}:${timestamp}:${level}: ${message}`;
});

// Custom rotational transport based on fileSize and number of days
const rotationalTransport: any = new DailyRotateFile({
    filename: `logs/Hotel_Booking-%DATE%.log`,
    maxSize: process.env.MAX_LOG_FILE_SIZE || '10m',
    maxFiles: process.env.MAX_NUMBER_DAYS_LOG_LIFETIME || '3d',
    handleExceptions: true,
    format: combine(
        label({ label: 'Hotel_Booking' }),
        timestamp({
            format: () => {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
        }),
        logFormat,
    ),
    level: process.env.LOG_LEVEL,
});

// Handle Callbacks for rotational logs
rotationalTransport.on('new', (newFilename: string) => {
    logger.debug(`New log file has been created - ${newFilename}`);
});
rotationalTransport.on('rotate', (oldFilename: string, newFilename: string) => {
    logger.debug(`Replace old log file ${oldFilename} with new log file ${newFilename} due to days/file size`);
});
rotationalTransport.on('logRemoved', (removedFileName: string) => {
    logger.debug(`Old log file ${removedFileName} has been removed`);
});

// Create logger instance
export const logger: any = winston.createLogger({
    transports: [rotationalTransport],
    exitOnError: false,
});

// export default logger;
