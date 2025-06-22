import { regularExps } from "../../config/regular-exp";
import { UserEntity, UserRole } from "../entities/user";

export class RegisterUserDto {

  constructor(
    public name: string, // Nombre del usuario
    public email: string, // Guardar el correo con el que se registrará el usuario
    public passwordHash: string, // Guardar el hash en vez de la contraseña
    // public rol: UserRole, //Roles que puede tener el usuario
  ){}


  static create( props: {[key: string]: any} ): [ string?, RegisterUserDto? ] { //uso de tuplas para retornar un error o un objeto
    const { name, email, password, rol } = props;
    if (!name) return ['Missing name'];
    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email) ) return ['Invalid email'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['password must be at least 6 characters long'];
    // if (!UserEntity.isValidRole(rol)) return [`Invalid Role, valid roles: ${UserEntity.validRoles}`];

    return [undefined, new RegisterUserDto( name, email, password )];
  }
}