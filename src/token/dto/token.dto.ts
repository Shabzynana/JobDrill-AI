import { IsString } from 'class-validator';
import { TokenType } from './token_type';

export class refreshTokenDto {
  @IsString()
  refresh_token: string;
}

export class TokenDto {
  @IsString()
  userId: string;

  @IsString()
  token_type: TokenType;
}
