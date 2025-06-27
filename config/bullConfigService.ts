import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { CONSTANT } from 'src/common/constants';
const { AuthQ } = CONSTANT;

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (cfg: ConfigService) => ({
        connection: {
          host: cfg.get<string>('Queue.host'),
          password: cfg.get<string>('Queue.pass'),
          username: cfg.get<string>('Queue.user'),
          port: cfg.get<number>('Queue.port'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: AuthQ,
      prefix: 'JobDrill-AI',
    }),
    BullBoardModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        route: '/queues',
        adapter: ExpressAdapter,
        adapterOptions: {
          basePath: '/queues',
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forFeature({
      name: AuthQ,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [BullModule],
})
export class BullConfigService {}
