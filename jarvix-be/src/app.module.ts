import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { PrismaService } from './prisma.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule} from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { CacheStore } from '@nestjs/common/cache/interfaces/cache-manager.interface'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TaskModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('RATE_LIMIT_TTL'),
          limit: config.get('RATE_LIMIT'),
        },
      ],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
       const redisHost = config.get<string>('REDIS_HOST');
       const redisPort = config.get<number>('REDIS_PORT');

       return {
         store: redisStore as unknown as CacheStore,
         url: `redis://${redisHost}:${redisPort}`,
       };
      },
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }
  ],
})
export class AppModule {}
