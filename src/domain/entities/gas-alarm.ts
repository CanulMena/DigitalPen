import { CustomError } from "../errors/custom-error";

export class GasAlarmEntity {
  constructor(
    public id: number,
    public date: Date,
    public gasLevel: number,
    public userId: number
  ){}

  static fromJson( props: {[key: string]: any} ): GasAlarmEntity {
    const { id, fecha, gas, usuarioId } = props;

    if(!id) throw CustomError.badRequest('Missing id');
    
    if (!fecha) throw CustomError.badRequest('Missing fecha');
    const newDate = new Date(fecha);

    if (isNaN(newDate.getTime())) throw CustomError.badRequest('fecha is not valid');

    if(!gas) throw CustomError.badRequest('Missing gas level');

    if(!usuarioId) throw CustomError.badRequest('Missing userId');

    return new GasAlarmEntity(
      id,
      newDate,
      gas,
      usuarioId
    );
  }
}