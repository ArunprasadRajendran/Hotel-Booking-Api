/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../../logger';
import { connection } from '../../config/db.config';
import { Bookings } from '../../models/bookinginfo.model';
import { bookingQuery } from './query';

interface BookingInfoInterface {
    createBooking: (data: Bookings) => Promise<any>;
}

export const bookingInfo: BookingInfoInterface = {
    createBooking: (data: Bookings) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for create hotel room booking`);
            const query: string = bookingQuery.createBooking(data);
            connection.query(query, async (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for hotel room booking`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for create hotel room booking`);
                resolve(results);
            });
        }),
};