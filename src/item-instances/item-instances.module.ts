import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemInstancesService } from './item-instances.service';
import { ItemInstance } from "./entities/item-instance.entity";
import { ContainersModule } from "../containers/containers.module";
import { UsersModule } from "../users/users.module";
import { ItemsModule } from "../items/items.module";
import { forwardRef } from "@nestjs/common/utils";

@Module({
  imports: [TypeOrmModule.forFeature([ItemInstance]),  ContainersModule ,  UsersModule, forwardRef(() => ItemsModule)],
  providers: [ItemInstancesService],
  exports: [ItemInstancesService]
})
export class ItemInstancesModule {}
