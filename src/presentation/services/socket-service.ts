import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";


interface Options {
  server: Server;
  path?: string;
}

// interface KitchenClient extends WebSocket {
//   kitchenId?: number; //* Le agregamos un kichenId a cada cliente de nuesetro web socket.
//   isAlive?: boolean; // Para verificar si el cliente sigue conectado
// }

export class WssService {
  private static _instance: WssService;
  private wss: WebSocketServer;
  // private interval: NodeJS.Timer;

  private constructor(options: Options) {
    const { server, path = "/ws" } = options;
    this.wss = new WebSocketServer({ server, path }); //* Cuando se instancia WssService, se crea un WebSocketServer asociado al servidor HTTP que le pasamos.
    this.start();

    //  // Cada 30s verificamos clientes vivos
    // this.interval = setInterval(() => {
    //   this.wss.clients.forEach((client) => {
    //     const kitchenClient = client as KitchenClient;

    //     if (!kitchenClient.isAlive) {
    //       console.log("Cliente no responde, cerrando conexión...");
    //       return client.terminate(); // mata el socket
    //     }

    //     kitchenClient.isAlive = false;
    //     client.ping(); // enviamos ping
    //     console.log("ping para el cliente");
    //   });
    // }, 30000);

  }

  static get instance(): WssService {
    if (!WssService._instance) { //* Esta es la parte que nos permite tener el singleton.
      throw "WssService is not initialized";
    }
    return WssService._instance; //llamamos a la instacia ya creada.
  }

  static initWss(options: Options) { //! No podemos usar ningun metodo sin antes inicializar la instancia singleton. Siempre se debe llamar este metodo primero antes de todo.
    WssService._instance = new WssService(options); //* Inicializamos la instancia singleton.
  }

  public sendMessageToEveryBody(
    // kitchenId: number,
    type: string,
    payload: object
  ) {
    this.wss.clients.forEach((client) => { //
      // const kitchenClient = client as KitchenClient;
      if (
        client.readyState === WebSocket.OPEN /* &&
        kitchenClient.kitchenId === kitchenId */
      ) {
        client.send(JSON.stringify({ type, payload }));
      }
    });
  }

  private start() {
    this.wss.on("connection", (ws: WebSocket) => {
      // console.log("Client connected");

      // ws.isAlive = true;

      // ws.on("pong", () => {
      //   //pong recibido del cliente
      //   console.log("pong recibido del cliente");
      //   ws.isAlive = true; // el cliente respondió al ping -> tiene que responder en menos de 30s? r: sì
      // });

      // // handshake inicial: el cliente debe mandar { type: "SET_KITCHEN", kitchenId: 1 } para conectarse y escuchar mensajes de una cocina.
      // ws.on("message", (message) => { //* Escuchamos los mensajes del cliente al conectarse.....
      //   try {
      //     const data = JSON.parse(message.toString());
      //     if (data.type === "SET_KITCHEN" && typeof data.kitchenId === "number") {
      //       ws.kitchenId = data.kitchenId;
      //       console.log(`Cliente asociado a cocina ${ws.kitchenId}`);

      //       // Enviar ACK al cliente
            ws.send(JSON.stringify({ type: "CONNECTION_ACK", payload: { success: true } }));

      //     }
      //   } catch (err) {
      //     console.error("Invalid WS message", err);
      //   }
      // });

      ws.on("close", () => console.log("Client disconnected"));
    });
  }
}