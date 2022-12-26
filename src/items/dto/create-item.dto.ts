import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from "class-validator";

export class CreateItemDto{

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @IsString()
  @AutoMap()
  type: string;

  @IsNumber()
  @Min(1)
  @AutoMap()
  count: number;

  @IsString()
  @AutoMap()
  description: string;

  @IsString()
  @AutoMap()
  cost: string;

  @IsString()
  @AutoMap()
  notes: string;

  @IsString()
  @AutoMap()
  image: string;

  @IsString()
  @AutoMap()
  weight: string;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  @AutoMap()
  containerId: number;
}