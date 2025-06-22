import { Router } from "express";
import { AuthController } from "./auth-controller";
import { AuthService } from "../services/auth-service";
import { AuthMiddleware } from "../middlewares/auth-middleware";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const authController = new AuthController();

    router.post(
      '/register',
      authController.register
    );

    router.post(
      '/login',
      authController.login
    );


    return router;
  }
}