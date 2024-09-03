import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), TaskModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
