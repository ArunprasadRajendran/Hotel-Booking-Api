import { Router } from 'express';
import hotelInfo from './hotel/hotelinfo';

const apiRouter: Router = Router();

// Hotel
apiRouter.use('/hotelinfo', hotelInfo);

export default apiRouter;
