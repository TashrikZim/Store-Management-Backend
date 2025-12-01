import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // 👈 Needed for .env
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module'; // 👈 Import this

// Import your Admin Module
import { AdminModule } from './Admin/admin.module';

@Module({
  imports: [
    // 1. Load the .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes variables available everywhere
      envFilePath: '.env',
    }),

    // 2. Connect to Database using variables from .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      
      // ✅ Auto Load: Finds Admin, AdminProfile, Announcement entities automatically
      autoLoadEntities: true, 
      
      // ✅ Synchronize: Creates tables automatically (Keep true for development)
      synchronize: true, 
    }),

    // 3. Register your Admin Module
    AdminModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}