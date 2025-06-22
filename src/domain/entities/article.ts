import { CustomError } from "../errors/custom-error";

const validStatus = ['ACTIVO', 'DESACTIVO'];

export type ValidStatus = typeof validStatus[number];

export class ArticleEntity {

  public static readonly validStatus = validStatus;

  constructor(
    public id: number,
    public title: String,
    public introduccion: string,
    public descripcion: string,
    public urlFoto: string,
    public status: ValidStatus,
    public fecha: Date,
    public usuario: { id: number; nombre: string; correo: string }
  ){}

  public static isValidStatus( status: any ): status is ValidStatus {
    return ArticleEntity.validStatus.includes(status);
  }

  static fromJson( props: {[key: string]: any} ): ArticleEntity {
    const { id, titulo, introduccion, descripcion, foto, status, fecha, usuario } = props;

    if (id === undefined || id === null) throw CustomError.badRequest('Missing id');
    if (typeof id !== 'number' || id < 0) throw CustomError.badRequest('Invalid id');

    if (!titulo) throw CustomError.badRequest('Missing titulo');
    if (typeof titulo !== 'string') throw CustomError.badRequest('titulo must be a string');

    if (!introduccion) throw CustomError.badRequest('Missing introduccion');
    if (typeof introduccion !== 'string') throw CustomError.badRequest('introduccion must be a string');

    if (!descripcion) throw CustomError.badRequest('Missing descripcion');
    if (typeof descripcion !== 'string') throw CustomError.badRequest('descripcion must be a string');

    if (!foto) throw CustomError.badRequest('Missing foto');
    if (typeof foto !== 'string') throw CustomError.badRequest('foto must be a string');

    if (!ArticleEntity.isValidStatus(status)) {
      throw CustomError.badRequest(`Invalid status - valid ones: ${ArticleEntity.validStatus.join(', ')}`);
    }

    if (!fecha) throw CustomError.badRequest('Missing fecha');
    const newDate = new Date(fecha);
    if (isNaN(newDate.getTime())) throw CustomError.badRequest('fecha is not valid');

    // Validaciones para usuario
    if (!usuario) throw CustomError.badRequest('Missing usuario');
    if (typeof usuario !== 'object') throw CustomError.badRequest('usuario must be an object');
    if (usuario.id === undefined || usuario.id === null) throw CustomError.badRequest('Missing usuario.id');
    if (typeof usuario.id !== 'number' || usuario.id < 0) throw CustomError.badRequest('usuario.id must be a valid number');
    if (!usuario.nombre) throw CustomError.badRequest('Missing usuario.nombre');
    if (typeof usuario.nombre !== 'string') throw CustomError.badRequest('usuario.nombre must be a string');
    if (!usuario.correo) throw CustomError.badRequest('Missing usuario.correo');
    if (typeof usuario.correo !== 'string') throw CustomError.badRequest('usuario.correo must be a string');


    return new ArticleEntity(
      id,
      titulo,
      introduccion,
      descripcion,
      foto,
      status, 
      fecha,
      usuario
    );
  }

}