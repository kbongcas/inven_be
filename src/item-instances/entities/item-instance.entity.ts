import { ApiProperty } from "@nestjs/swagger";
import { Container } from "../../containers/entities/container.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AutoMap } from "@automapper/classes";

@Entity()
export class ItemInstance{

  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @ApiProperty()
  @Column()
  name: string;

  @AutoMap()
  @ApiProperty()
  @Column()
  type: string;

  @AutoMap()
  @ApiProperty()
  @Column()
  count: number;

  @AutoMap()
  @ApiProperty()
  @Column()
  cost: string;

  @AutoMap()
  @ApiProperty()
  @Column()
  weight: string;

  @AutoMap()
  @ApiProperty()
  @Column()
  notes: string;

  @AutoMap()
  @ApiProperty()
  @Column()
  description: string;

  @AutoMap()
  @ApiProperty()
  @Column()
  image: string;

  @AutoMap()
  @ManyToOne(() => Container, (container) => container.items,  { onDelete : "SET NULL"})
  container: Container

}