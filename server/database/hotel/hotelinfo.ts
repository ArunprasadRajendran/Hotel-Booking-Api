/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../../logger';
import { connection } from '../../config/db.config';
import { Hotels } from '../../models/hotelinfo.model';
import { hotelQuery } from './query';

interface HotelInfoInterface {
    createHotel: (data: Hotels) => Promise<any>;
    getAllHotels: () => Promise<Hotels[]>;
}

export const hotelInfo: HotelInfoInterface = {
    createHotel: (data: Hotels) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for create hotel`);
            const query: string = hotelQuery.createHotel(data);
            connection.query(query, async (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for create hotel`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for create hotel`);
                resolve(results);
            });
        }),

    getAllHotels: () =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for get AllHotels`);
            const query: any = `SELECT * FROM Hotels where active = 1`;
            connection.query(query, (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for get AllHotels`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for get AllHotels`);
                resolve(results);
            });
        }),
};
