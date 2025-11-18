import { CustomError } from "../errors/custom-error";

export class IoTLogEntity {
  constructor(
    public id: string,
    public date: Date,
    public userId: number,
    public humidity?: number,
    public temperature?: number,
  ){}

  static fromJson( props: {[key: string]: any} ): IoTLogEntity {
    const {  id, fecha, temperatura, humedad, usuarioId }  = props;

    if(!id) throw CustomError.badRequest('Missing id');

    if (!fecha) throw CustomError.badRequest('Missing fecha');
    const newDate = new Date(fecha);

    if (isNaN(newDate.getTime())) throw CustomError.badRequest('fecha is not valid');

    // if(!temperatura) throw CustomError.badRequest('Missing temperature');

    if( temperatura !== undefined && (typeof temperatura !== 'number' || isNaN(temperatura)) ) {
      throw CustomError.badRequest('temperature is not valid');
    }

    if ( humedad !== undefined && (typeof humedad !== 'number' || isNaN(humedad)) ) {
      throw CustomError.badRequest('humidity is not valid');
    }

    if(!usuarioId) throw CustomError.badRequest('Missing userId');

    return new IoTLogEntity(
      id,
      newDate,
      usuarioId,
      humedad,
      temperatura,
    );
  }
}