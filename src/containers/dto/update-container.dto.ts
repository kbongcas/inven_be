import { IsNotEmpty, IsString } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class UpdateContainerRequestDto {
  
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @IsString()
  @AutoMap()
  description: string;
}

export class UpdateContainerResponseDto {
  id: number
}
