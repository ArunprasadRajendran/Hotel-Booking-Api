import { Request, Response, Router } from 'express';
import { logger } from '../../logger';
import { constant } from '../../../constant';
import { hotelInfo } from '../../database/hotel/hotelinfo';
import { Hostels } from '../../models/hostelinfo.model';

const router: Router = Router();

// get all students
router.get('/allhotels', async (req: Request, res: Response) => {
    try {
        const response: Hostels[] = await hotelInfo.getAllHotels();
        res.send(response);
    } catch (error) {
        res.status(constant.INTERNAL_SERVER_ERROR).send(error);
        console.log(error);
        logger.error(`${req.url} - ${error}`);
    }
});

export = router;
