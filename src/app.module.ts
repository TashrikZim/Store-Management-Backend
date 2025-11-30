import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',         
      password: 'postgres',             
      database: 'store_management_db', 
      autoLoadEntities: true,      
      synchronize: true,            
    }),
    CustomerModule,
  ],
})
export class AppModule {}
