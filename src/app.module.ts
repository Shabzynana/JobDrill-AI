import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullConfigService } from 'config/bullConfigService';
import { configuration } from 'config/configuration';
import { AuthModule } from './auth/auth.module';
import dataSource from './database/data-source';
import { EmailModule } from './email/email.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { InterviewsModule } from './interviews/interviews.module';
import { GroqModule } from './groq/groq.module';
import { QnAModule } from './QnA/QnA.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { GoogleAuthModule } from './common/google-auth/google-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => dataSource,
    }),
    UserModule,
    TokenModule,
    EmailModule,
    AuthModule,
    BullConfigService,
    InterviewsModule,
    GroqModule,
    QnAModule,
    TranscriptionModule,
    GoogleAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
