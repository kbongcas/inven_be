import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ContainersModule } from 'src/containers/containers.module';
import { forwardRef } from '@nestjs/common/utils';
import { ItemsController } from "./items.controller";
import { ItemProfile } from "../profile/item.profile";
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [ItemsController],
  imports: [TypeOrmModule.forFeature([Item]),  ContainersModule , UsersModule],
  providers: [ItemsService, ItemProfile],
  exports: [ItemsService]
})
export class ItemsModule {}
