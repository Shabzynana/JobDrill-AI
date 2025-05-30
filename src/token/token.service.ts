import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AppUtilities } from 'src/app.utilities';
import { Repository } from 'typeorm';
import { refreshTokenDto, TokenDto } from './dto/token.dto';
import { TokenType } from './dto/token_type';
import { Token } from './entities/token.entity';
import { ITokenize } from './interfaces/token.interface';

@Injectable()
export class TokenService {
  private refreshTokenSecret: string;

  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private configService: ConfigService,
    private jwtService: JwtService
    
  ) {
    this.refreshTokenSecret = this.configService.get('jwt.refreshSecret');
  }

  private async createToken(token: ITokenize, token_type: TokenType) {
    let access_token: string;
    let hashedToken: string;

    if (!token.access_token) {
      access_token = AppUtilities.generateToken();
      hashedToken = AppUtilities.hashToken(access_token, token.userId);
    } else {
      hashedToken = token.access_token;
    }

    const data = {
      uuid: token.uuid ? token.uuid : AppUtilities.genUuid(),
      access_token: hashedToken,
      refresh_token: token.refresh_token || 'null',
      expires_in: AppUtilities.exp1hr(),
      type: token_type,
      userId: token.userId ? token.userId : null,
    } as Token;

    const existingToken = await this.tokenRepository.findOne({
      where: {
        uuid: data.uuid,
      },
    })

    if (existingToken) {
      const updatedToken = await this.tokenRepository.merge(existingToken, data)
      return await this.tokenRepository.save(updatedToken)
    } else {
      const userToken = await this.tokenRepository.save(data);
      return userToken;
    }
  }

  async verifyToken(token: string, token_type: TokenType) {
    const tokenData = await this.tokenRepository.findOne({
      where: {
        access_token: token,
        type: token_type,
      },
    });
    if (!tokenData) {
      throw new UnauthorizedException('Invalid token');
    }

    if (Date.now() > tokenData.expires_in) {
      throw new UnauthorizedException('Token expired');
    }
    
    return tokenData;
  }

  async verifyRefreshToken(dto: refreshTokenDto) {

    const payload = await this.jwtService.verifyAsync(dto.refresh_token, {
      secret: this.refreshTokenSecret,
    });
    if (!payload) throw new UnauthorizedException('Invalid token');
    
    const tokenData = await this.tokenRepository.findOne({
      where: {
        refresh_token: dto.refresh_token,
      },
    });
    if (!tokenData) throw new UnauthorizedException('Token not found');
 
    if (Date.now() > tokenData.expires_in) {
      throw new UnauthorizedException('Token expired');
    }
    
    return tokenData;
  }

  async deleteToken(dto: TokenDto) {
    const tokenData = await this.getUserTokenByType(dto);
    return await this.tokenRepository.remove(tokenData)
  }

  async getUserTokenByType(dto: TokenDto) {

    const tokenData = await this.tokenRepository.find({
      where: {
        userId: dto.userId,
        type: dto.token_type
      }
    })
    if (!tokenData) throw new NotFoundException('Token not found');
    return tokenData
  }

  async generateLoginToken(token: ITokenize) {
    return await this.createToken(token, TokenType.LOGIN);
  }

  async generateConfirmationToken(userId: string) {
    return await this.createToken({ userId: userId }, TokenType.VERIFY_EMAIL);
  }

  async generateForgotPasswordToken(userId: string) {
    return await this.createToken({ userId: userId }, TokenType.RESET_PASSWORD);
  }

    


}
