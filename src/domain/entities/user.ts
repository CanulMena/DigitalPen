import { CustomError } from "../errors/custom-error";

const validRoles = ['ADMIN','USUARIO'] as const;

export type UserRole = typeof validRoles[number]; //*User role simpre será uno de los valores de validRoles

export class UserEntity {

  public static readonly validRoles = validRoles; // esta copiando el valor de validRoles a validRoles = ['ADMIN', 'OPERATOR', 'DELIVERY', 'SUPER_ADMIN']

  constructor(
    public userId: number, //Identificador unico del usuario
    public name: string, // Nombre del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    public rol: UserRole, //Roles que puede tener el usuario
  ){}

  public static isValidRole(role: any): role is UserRole {
    return UserEntity.validRoles.includes(role);
  }

  static fromJson( props: {[key: string]: any} ): UserEntity { //uso de tuplas para retornar un error o un objeto
    const {  
      id,
      nombre,
      correo,
      contrasena,
      rol } = props;

      if(!id) throw CustomError.badRequest('Missing id');
      if(!nombre) throw CustomError.badRequest('Missing nombre');
      if(!correo) throw CustomError.badRequest('Missing correo');
      if(!contrasena) throw CustomError.badRequest('Missing password');
      if(!rol) throw CustomError.badRequest('Missing rol');
      if(!UserEntity.isValidRole(rol)) throw CustomError.badRequest('Invalid role');

    return new UserEntity( id, nombre, correo, contrasena, rol );
  }
}