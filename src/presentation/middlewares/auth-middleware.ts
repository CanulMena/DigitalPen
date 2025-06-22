import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";
import { UserEntity } from "../../domain/entities/user";
import { envs } from "../../config/envs";
import { jwtAdapter } from "../../config/plugins/jwtAdapter";


export class AuthMiddleware {

  constructor(
    private readonly authService: AuthService
  ) { }

  public validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => { //Lo que hace este middleware es validar el token y si es valido, agrega el usuario al request
    try {
      const authorization = req.header('Authorization');
      if (!authorization) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      if (!authorization.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Invalid Bearer token' });
        return;
      }

      const token = authorization.split(' ').at(1) || ''; //tomamos el token del header      

      const payload = await jwtAdapter.validateToken<{ id: number }>(token, envs.JWT_SEED); // sacamos el payload del token { id: number }
      if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      const userFound = await this.authService.getUserById(payload.id);
      if (!userFound) {
        res.status(401).json({ error: 'Invalid token - user' });
        return;
      }

      req.body.user = UserEntity.fromJson({
        "id": userFound.userId,
        "nombre": userFound.name,
        "correo": userFound.email,
        "contrasena": userFound.passwordHash,
        "rol": userFound.rol
      });

      next(); // Continuar al siguiente middleware
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public validateRole = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = req.body.user as UserEntity;
      if (!user) {
        res.status(403).json({ error: 'User not found in the request' });
        return;
      }

      if (!requiredRoles.includes(user.rol)) { //si el rol del usuario no esta en los roles permitidos
        res.status(403).json({ error: `${user.rol} user is not the required role. Allowed roles: ${requiredRoles.join(', ')}` });
        return;
      }

      next();
    }
  }

}