import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom-error';
import { RegisterIoTLogDto } from '../../domain/dtos/register-iotlog.dto';
import { UserEntity } from '../../domain/entities/user';
import { IoTLogService } from '../services/iotlog-service';
import { PaginationDto } from '../../domain/dtos/pagination-dto';
import { IoTLogEntity } from '../../domain/entities/iotlog';
import { envs } from '../../config/envs';

export class IoTController {

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public createLog(req: Request, res: Response) {
    const user = req.body.user as UserEntity;
    // console.log(req.body)
    const [ error, registerLogDto ] = RegisterIoTLogDto.create({
      userId: user.userId,
      ...req.body,
    });

    if(error) {
      res.status(404).json({ error: error });
      return;
    }

    new IoTLogService()
    .register(registerLogDto!)
    .then((iotLog) => res.status(201).json(iotLog))
    .catch((error) => this.handleError(error, res));
  }

  public getLogs = (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const [paginationError, paginationDto ] = PaginationDto.create(page, limit);

    if(paginationError) {
      res.status(404).json({ error: paginationError });
      return;
    }

    new IoTLogService()
    .getAll(paginationDto)
    .then(
      (iotLogs) => {

        if(!paginationDto) {
          res.status(200).json(iotLogs)
          return;
        }

        const pageNum = paginationDto.page ?? 1;
        const limitNum = paginationDto.limit ?? iotLogs.length;

        res.status(200).json(
          this.buildResponse(
            iotLogs,
            pageNum,
            limitNum,
            iotLogs.length
          )
        )
        return;

      }
    )
    .catch((error) => this.handleError(error, res));

  }

    private buildResponse(
    iotLogs: IoTLogEntity[],
    page: number,
    limit: number,
    count: number
  ) {
    return {
      page,
      limit,
      // total: count,
      // next: page * limit < count ? `${envs.WEB_SERVICE_URL}/get-all?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `${envs.WEB_SERVICE_URL}/get-all?page=${page - 1}&limit=${limit}` : null,
      data: iotLogs,
      message: iotLogs.length === 0 ? "No more iotLogs available for this query." : null,
    };
  }

}