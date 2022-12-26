import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, ignore, Mapper} from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { Container } from "../containers/entities/container.entity";
import { ReadContainerDto } from "../containers/dto/read-continer.dto";
import { CreateContainerDto } from "../containers/dto/create-container.dto";
import { UpdateContainerRequestDto } from "../containers/dto/update-container.dto";

@Injectable()
export class ContainerProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Container, ReadContainerDto);
      
      createMap(mapper, CreateContainerDto, Container,
        forMember((dest) => dest.id, ignore())
      );
      createMap(mapper, UpdateContainerRequestDto, Container,
        forMember((dest) => dest.id, ignore())
      );
    };
  }
}