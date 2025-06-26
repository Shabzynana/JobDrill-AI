import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { refreshTokenDto } from 'src/token/dto/token.dto';
import { TokenType } from 'src/token/dto/token_type';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import {
  changePasswordDto,
  resendConfirmationMailDto,
  resetPasswordDto,
  UserLoginDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    return await this.authService.login(dto);
  }

  @Post('resend-confirmation-mail')
  async resendMail(@Body() dto: resendConfirmationMailDto) {
    return await this.authService.resendMail(dto);
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    return await this.authService.confirmEmail(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: resendConfirmationMailDto) {
    return await this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  async resetPassword(@Query('token') token: string, @Body() dto: resetPasswordDto) {
    return await this.authService.resetPassword(token, dto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: refreshTokenDto) {
    return await this.authService.refreshToken(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: changePasswordDto) {
    const { sub } = req.user;
    return await this.authService.changePassword(sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('logout')
  async logout(@Req() req, @Query('token_type') token_type: string) {
    const { sub } = req.user;
    return await this.authService.logout(sub, token_type as TokenType);
  }
}
