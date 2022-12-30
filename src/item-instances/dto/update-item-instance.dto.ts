import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class UpdateItemInstanceDto {
  
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @IsString()
  @AutoMap()
  type: string;

  @IsNumber()
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