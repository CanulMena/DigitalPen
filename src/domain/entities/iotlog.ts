import { CustomError } from "../errors/custom-error";

export class IoTLogEntity {
  constructor(
    public id: string,
    public date: Date,
    public temperature: number,
    public humidity: number,
    public userId: number
  ){}

  static fromJson( props: {[key: string]: any} ): IoTLogEntity {
    const {  id, fecha, temperatura, humedad, usuarioId }  = props;

    if(!id) throw CustomError.badRequest('Missing id');
    
    if (!fecha) throw CustomError.badRequest('Missing fecha');
    const newDate = new Date(fecha);

    if (isNaN(newDate.getTime())) throw CustomError.badRequest('fecha is not valid');

    if(!temperatura) throw CustomError.badRequest('Missing temperature');

    if(!humedad) throw CustomError.badRequest('Missing humidity');

    if(!usuarioId) throw CustomError.badRequest('Missing userId');

    return new IoTLogEntity(
      id,
      newDate,
      temperatura,
      humedad,
      usuarioId
    );
  }
}