import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, ignore, Mapper} from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { Item } from "../items/entities/item.entity";
import { ReadItemDto } from "../items/dto/read-item.dto";
import { CreateItemDto } from "../items/dto/create-item.dto";
import { UpdateItemDto } from "../items/dto/update-item.dto";
import { ItemInstance } from "../item-instances/entities/item-instance.entity";

@Injectable()
export class ItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Item, ReadItemDto,
      );
      createMap(mapper, Item, ItemInstance,
        forMember((dest) => dest.id, ignore())
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