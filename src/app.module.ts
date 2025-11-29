import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliverymanModule } from './deliveryman/deliveryman.module';

@Module({
  imports: [DeliverymanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
