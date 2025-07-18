
import { IoTLogEntity } from "../../domain/entities/iotlog";
import { CustomError } from "../../domain/errors/custom-error";
import { RegisterIoTLogDto } from "../../domain/dtos/register-iotlog.dto";
import { prisma } from "../../config/prisma";

export class IoTLogService {
  public async register(registerIotlogDto: RegisterIoTLogDto): Promise<IoTLogEntity> {
    try {
      const iotLogCreated = await prisma.registrosIoT.create({
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
      const iotLogs = await prisma.registrosIoT.findMany();
      return iotLogs.map(IoTLogEntity.fromJson);
    } catch (error) {
      console.error("Error fetching IoT logs:", error);
      throw error;
    }
  }
}
