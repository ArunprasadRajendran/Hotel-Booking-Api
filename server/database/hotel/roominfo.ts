/* eslint-disable */
import { logger } from '../../logger';
import { connection } from '../../config/db.config';
import { RoomFilterParams, Rooms } from '../../models/roominfo.model';
import { roomQuery } from './query';

interface RoomInfoInterface {
    createRoom: (data: Rooms) => Promise<any>;
    getAllRooms: (id: number) => Promise<Rooms[]>;
    getAvailableRooms: (params: RoomFilterParams) => Promise<Rooms[]>;
}

export const roomInfo: RoomInfoInterface = {

    createRoom: (data: Rooms) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for create room`);
            const query: string = roomQuery.createRoom(data);
            connection.query(query, async (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for create room`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for create room`);
                resolve(results);
            });
        }),

    getAllRooms: (id: number) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for get AllRooms by hotel id`);
            const query: any = `SELECT * FROM Rooms where hotel_id = ${id} and active = 1`;
            connection.query(query, (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for get AllRooms by hotel id`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for get AllRooms by hotel id`);
                resolve(results);
            });
        }),

    getAvailableRooms: (params: RoomFilterParams) =>
        new Promise((resolve: any, reject: any) => {
            logger.info(`Begin SQL Execution for get available rooms by user information`);
            const query: any = roomQuery.getAvailableRooms(params);
            connection.query(query, (error: Error, results: any) => {
                if (error) {
                    logger.info(`Something went wrong in execution of SQL Query for get available rooms by user information`);
                    return reject(error);
                }
                logger.info(`End SQL Execution for get available rooms by user information`);
                resolve(results);
            });
        }),
};
