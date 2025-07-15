import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthService } from "../services/auth-service";
import { GasAlarmController } from "./gas-alarm-controller";

export class GasAlarmRoutes {
  static get routes(): Router {
    const router = Router();
    const authMiddleware = new AuthMiddleware(new AuthService());
    const gasAlarmController = new GasAlarmController();

    router.post(
      '/register',
      authMiddleware.validateJWT,
      gasAlarmController.createGasAlarm
    );

    router.get(
      '/get-all',
      authMiddleware.validateJWT,
      gasAlarmController.getGasAlarms
    );

    return router;
  }
}