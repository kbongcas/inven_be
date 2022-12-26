import { ApiProperty } from "@nestjs/swagger";
import { Item } from "../../items/entities/item.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AutoMap } from "@automapper/classes";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Container{

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
    description: string;

    @AutoMap()
    @OneToMany(() => Item, (item) => item.container)
    items: Item[]

    @AutoMap()
    @ManyToOne(() => User, (user) => user.container,  { onDelete : "SET NULL"})
    user: User
}