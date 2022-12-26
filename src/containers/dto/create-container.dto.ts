import { IsNotEmpty, IsString } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class CreateContainerDto {

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @IsString()
  @AutoMap()
  description: string;
}