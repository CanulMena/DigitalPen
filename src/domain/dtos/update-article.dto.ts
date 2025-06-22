import { ValidStatus, ArticleEntity } from "../entities/article";

export class UpdateArticleDto {

  constructor(
    public id: number,
    public title?: string,
    public introduccion?: string,
    public descripcion?: string,
    public urlFoto?: string,
    public status?: ValidStatus,
    public fecha?: Date,
  ){}

  public static create(props: { [key: string]: any }): [string?, UpdateArticleDto?] {
    const { id, title, introduccion, descripcion, urlFoto, status, fecha } = props;

    if (!id || isNaN(Number(id)) ) return ['id argument must be a valid number'];

    if (title !== undefined && typeof title !== 'string') return ['title must be a string'];
    if (introduccion !== undefined && typeof introduccion !== 'string') return ['introduccion must be a string'];
    if (descripcion !== undefined && typeof descripcion !== 'string') return ['descripcion must be a string'];
    if (urlFoto !== undefined && typeof urlFoto !== 'string') return ['urlFoto must be a string'];

    if (status !== undefined && !ArticleEntity.isValidStatus(status)) {
      return [`Invalid status - valid ones: ${ArticleEntity.validStatus.join(', ')}`];
    }

    let parsedDate: Date | undefined = undefined;
    if (fecha !== undefined) {
      const newDate = new Date(fecha);
      if (isNaN(newDate.getTime())) return ['fecha is not valid'];
      parsedDate = newDate;
    }

    return [
      undefined,
      new UpdateArticleDto(
        id,
        title,
        introduccion,
        descripcion,
        urlFoto,
        status,
        parsedDate
      )
    ];
  }

}