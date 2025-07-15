import { PrismaClient } from "@prisma/client";
import { GasAlarmEntity } from "../../domain/entities/gas-alarm";
import { RegisterGasAlarm } from "../../domain/dtos/register-gas-alarm.dto";

export class GasAlarmService {

  public readonly prisma = new PrismaClient().alarmaGas; // Access to the database

  public async register(registerGasAlarmDto: RegisterGasAlarm): Promise<GasAlarmEntity> {
    const gasAlarmRegisteredData = await this.prisma.create({
      data: {
        fecha: new Date(registerGasAlarmDto.date).toISOString(),
        gas: registerGasAlarmDto.gasLevel,
        usuarioId: registerGasAlarmDto.userId, // Assuming userId is part of the DTO
      },
    });

    const gasAlarmEntity = GasAlarmEntity.fromJson(gasAlarmRegisteredData);
    return gasAlarmEntity;
  }

  public async  getAll(): Promise<GasAlarmEntity[]> {
    return await this.prisma.findMany()
      .then((gasAlarms) => gasAlarms.map(GasAlarmEntity.fromJson))
      .catch((error) => {
        console.error("Error fetching gas alarms:", error);
        throw error;
      });
  }
}