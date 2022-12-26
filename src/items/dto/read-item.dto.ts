import { AutoMap } from "@automapper/classes";

export class ReadItemDto{
  
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

  @AutoMap()
  containerId: number;
}
