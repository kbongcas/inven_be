import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { forwardRef } from "@nestjs/common/utils";
import { ItemsModule } from "../items/items.module";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  imports: [UsersModule, forwardRef(() => ItemsModule)],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, JwtService],
  exports: [AuthService]
})
export class AuthModule {}
