import { Router } from "express";
import { ArticleController } from "./article-controller";
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { AuthService } from "../services/auth-service";

export class ArticleRoutes {
  
  static get routes(): Router {

    const router = Router();

    const authService = new AuthService();
    
    const articleController = new ArticleController()
    const authMiddleware = new AuthMiddleware(authService);

    router.post(
      '/register',
      authMiddleware.validateJWT,
      articleController.register
    );

    router.get(
      '/:articleId',
      articleController.getArticle
    );

    router.get(
      '/get-all',
      articleController.getArticles
    );

    return router;

  }
}