import { Router } from 'express';
import hotelInfo from './hotel/hotelinfo';
import roomInfo from './hotel/roominfo';

const apiRouter: Router = Router();

// Hotel
apiRouter.use('/hotelinfo', hotelInfo);
apiRouter.use('/roominfo', roomInfo);

export default apiRouter;
