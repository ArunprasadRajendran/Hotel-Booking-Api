/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../../logger';
import { connection } from '../../config/db.config';
import { Rooms } from '../../models/roominfo.model';

interface RoomInfoInterface {
    getAllRooms: (id: number) => Promise<Rooms[]>;
}

export const roomInfo: RoomInfoInterface = {
    getAllRooms: (id) =>
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
};
