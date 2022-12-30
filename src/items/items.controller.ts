import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus, InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ReadItemDto } from "./dto/read-item.dto";
import { MessageBody} from "@nestjs/websockets";
import { CreateItemDto } from "./dto/create-item.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Item } from "./entities/item.entity";
import { RemoveItemResponseDto } from "./dto/remove-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { AccessTokenGuard } from "../common/guards/access-token.guard";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";
import { ItemInstancesService } from "../item-instances/item-instances.service";
import { Inject } from "@nestjs/common/decorators";
import { NotFoundError } from "rxjs";
import { ItemInstance } from "../item-instances/entities/item-instance.entity";
import { ReadItemInstanceDto } from "../item-instances/dto/read-item-instance.dto";
import { UpdateItemInstanceDto } from "../item-instances/dto/update-item-instance.dto";

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    @InjectMapper() 
    private readonly classMapper: Mapper,
    @Inject(ItemInstancesService)
    private itemInstancesService: ItemInstancesService,
) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findAll(@GetCurrentUserId() userId: number): Promise<ReadItemDto[]>  {
    console.log('findAllItems called!')
    const items = await this.itemsService.findAll(userId);
    return this.classMapper.mapArray(items, Item, ReadItemDto)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findOne(@GetCurrentUserId() userId: number,
    @Param('id') id: number): Promise<ReadItemDto> {
    console.log('findOneCalled called!', id)
    const item = await this.itemsService.findOne(userId, id);
    console.log(item)
    if(!item) throw new HttpException('Not found', HttpStatus.NOT_FOUND) 
    return this.classMapper.map(item, Item, ReadItemDto)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async create(@GetCurrentUserId() userId: number,  
               @MessageBody() createItemDto: CreateItemDto): Promise<ReadItemDto> {
    console.log('createItem called!', createItemDto)
    const item = await this.itemsService.create(userId, createItemDto);
    console.log(item)
    return this.classMapper.map(item, Item, ReadItemDto) 
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async remove(@GetCurrentUserId() userId: number,
                   @Param('id') id: number): Promise<RemoveItemResponseDto> {
    console.log('removeItem called!', id)
    const affected = await this.itemsService.remove(userId, id);
    const response = new RemoveItemResponseDto()
    response.id = affected ? id : -1;
    if(response.id === -1) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    return response;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async update(@GetCurrentUserId() userId: number,
               @Param('id') id: number,
               @MessageBody() updateItemDto: UpdateItemDto): Promise<ReadItemDto> {
    console.log('updateItem called!', id,  updateItemDto)
    const item = await this.itemsService.update(userId,id ,updateItemDto);
    if(!item) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return this.classMapper.map(item, Item, ReadItemDto) 
  }

  @Get('container/:containerId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async getAllItemsFromContainer(@GetCurrentUserId() userId: number,
                                @Param('containerId') containerId: number) : Promise<ReadItemInstanceDto[]> {
    try{
      const itemInstances = await this.itemInstancesService.findAllItemsInContainer(userId, containerId);
      return this.classMapper.mapArray(itemInstances, ItemInstance, ReadItemInstanceDto)
    }
    catch (e){
      if(e instanceof NotFoundError ){
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  }
  
  
  @Post('/:id/container/:containerId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async addItemToContainer(@GetCurrentUserId() userId: number,
                           @Param('id') id: number,
                           @Param('containerId') containerId: number) : Promise<ReadItemInstanceDto> {
    console.log('addItemToContainer called!', id, containerId)
    try{
      const itemInstance = await this.itemInstancesService.addItemToContainer(userId, id, containerId);
      return this.classMapper.map(itemInstance, ItemInstance, ReadItemInstanceDto)
    }
    catch (e) {
      if(e instanceof NotFoundError ){
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Delete(':id/container/:containerId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async removeItemFromContainer(@GetCurrentUserId() userId: number,
                                @Param('id') id: number,
                                @Param('containerId') containerId: number) {
    console.log('removeItemFromContainer called!', id)
    let affected = -1;
    try {
      affected = await this.itemInstancesService.removeItemFromContainer(userId, id, containerId);
    } catch (e) {
      if (e instanceof NotFoundError) throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      if (e instanceof HttpException) throw e;
    }
    const response = new RemoveItemResponseDto()
    if(response.id === -1) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    response.id = affected ? id : -1;
    return response;
  }

  @Patch(':id/container/:containerId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async updateItemInContainer(@GetCurrentUserId() userId: number,
                              @Body() updateItemInstanceDto: UpdateItemInstanceDto,
                              @Param('id') id: number,
                              @Param('containerId') containerId: number) : Promise<ReadItemInstanceDto> {
    let item = null; 
    try{
      console.log('updateItemInContainer called!', id)
      item = await this.itemInstancesService.updateItemInContainer(userId,id,containerId, updateItemInstanceDto);
    } catch (e) {
      if (e instanceof NotFoundError) throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      if (e instanceof HttpException) throw e;
      else throw new InternalServerErrorException();
    }
    if(item === null) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return item;
  }

}
