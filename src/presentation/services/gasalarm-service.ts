
import { GasAlarmEntity } from "../../domain/entities/gas-alarm";
import { RegisterGasAlarm } from "../../domain/dtos/register-gas-alarm.dto";
import { prisma } from "../../config/prisma";
import { WssService } from "./socket-service";

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

  public async getAll(): Promise<GasAlarmEntity[]> {
    try {
      const gasAlarms = await prisma.alarmaGas.findMany();
      return gasAlarms.map(GasAlarmEntity.fromJson);
    } catch (error) {
      console.error("Error fetching gas alarms:", error);
      throw error;
    }
  }
}
