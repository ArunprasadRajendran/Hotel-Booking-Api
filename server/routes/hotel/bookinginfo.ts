/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { logger } from '../../logger';
import { constant } from '../../../constant';
import { bookingInfo } from '../../database/hotel/bookinginfo';

const router: Router = Router();

// create hotel room booking
router.post('/booking', async (req: Request, res: Response) => {
    try {
        logger.info(`Begin Router Execution for create hotel room booking`);
        const response: any = await bookingInfo.createBooking(req.body);
        res.send(response);
        logger.info(`End Router Execution for create hotel room booking`);
    } catch (error) {
        res.status(constant.INTERNAL_SERVER_ERROR).send(error);
        console.log(error);
        logger.error(`${req.url} - ${error}`);
    }
});

export = router;
