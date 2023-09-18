import { Request, Response, Router } from 'express';
import { logger } from '../../logger';
import { constant } from '../../../constant';
import { hotelInfo } from '../../database/hotel/hotelinfo';
import { Hotels } from '../../models/hotelinfo.model';

const router: Router = Router();

// get all Hotels
router.get('/hotels', async (req: Request, res: Response) => {
    try {
        logger.info(`Begin Router Execution for get AllHotels`);
        const response: Hotels[] = await hotelInfo.getAllHotels();
        res.send(response);
        logger.info(`End Router Execution for get AllHotels`);
    } catch (error) {
        res.status(constant.INTERNAL_SERVER_ERROR).send(error);
        console.log(error);
        logger.error(`${req.url} - ${error}`);
    }
});

export = router;
