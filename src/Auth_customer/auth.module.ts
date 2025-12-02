import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService_Customer } from './auth.service';
import { AuthController_Customer } from './auth.controller';
import { CustomerEntity } from '../customer/customer.entity';
import { JwtStrategy_Customer } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    PassportModule,
    JwtModule.register({
      secret: 'my-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService_Customer, JwtStrategy_Customer],
  controllers: [AuthController_Customer],
  exports: [AuthService_Customer],
})
export class AuthModule_Customer {}
