import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Users } from 'db/entities/users.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<string[]>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const accessToken = request.cookies['access_token'];
    const refreshToken = request.cookies['refresh_token'];
    if (accessToken) {
      try {
        const payload = await this.jwtService.verifyAsync(accessToken, {
          secret: process.env.SECRET_JWT,
        });
        const user = await this.userRepository.findOneBy({ id: payload.id });
        request['user'] = user;
        return true;
      } catch (error) {
        if (error.name !== 'TokenExpiredError') {
          throw new UnauthorizedException('Invalid access token');
        }
      }
    }
    if (refreshToken) {
      try {
        const refreshPayload = await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.SECRET_JWT,
        });

        const newAccessToken = await this.jwtService.signAsync(
          { id: refreshPayload.id },
          { expiresIn: '600s' },
        );

        response.cookie('access_token', newAccessToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 10 * 60 * 1000, // 10 phút
        });
        const user = await this.userRepository.findOneBy({
          id: refreshPayload.id,
        });
        request['user'] = user;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Refresh token expired');
      }
    }
    return false;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
