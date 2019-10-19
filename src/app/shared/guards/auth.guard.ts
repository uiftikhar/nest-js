import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

interface IGetUserAuthInfoRequest extends Request {
  user: string | object;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IGetUserAuthInfoRequest>();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = await this.validateRequest(request);
    return true;
  }

  private async validateRequest(req: Request) {
    let token = req.headers['x-access-token']
      ? req.headers['x-access-token'].toString()
      : req.headers.authorization.toString(); // Express headers are auto converted to lowercase

    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }
    try {
      const decode = await jwt.verify(token, process.env.SECRET);
      return decode;
    } catch (e) {
      const message = `token error: ${e.message || e.name} `;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
