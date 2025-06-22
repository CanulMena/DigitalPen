import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom-error';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { AuthService } from '../services/auth-service';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';


export class AuthController {
  constructor(
  ){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public register = async (req: Request, res: Response) => {
    
    const [ error, registerUserDto ] = RegisterUserDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return
    }
    new AuthService()
    .register(registerUserDto!)
    .then( user => res.status(200).json(user))
    .catch( error => this.handleError(error, res));
  }

  public login = async (req: Request, res: Response) => {
    const [ error, loginUserDto ] = LoginUserDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return
    }
    new AuthService()
    .login(loginUserDto!)
    .then( user => res.status(200).json(user))
    .catch( error => this.handleError(error, res));
  }

} 