import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { UserEntity } from "../../domain/entities/user";
import { GasAlarmService } from "../services/gasalarm-service";
import { RegisterGasAlarm } from "../../domain/dtos/register-gas-alarm.dto";
import { PaginationDto } from "../../domain/dtos/pagination-dto";
import { envs } from "../../config/envs";
import { GasAlarmEntity } from "../../domain/entities/gas-alarm";

export class GasAlarmController {

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  public createGasAlarm = (req: Request, res: Response) => {
    const user = req.body.user as UserEntity;

    const [error, registerGasAlarm] = RegisterGasAlarm.create({
      userId: user.userId,
      ...req.body,
    });

    if (error) {
      res.status(404).json({ error });
      return;
    }

    new GasAlarmService()
      .register(registerGasAlarm!)
      .then((gasAlarm) => res.status(201).json(gasAlarm))
      .catch((error) => this.handleError(error, res));
  };

  public getGasAlarms = (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const [paginationError, paginationDto] = PaginationDto.create(page, limit);

    if (paginationError) {
      res.status(404).json({ error: paginationError });
      return;
    }

    new GasAlarmService()
      .getAll(paginationDto)
      .then((gasAlarms) => {

        // 🟦 Si no se envió paginación → regresar todo directo
        if (!paginationDto) {
          res.status(200).json(gasAlarms);
          return;
        }

        const pageNum = paginationDto.page ?? 1;
        const limitNum = paginationDto.limit ?? gasAlarms.length;

        res.status(200).json(
          this.buildResponse(
            gasAlarms,
            pageNum,
            limitNum,
            gasAlarms.length
          )
        );
      })
      .catch((error) => this.handleError(error, res));
  };

  private buildResponse(
    gasAlarms: GasAlarmEntity[],
    page: number,
    limit: number,
    count: number
  ) {
    return {
      page,
      limit,
      prev: page > 1 ? `${envs.WEB_SERVICE_URL}/gas-alarms?page=${page - 1}&limit=${limit}` : null,
      data: gasAlarms,
      message: gasAlarms.length === 0 ? "No more gas alarms available for this query." : null,
    };
  }
}
