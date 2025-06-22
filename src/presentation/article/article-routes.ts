import { Router } from "express";
import { ArticleController } from "./article-controller";
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { AuthService } from "../services/auth-service";
import { ValidStatus } from '../../domain/entities/article';

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
      '/get-articles-by-status/:status',
      authMiddleware.validateJWT,
      articleController.getArticlesByStatus
    );

    router.get(
      '/get-articles-by-user',
      authMiddleware.validateJWT,
      articleController.getArticlesByUser
    );

    return router;

  }
}