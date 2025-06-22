import { RegisterArticleDto } from '../../domain/dtos/register-article.dto';
import { PrismaClient, StatusArticulo } from '@prisma/client';
import { ArticleEntity } from '../../domain/entities/article';
import { CustomError } from '../../domain/errors/custom-error';
import { UserEntity } from '../../domain/entities/user';

export class ArticleService {

  constructor(){}

  private readonly prisma = new PrismaClient().articulo;

  public async createArticle( registerArticleDto: RegisterArticleDto, user: UserEntity): Promise<ArticleEntity>{
    const articleData = await this.prisma.create({
      data: {
        titulo: registerArticleDto.title,
        introduccion: registerArticleDto.introduction,
        descripcion: registerArticleDto.description,
        foto: registerArticleDto.imagePath,
        status: registerArticleDto.status as StatusArticulo,
        fecha: new Date(registerArticleDto.date).toISOString(),
        usuarioId: user.userId
      }, 
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true, 
            correo: true,
          }
        }
      }
    });

    if (!articleData) throw CustomError.internalServer('Article not created');
    
    console.log(articleData);

    const articleEntity = ArticleEntity.fromJson(articleData);
    console.log(articleEntity);
    return articleEntity;
  }

  // Obtener todos los artículos filtrando por status (ACTIVO o DESACTIVO)
  public async getArticlesByStatus(status: StatusArticulo): Promise<ArticleEntity[]> {
    const articles = await this.prisma.findMany({
      where: { status },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,
          }
        }
      }
    });

    return articles.map(ArticleEntity.fromJson);
  }

  // Obtener todos los artículos de un usuario específico (activos e inactivos si no se pasa status)
  public async getArticlesByUser(userId: number, status?: StatusArticulo): Promise<ArticleEntity[]> {
    const where: any = { usuarioId: userId };
    if (status) where.status = status; // Solo filtra por status si se pasa

    const articles = await this.prisma.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,
          }
        }
      }
    });
    return articles.map(article => ArticleEntity.fromJson(article));
  }

  //TODO: ACTUALIZAR LOS ARTICULOS POR USUARIO (UN USUARIO NO PROPIO NO DEBERÀ DE PODER ACTUALIZAR EL ARTICULO DE OTRO USUARIO)

}