import jwt from 'jsonwebtoken';

export interface GenerateTokenConfig {
  payload: {id: number, email?: string};
  expiresIn?: jwt.SignOptions['expiresIn'];
  secret: string;
}

export const jwtAdapter = {
    generateToken: (config: GenerateTokenConfig): Promise<string> => {
    //envolvemos la función en una promesa para poder usar async/await y poder obtener valores en el retorno
    return new Promise((resolve, reject) => {
      jwt.sign(
        config.payload,
        config.secret, 
        { expiresIn: config.expiresIn || '1d' },
        (err, token) => {
        if (err || !token) return reject(err);
        return resolve(token);
        }
      );
    });
  },

  validateToken<T>(token: string, secret: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, secret, (err, decoded) => {
        if(err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}