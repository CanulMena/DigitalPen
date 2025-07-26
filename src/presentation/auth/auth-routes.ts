import { Router } from "express";
import { AuthController } from "./auth-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthService } from "../services/auth-service";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const authController = new AuthController();
    const authMiddleware = new AuthMiddleware(new AuthService());

    router.post(
      '/register',
      authController.register
    );

    router.post(
      '/login',
      authController.login
    );

    router.post(
      '/check-auth-status',
      authMiddleware.validateJWT,
      authController.checkAuthStatus
    );


    return router;
  }
}