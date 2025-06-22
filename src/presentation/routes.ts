import { Router } from "express";
import { AuthRoutes } from "./auth/auth-routes";
import { ArticleRoutes } from "./article/article-routes";

export class AppRoutes {
  static get routes(): Router {

      const router = Router();

      router.use('/api/auth', AuthRoutes.routes ); //Ruta de los usuarios

      router.use('/api/article', ArticleRoutes.routes);

      return router;
  }
}