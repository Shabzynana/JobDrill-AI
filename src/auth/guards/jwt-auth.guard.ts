import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../common/decorators/auth.public.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/token/entities/token.entity';
import { Repository } from 'typeorm';
import { TokenType } from 'src/token/dto/token_type';
import { JwtPayload } from '../interfaces/interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      let payload: any = await this.verifyAccessToken(token);
      if (!payload || !payload.type) {
        throw new UnauthorizedException('Invalid token');
      }

      if (payload.type === TokenType.LOGIN) {
        payload = await this.verifyJwtToken(token);
        if (!payload) throw new UnauthorizedException('JWT verification failed');

        request['user'] = payload;
      } else if (payload.userId) {
        request['user'] = { sub: payload.userId };
      } else {
        throw new UnauthorizedException('Invalid token payload');
      }

      return true;
    } catch (err) {
      console.error('Authentication error:', err);
      throw new UnauthorizedException();
    }
  }

  private async verifyAccessToken(token: string) {
    try {
      return await this.tokenRepository.findOne({
        where: {
          access_token: token,
        },
        relations: {
          user: true,
        },
      });
    } catch (err) {
      console.error('Access token verification failed:', err);
    }
  }

  private async verifyJwtToken(token: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      return payload;
    } catch (err) {
      console.error('JWT verification failed:', err);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
