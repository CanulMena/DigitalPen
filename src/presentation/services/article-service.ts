import { RegisterArticleDto } from '../../domain/dtos/register-article.dto';
import { PrismaClient, StatusArticulo } from '@prisma/client';
import { ArticleEntity } from '../../domain/entities/article';
import { CustomError } from '../../domain/errors/custom-error';
import { UserEntity } from '../../domain/entities/user';
import { UpdateArticleDto } from '../../domain/dtos/update-article.dto';

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
    const articleEntity = ArticleEntity.fromJson(articleData);
    return articleEntity;
  }

  public async getArticles(): Promise<ArticleEntity[]> {
    const articles = await this.prisma.findMany({
      where: { status: 'ACTIVO' },
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

  public async updateArticle(user: UserEntity, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
    // 1. Buscar el artículo por id
    const existing = await this.prisma.findUnique({
      where: { id: updateArticleDto.id },
      include: {
        usuario: {
          select: { id: true, nombre: true, correo: true }
        }
      }
    });

    if (!existing) throw CustomError.notFound('Article not found');

    // 2. Validar que el usuario sea el dueño
    if (existing.usuarioId !== user.userId) {
      throw CustomError.unAuthorized('You are not the owner of this article');
    }

    // 3. Preparar los datos a actualizar (solo los campos definidos)
    const data: any = {};
    if (updateArticleDto.title !== undefined) data.titulo = updateArticleDto.title;
    if (updateArticleDto.introduccion !== undefined) data.introduccion = updateArticleDto.introduccion;
    if (updateArticleDto.descripcion !== undefined) data.descripcion = updateArticleDto.descripcion;
    if (updateArticleDto.urlFoto !== undefined) data.foto = updateArticleDto.urlFoto;
    if (updateArticleDto.status !== undefined) data.status = updateArticleDto.status as StatusArticulo;
    if (updateArticleDto.fecha !== undefined) data.fecha = new Date(updateArticleDto.fecha).toISOString();

    // 4. Actualizar el artículo
    const updated = await this.prisma.update({
      where: { id: updateArticleDto.id },
      data,
      include: {
        usuario: {
          select: { id: true, nombre: true, correo: true }
        }
      }
    });

    return ArticleEntity.fromJson(updated);
  }

}