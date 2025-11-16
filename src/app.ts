import { AppRoutes } from "./presentation/routes";
import { AppServer } from "./presentation/server";
import { createServer } from 'http';
import { WssService } from "./presentation/services/socket-service";
import { envs } from "./config/envs";


(async => {
    main();
})();

function main(){


    const exrpessServer = new AppServer({
        port: 3000,
        routes: AppRoutes.routes
    });

    const httpServer = createServer(exrpessServer.app);

    WssService.initWss({ server: httpServer }); // Se crea el servidor del WebSocket con la configuración del servidor (Expres)

    // exrpessServer.setRoutes( AppRoutes.routes );

    httpServer.listen( envs.PORT, () => {
        console.log(`Server running on port: ${ envs.PORT }`);
    });

    // exrpessServer.start();
}