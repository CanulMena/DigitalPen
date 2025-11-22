import { GasAlarmEntity } from "../../domain/entities/gas-alarm";
import { RegisterGasAlarm } from "../../domain/dtos/register-gas-alarm.dto";
import { prisma } from "../../config/prisma";
import { WssService } from "./socket-service";
import { PaginationDto } from "../../domain/dtos/pagination-dto";

export class GasAlarmService {

  public async register(registerGasAlarmDto: RegisterGasAlarm): Promise<GasAlarmEntity> {
    const gasAlarmRegisteredData = await prisma.alarmaGas.create({
      data: {
        fecha: new Date(registerGasAlarmDto.date).toISOString(),
        gas: registerGasAlarmDto.gasLevel,
        usuarioId: registerGasAlarmDto.userId,
      },
    });

    WssService.instance.sendMessageToEveryBody(
      "GAS_ALARM_REGISTERED",
      gasAlarmRegisteredData
    );

    return GasAlarmEntity.fromJson(gasAlarmRegisteredData);
  }

  public async getAll(paginationDto: PaginationDto | undefined): Promise<GasAlarmEntity[]> {
    try {
      if (!paginationDto) {
        const gasAlarms = await prisma.alarmaGas.findMany({
          orderBy: { fecha: "desc" }
        });
        return gasAlarms.map(GasAlarmEntity.fromJson);
      }

      const gasAlarmsPaginated = await prisma.alarmaGas.findMany({
        take: paginationDto.limit,
        skip: paginationDto.page,
        orderBy: { fecha: "desc" }
      });

      return gasAlarmsPaginated.map(GasAlarmEntity.fromJson);

    } catch (error) {
      console.error("Error fetching gas alarms:", error);
      throw error;
    }
  }
}
