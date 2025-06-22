import express, { Router } from 'express';
import cors from 'cors';

export interface ServerAppOptions {
    port: number;
    routes: Router;
}

export class AppServer {
    private app = express();
    private readonly port: number;
    private readonly routes: Router;

    constructor(serverAppOptions: ServerAppOptions) {
        this.port = serverAppOptions.port;
        this.routes = serverAppOptions.routes;
    }

    async start() {
        this.app.use(cors({ origin: '*' }));

        this.app.use(express.json()); // raw json
        this.app.use(this.routes);

        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
