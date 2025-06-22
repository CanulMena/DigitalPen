import { Request, Response } from 'express';
import { CustomError } from "../../domain/errors/custom-error";
import { RegisterArticleDto } from '../../domain/dtos/register-article.dto';
import { ArticleService } from '../services/article-service';
import { UserEntity } from '../../domain/entities/user';
import { ArticleEntity } from '../../domain/entities/article';
import { StatusArticulo } from '@prisma/client';
import { UpdateArticleDto } from '../../domain/dtos/update-article.dto';

export class ArticleController {
  constructor (){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public register = (req: Request, res: Response) => {
    const user = req.body.user as UserEntity;
    const [ error, registerArticleDto ] = RegisterArticleDto.create(req.body);

    if (error) {
      res.status(400).json({ error: error });
      return
    }

    new ArticleService()
    .createArticle(registerArticleDto!, user)
    .then( article => res.status(200).json(article))
    .catch( error => this.handleError(error, res));
    
  }

  public getArticlesByStatus = (req: Request, res: Response) => {

    new ArticleService()
    .getArticles()
    .then( articles => res.status(200).json(articles))
    .catch( error => this.handleError(error, res));

  }

  public getArticlesByUser = (req: Request, res: Response) => {
    const user = req.body.user as UserEntity;

    new ArticleService()
    .getArticlesByUser(user.userId)
    .then( articles => res.status(200).json(articles))
    .catch( error => this.handleError(error, res));
  }

  public updateArticle = (req: Request, res: Response) => {
    const user: UserEntity = req.body.user;
    const articleId = +req.params.articleId; //* +req..... sirve para convertirlo un tipo number si es que era string
    const [ error, updateArticleDto] = UpdateArticleDto.create({articleId, ...req.body});

    if (error) {
      res.status(400).json({ error: 'Internal Server Error' })
      return;
    }

    new ArticleService()
    .updateArticle(user, updateArticleDto!)
    .then( articleUpdated => res.status(200).json({ articleUpdated }))
    .catch( error => this.handleError(error, res));
  }

}