import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { UserEntity } from "../../domain/entities/user";
import { RegisterIoTLogDto } from "../../domain/dtos/register-iotlog.dto";
import { GasAlarmService } from "../services/gasalarm-service";
import { RegisterGasAlarm } from "../../domain/dtos/register-gas-alarm.dto";

export class GasAlarmController {
  constructor() {}
  
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  public createGasAlarm(req: Request, res: Response) {
    const user = req.body.user as UserEntity;
    // Assuming RegisterIoTLogDto is similar to the one in the original code
    const [error, registerGasAlarm] = RegisterGasAlarm.create({
      userId: user.userId,
      ...req.body,
    });

    if (error) {
      res.status(404).json({ error: error });
      return;
    }

    new GasAlarmService()
      .register(registerGasAlarm!)
      .then((iotLog) => res.status(201).json(iotLog))
      .catch((error) => this.handleError(error, res));
  }

  public getGasAlarms(req: Request, res: Response) {
    new GasAlarmService()
      .getAll()
      .then((gasAlarms) => res.status(200).json(gasAlarms))
      .catch((error) => this.handleError(error, res));
  }
}