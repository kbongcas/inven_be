import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from './entities/container.entity';
import { ContainersController } from "./containers.controller";
import { ContainerProfile } from "../profile/container.profile";
import { UsersModule } from "../users/users.module";


@Module({
  controllers: [ContainersController],
  imports: [TypeOrmModule.forFeature([Container]), UsersModule],
  providers: [ContainersService, ContainerProfile],
  exports: [ContainersService]
})
export class ContainersModule {}
