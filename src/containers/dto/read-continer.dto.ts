import { AutoMap } from "@automapper/classes";

export class ReadContainerDto {
  
  @AutoMap()
  id: number;
  
  @AutoMap()
  name: string;
  
  @AutoMap()
  description: string;
}