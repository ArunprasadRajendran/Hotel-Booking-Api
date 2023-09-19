/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../../logger';
import { connection } from '../../config/db.config';
import { Bookings, CancelBooking } from '../../models/bookinginfo.model';
import { bookingQuery } from './query';

interface BookingInfoInterface {
    createBooking: (data: Bookings) => Promise<any>;
    getAllBookings: (id: number) => Promise<Bookings[]>;
    updateBooking: (data: Bookings) => Promise<any>;
    cancelBooking: (params: CancelBooking) => Promise<any>;
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

    getAllBookings: (id: number) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for get all bookings by hotel id`);
            const query: string = bookingQuery.getAllBookings(id);
            connection.query(query, (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for get all bookings by hotel id`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for get all bookings by hotel id`);
                resolve(results);
            });
        }),

    updateBooking: (data: Bookings) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for update Bookings`);
            const query: string = bookingQuery.updateBooking(data);
            connection.query(query, async (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for update bookings`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for update bookings`);
                resolve(results);
            });
        }),

    cancelBooking: (params: CancelBooking) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for cancel booking`);
            const query: string = bookingQuery.cancelBooking(params);
            connection.query(query, async (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for cancel booking`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for cancel booking`);
                resolve(results);
            });
        }),
};
