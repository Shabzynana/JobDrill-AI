import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from 'src/token/token.service';
import { Token } from 'src/token/entities/token.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailService } from 'src/email/email.service';
import { QueueService } from 'src/common/queue/queue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Token]),
    JwtModule.register({
      global: true,
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, JwtAuthGuard, EmailService, QueueService],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
