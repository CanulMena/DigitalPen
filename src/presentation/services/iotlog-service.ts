import { PrismaClient } from "@prisma/client";
import { IoTLogEntity } from "../../domain/entities/iotlog";
import { CustomError } from "../../domain/errors/custom-error";
import { RegisterIoTLogDto } from "../../domain/dtos/register-iotlog.dto";

export class IoTLogService { //para mi los servicios es un patron command (tiene logica de negocio) pero con las peticiones a la API (acceso de datos) acoplado.
  constructor(){}
  //al hacer public una propiedad, quiere decir que es un propiedad de instancia (se puede acceder desde otros metodos de la clase pero se necessita instanciar) - al ser static ess todo lo contrario.
  public readonly prisma = new PrismaClient().registrosIoT; //acceso a la base de datos

  public async register( registerIotlogDto: RegisterIoTLogDto ): Promise<IoTLogEntity> {
    try {

      const iotLogCreated = await this.prisma.create({
        data: {
          humedad: registerIotlogDto.humidity,
          temperatura: registerIotlogDto.temperature,
          fecha: new Date(registerIotlogDto.date).toISOString(),
          usuarioId: registerIotlogDto.userId,
        },
      });

      if (!iotLogCreated) throw CustomError.internalServer('Registro IoT no creado');

      return IoTLogEntity.fromJson(iotLogCreated);
      
    } catch (error) {
      console.error("Error registering IoT log:", error);
      throw error;
    }
  }

  public async getAll(): Promise<IoTLogEntity[]> {
    try {
      const iotLogs = await this.prisma.findMany();
      return iotLogs.map(IoTLogEntity.fromJson);
    } catch (error) {
      console.error("Error fetching IoT logs:", error);
      throw error;
    }
  }

}