import { Router } from 'express';
import hotelInfo from './hotel/hotelinfo';
import roomInfo from './hotel/roominfo';
import bookingInfo from './hotel/bookinginfo';

const apiRouter: Router = Router();

// Hotel
apiRouter.use('/hotelinfo', hotelInfo);
apiRouter.use('/roominfo', roomInfo);
apiRouter.use('/bookinginfo', bookingInfo);

export default apiRouter;
