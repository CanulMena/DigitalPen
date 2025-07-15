import { Router } from "express";
import { AuthController } from "./auth-controller";

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