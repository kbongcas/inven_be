import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContainersService } from "../containers/containers.service";
import { DeleteResult, IsNull, Repository } from "typeorm";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Item } from "./entities/item.entity";
import { Inject } from "@nestjs/common/decorators";
import { forwardRef } from "@nestjs/common/utils";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @Inject(ContainersService)
    private containerService: ContainersService,
    @Inject(UsersService)
    private userService: UsersService,
    @InjectMapper() 
    private readonly classMapper: Mapper,
  ) {}

  async findAll(userId: number): Promise<Item[]> {

    return await this.itemRepository
      .createQueryBuilder("item")
      .leftJoinAndSelect("item.user", "user")
      .leftJoinAndSelect("item.container", "container")
      .where("item.userId = :userId", { userId })
      .getMany()
  }

  async findOne(userId: number, id: number): Promise<Item> {

    return await this.itemRepository
      .createQueryBuilder("item")
      .leftJoinAndSelect("item.user", "user")
      .leftJoinAndSelect("item.container", "container")
      .where("item.userId = :userId", { userId })
      .andWhere("item.id = :id", { id })
      .getOne()

  }

  async create(userId: number,createItemDto: CreateItemDto): Promise<Item> {
    
    // @Todo handle if user is not found
    const foundUser = await this.userService.findOneById(+userId);
    if(!foundUser) return null; 
    
    const item = this.classMapper.map(createItemDto, CreateItemDto, Item)
    item.user = foundUser;

    if(createItemDto.containerId) {
      // @Todo handle if container is not found
      const foundContainer = await this.containerService.findOne(userId,+createItemDto.containerId)
      if (foundContainer) item.container = foundContainer;
      else {}
    }
    
    return await this.itemRepository.save(item);
  }
  

  async findAllInContainer(containerId: number): Promise<Item[]> {
    console.log('containerId',containerId)
    let foundItems: Item[] = [];
    if(containerId){
      foundItems = await this.itemRepository.find({
        relations: {
          container: true,
        },
        where: {
          container: { id: containerId }
        }
      });
    }
    else {
      foundItems = await this.itemRepository.find({
        relations: {
          container: true,
        },
        where: {
          container: IsNull()
        }
      });
      console.log('foundItems', foundItems)
    }
    return foundItems;
  }


  async update(userId: number, id: number, updateItemDto: UpdateItemDto): Promise<Item> {

    const item = this.classMapper.map(updateItemDto, UpdateItemDto, Item)
    item.id = +id;
    
    const foundContainer = await this.containerService.findOne(userId, +updateItemDto.containerId)
    if (foundContainer) item.container = foundContainer;
    else item.container = null;

    const result = await this.itemRepository
      .createQueryBuilder("item")
      .update(Item)
      .set({...item})
      .where("userId = :userId", { userId })
      .andWhere("id = :id", { id })
      .execute()
    return result.affected ? item : null;
  }

  async remove(userId: number, id: number): Promise<number> {
    
    const result = await this.itemRepository
      .createQueryBuilder("item")
      .delete()
      .from(Item)
      .where("userId = :userId", { userId })
      .andWhere("id = :id", { id })
      .execute()
    return result.affected;
  }
}
