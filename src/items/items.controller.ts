import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { ItemsService } from "./items.service";
import { ReadItemDto } from "./dto/read-item.dto";
import { MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { CreateItemDto } from "./dto/create-item.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Item } from "./entities/item.entity";
import { RemoveItemResponseDto } from "./dto/remove-item.dto";
import { UpdateItemDto, UpdateItemResponseDto } from "./dto/update-item.dto";
import { AccessTokenGuard } from "../common/guards/access-token.guard";
import { GetCurrentUser } from "../common/decorators/get-current-user.decorator";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    @InjectMapper() private readonly classMapper: Mapper,
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
  
}
