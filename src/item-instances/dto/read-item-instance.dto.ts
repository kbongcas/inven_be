import { AutoMap } from "@automapper/classes";

export class ReadItemInstanceDto{

  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  type: string;

  @AutoMap()
  count: number;

  @AutoMap()

  @AutoMap()

  @AutoMap()
  notes: string;

  @AutoMap()
  description: string;

  @AutoMap()
  image: string;
  
  @AutoMap()
  containerId: number;


}