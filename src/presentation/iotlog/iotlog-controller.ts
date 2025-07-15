import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom-error';
import { RegisterIoTLogDto } from '../../domain/dtos/register-iotlog.dto';
import { UserEntity } from '../../domain/entities/user';
import { IoTLogService } from '../services/iotlog-service';

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

  public getLogs(req: Request, res: Response) {
    
    new IoTLogService()
    .getAll()
    .then((iotLogs) => res.status(200).json(iotLogs))
    .catch((error) => this.handleError(error, res));

  }

}