import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, ignore, mapFrom, Mapper } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { ItemInstance } from "../item-instances/entities/item-instance.entity";
import { ReadItemInstanceDto } from "../item-instances/dto/read-item-instance.dto";
import { UpdateItemInstanceDto } from "../item-instances/dto/update-item-instance.dto";

@Injectable()
export class ItemInstanceProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ItemInstance, ReadItemInstanceDto,
        forMember((dest) => dest.containerId, mapFrom( src => src.container ? src.container.id : null)
      ))
      createMap(mapper, UpdateItemInstanceDto, ItemInstance,
        forMember((dest) => dest.container, ignore())
      )
    };
  }
}