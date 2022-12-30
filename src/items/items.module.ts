import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ContainersModule } from 'src/containers/containers.module';
import { ItemsController } from "./items.controller";
import { ItemProfile } from "../profile/item.profile";
import { UsersModule } from "../users/users.module";
import { ItemInstancesModule } from "../item-instances/item-instances.module";
import { forwardRef } from "@nestjs/common/utils";
import { ItemInstanceProfile } from "../profile/item-instance.profile";

@Module({
  controllers: [ItemsController],
  imports: [TypeOrmModule.forFeature([Item]),  ContainersModule ,  UsersModule, forwardRef(() => ItemInstancesModule)],
  providers: [ItemsService, ItemProfile, ItemInstanceProfile],
  exports: [ItemsService]
})
export class ItemsModule {}
