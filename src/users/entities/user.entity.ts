import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "../../items/entities/item.entity";
import { Container } from "../../containers/entities/container.entity";

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  
  @Column({nullable: true, default: null })
  refreshToken: string;
  
  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @OneToMany(() => Container, (container) => container.user)
  container: Container[];
}
