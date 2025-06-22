import 'dotenv/config';
import { get } from 'env-var';
// env-var nos ayuda a crear validaciones de las variables de entorno para que no tengamos problemas.

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    JWT_SEED: get('JWT_SEED').required().asString(),
}