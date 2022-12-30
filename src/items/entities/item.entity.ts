import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AutoMap } from "@automapper/classes";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Item{

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
  @ManyToOne(() => User, (user) => user.items,  { onDelete : "SET NULL"})
  createdBy: User
}