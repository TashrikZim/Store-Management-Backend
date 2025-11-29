
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './Admin/admin.module';
import { UserModule } from './Admin/Users/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'zimzim',     
        database: 'AdminDB',  
        autoLoadEntities: true,
        synchronize: true,       
      }),


    }),

    AdminModule,
    UserModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
