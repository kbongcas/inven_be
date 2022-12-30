import { IsNotEmpty, IsNumber, IsString} from "class-validator";
import { AutoMap } from "@automapper/classes";

export class UpdateItemDto { 

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
}

export class UpdateItemResponseDto {

  @AutoMap()
  id: number;
  
  @AutoMap()
  name: string;

  @AutoMap()
  type: string;

  @AutoMap()
  count: number;

  @AutoMap()
  description: string;

  @AutoMap()
  cost: string;

  @AutoMap()
  notes: string;

  @AutoMap()
  image: string;

  @AutoMap()
  weight: string;

}

