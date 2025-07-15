import { Router } from 'express';
import { IoTController } from './iotlog-controller';
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { AuthService } from '../services/auth-service';

export class IoTLogRoutes {

  static get routes(): Router {
    const router = Router();
    const authMiddleware = new AuthMiddleware(new AuthService());
    const iotController = new IoTController();

    router.post(
      '/register',
      authMiddleware.validateJWT,
      iotController.createLog
    );

    router.get(
      '/get-all',
      authMiddleware.validateJWT,
      iotController.getLogs
    );

    return router;
  }
}