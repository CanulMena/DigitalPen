import { ArticleEntity, ValidStatus } from "../entities/article";

export class RegisterArticleDto {

  constructor(
    public title: string,
    public introduction: string,
    public description: string,
    public imagePath: string,
    public status: ValidStatus,
    public date: Date
  ){}

  static create( props: {[key: string]: any} ): [string?, RegisterArticleDto?] {
    const { title, introduction, description, imagePath, status, date } = props;

    //* Validación de la fecha
    if (!date) return ['Missing date'];
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) return ['date is not a valid date - format: yyyy-mm-dd hh:mm:ss'];

    //* validacion del estatus para que sean un boolean
    if (!status) return ['Missing status'];
    if (!ArticleEntity.isValidStatus(status)) return [`Invalid status - valid ones: ${ArticleEntity.validStatus.join(', ')}`]

    //* validar image path 
    if (!imagePath) return ['Missing imagePath'];
    if (typeof imagePath !== 'string') return ['imagePath must be string'];
    
    //* validar descripción
    if (!description) return ['Missing description'];
    if (typeof description !== 'string') return ['description must be string'];
    
    //* validar introducción
    if (!introduction) return ['Missing introduction'];
    if (typeof introduction !== 'string') return ['introduction must be string'];
    
    //* validar title
    if (!title) return ['Missing title'];
    if (typeof title !== 'string') return ['title must be string'];


    return [undefined, new RegisterArticleDto(title, introduction, description, imagePath, status, date)]
  }

}