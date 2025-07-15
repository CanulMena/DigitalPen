import { Router } from "express";
import { AuthRoutes } from "./auth/auth-routes";
import { ArticleRoutes } from "./article/article-routes";
import { IoTLogRoutes } from "./iotlog/iotlog-routes";
import { GasAlarmRoutes } from "./alarm/gas-alarm-routes";

export class AppRoutes {
  static get routes(): Router {

      const router = Router();

      router.use('/api/auth', AuthRoutes.routes ); //Ruta de los usuarios

      router.use('/api/article', ArticleRoutes.routes);

      router.use('/api/iotlog', IoTLogRoutes.routes); // Ruta de los logs de IoT

      router.use('/api/gas-alarm', GasAlarmRoutes.routes); // Ruta de las alarmas de gas

      return router;
  }
}