import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AutoMap } from "@automapper/classes";
import { User } from "../../users/entities/user.entity";
import { ItemInstance } from "../../item-instances/entities/item-instance.entity";

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
    @OneToMany(() => ItemInstance, (itemInstance) => itemInstance.container)
    items: ItemInstance[]

    @AutoMap()
    @ManyToOne(() => User, (user) => user.container,  { onDelete : "SET NULL"})
    createdBy: User
}