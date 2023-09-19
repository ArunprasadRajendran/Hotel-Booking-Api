/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { logger } from '../../logger';
import { constant } from '../../../constant';
import { roomInfo } from '../../database/hotel/roominfo';
import { Rooms } from '../../models/roominfo.model';

const router: Router = Router();

// get all rooms by hotel id
router.get('/rooms/:hotelid', async (req: Request, res: Response) => {
    try {
        logger.info(`Begin Router Execution for get AllRooms by hotel id`);
        const hotel_id: number = parseInt(req.params.hotelid);
        const response: Rooms[] = await roomInfo.getAllRooms(hotel_id);
        res.send(response);
        logger.info(`End Router Execution for get AllRooms by hotel id`);
    } catch (error) {
        res.status(constant.INTERNAL_SERVER_ERROR).send(error);
        console.log(error);
        logger.error(`${req.url} - ${error}`);
    }
});

// get available rooms by user information
router.get('/rooms', async (req: Request, res: Response) => {
    try {
        logger.info(`Begin Router Execution for get available rooms by user information`);
        const params: any = req.query;
        const response: Rooms[] = await roomInfo.getAvailableRooms(params);
        res.send(response);
        logger.info(`End Router Execution for get available rooms by user information`);
    } catch (error) {
        res.status(constant.INTERNAL_SERVER_ERROR).send(error);
        console.log(error);
        logger.error(`${req.url} - ${error}`);
    }
});

export = router;
