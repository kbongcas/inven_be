
/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, ignore, mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { Item } from "../items/entities/item.entity";
import { ReadItemDto } from "../items/dto/read-item.dto";
import { CreateItemDto } from "../items/dto/create-item.dto";
import { UpdateItemDto, UpdateItemResponseDto } from "../items/dto/update-item.dto";

@Injectable()
export class ItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Item, ReadItemDto,
        forMember(dest => dest.containerId, mapFrom( src => src.container ? src.container.id : null))
      );
      createMap(mapper, CreateItemDto, Item, 
        forMember((dest) => dest.id, ignore())
      );
      createMap(mapper, UpdateItemDto, Item,
        forMember((dest) => dest.id, ignore())
      );
    };
  }
}