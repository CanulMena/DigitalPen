import { AppRoutes } from '../src/presentation/routes';
import express from 'express';

const app = express();

app.use(express.json());
app.use(AppRoutes.routes);

export default app;
