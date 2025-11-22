
import { IoTLogEntity } from "../../domain/entities/iotlog";
import { CustomError } from "../../domain/errors/custom-error";
import { RegisterIoTLogDto } from "../../domain/dtos/register-iotlog.dto";
import { prisma } from "../../config/prisma";
import { WssService } from "./socket-service";
import { PaginationDto } from '../../domain/dtos/pagination-dto';

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

      WssService.instance.sendMessageToEveryBody(
        "IOT_LOG_REGISTERED",
        iotLogCreated
      );

      return IoTLogEntity.fromJson(iotLogCreated);
    } catch (error) {
      console.error("Error registering IoT log:", error);
      throw error;
    }
  }

  public async getAll( paginationDto: PaginationDto | undefined ): Promise<IoTLogEntity[]> {
    try {
      if(!paginationDto){
        const iotLogsData = await prisma.registrosIoT.findMany({orderBy: { fecha: "desc" }});
        // console.log(iotLogsData.length)
        const logsEntity: IoTLogEntity[] = iotLogsData.map( (iotLog) => IoTLogEntity.fromJson(iotLog));
        return logsEntity;
      }
      const filtredIotLogsDt = await prisma.registrosIoT.findMany({
        take: paginationDto.limit,
        skip: paginationDto.page,
        orderBy: { fecha: "desc" }
      });
      const filtredIoTLogsEntity: IoTLogEntity[] = filtredIotLogsDt.map( (filtredIotLog) => IoTLogEntity.fromJson(filtredIotLog));
      return filtredIoTLogsEntity
    } catch (error) {
      console.error("Error fetching IoT logs:", error);
      throw error;
    }
  }
}
