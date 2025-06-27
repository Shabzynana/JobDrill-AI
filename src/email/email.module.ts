import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthConsumer } from './consumers/authEmail.consumer';
import { QueueService } from 'src/common/queue/queue.service';
import { TokenService } from 'src/token/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/token/entities/token.entity';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: false,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  controllers: [],
  providers: [EmailService, AuthConsumer, QueueService, TokenService],
})
export class EmailModule {}
