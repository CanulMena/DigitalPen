import { regularExps } from "../../config/regular-exp";

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string
  ){}

  static create( props: {[key: string]: any} ): [string?, LoginUserDto?] {
    const { email, password } = props;
    if ( !email ) return ['Missing email']; //this is like ['Missing name', undefined]
    if ( !regularExps.email.test(email) ) return ['Invalid email'];
    if( !password ) return ['password is required'];
    if( password.length < 6 ) return ['password must be at least 6 characters long'];
    return [ undefined, new LoginUserDto(email, password) ];
  }
}