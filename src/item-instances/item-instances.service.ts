import { Injectable } from '@nestjs/common';
import { Item } from "../items/entities/item.entity";
import { ItemInstance } from "./entities/item-instance.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common/decorators";
import { ContainersService } from "../containers/containers.service";
import { UsersService } from "../users/users.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { ItemsService } from "../items/items.service";
import { NotFoundError } from "rxjs";
import { UpdateItemInstanceDto } from "./dto/update-item-instance.dto";

@Injectable()
export class ItemInstancesService {

  constructor(
    @InjectRepository(ItemInstance)
    private itemInstanceRepository: Repository<ItemInstance>,
    @Inject(ItemsService)
    private itemsService: ItemsService,
    @Inject(ContainersService)
    private containerService: ContainersService,
    @Inject(UsersService)
    private userService: UsersService,
    @InjectMapper()
    private readonly classMapper: Mapper,
  ) {}


  async addItemToContainer(userId: number, itemId: number, containerId: number){

    const foundUser = await this.userService.findOneById(+userId);
    if(!foundUser) throw new NotFoundError('User not found');

    const item = await this.itemsService.findOne(userId, itemId);
    if(!item) throw new NotFoundError('Item not found')
    const itemInstance = this.classMapper.map(item, Item, ItemInstance)

    const container = await this.containerService.findOne(userId, containerId);
    if(!container) throw new NotFoundError('Container not found')
    itemInstance.container = container;

    return await this.itemInstanceRepository.save(itemInstance);
  }
  
  async findAllItemsInContainer(userId: number, containerId: number): Promise<ItemInstance[]> {

    const foundUser = await this.userService.findOneById(+userId);
    if(!foundUser) throw new NotFoundError('User not found');

    const container = await this.containerService.findOne(userId, containerId);
    if(!container) throw new NotFoundError('Container not found')
    
    return await this.itemInstanceRepository
      .createQueryBuilder("item_instance")
      .leftJoinAndSelect("item_instance.container", "container")
      .where("container.createdById = :userId", { userId })
      .andWhere("container.id = :containerId", { containerId })
      .getMany();
  }

  async removeItemFromContainer(userId: number,itemId: number, containerId: number): Promise<number> {

    const foundUser = await this.userService.findOneById(+userId);
    if(!foundUser) throw new NotFoundError('User not found');

    const container = await this.containerService.findOne(userId, containerId);
    if(!container) throw new NotFoundError('Container not found')
    
    const result =  await this.itemInstanceRepository
      .createQueryBuilder("item_instance")
      .delete()
      .from(ItemInstance)
      .andWhere( "id = :itemId", { itemId })
      .andWhere( "containerId = :containerId", { containerId })
      .execute()
    
    return result.affected;
  }

  //@TODO:
  // Test this logic
  async updateItemInContainer(userId: number, itemId: number, containerId: number, updateItemInstanceDto: UpdateItemInstanceDto): Promise<ItemInstance> {

    const foundUser = await this.userService.findOneById(+userId);
    if(!foundUser) throw new NotFoundError('User not found');
    
    const foundItem = await this.itemInstanceRepository.findOne({where: { id: itemId}})
    if(!foundItem) throw new NotFoundError('Item not found');

    console.log(containerId)
    //Check if user has permissions for both containers
    const srcContainer = containerId ? await this.containerService.findOne(userId, +containerId) : null;
    const destContainer = updateItemInstanceDto.containerId ? await this.containerService.findOne(userId, +updateItemInstanceDto.containerId) : null;
    if (!(srcContainer && destContainer)) throw new NotFoundError("Container Not Found");
    
    const itemInstance = this.classMapper.map(updateItemInstanceDto, UpdateItemInstanceDto, ItemInstance)
    itemInstance.container = destContainer;
    
    console.log('here', itemInstance)
    const result = await this.itemInstanceRepository
      .createQueryBuilder("item_instance")
      .update(ItemInstance)
      .set({...itemInstance})
      .andWhere("id = :itemId", { itemId })
      .execute()
    return result.affected ? itemInstance : null;
  }
}
