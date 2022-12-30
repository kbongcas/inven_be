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
import { ContainersService } from "./containers.service";
import { MessageBody } from "@nestjs/websockets";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Container } from "./entities/container.entity";
import { AccessTokenGuard } from "../common/guards/access-token.guard";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";
import { ReadContainerDto } from "./dto/read-continer.dto";
import { CreateContainerDto } from "./dto/create-container.dto";
import { RemoveContainerResponseDto } from "./dto/remove-item.dto";
import { UpdateContainerRequestDto } from "./dto/update-container.dto";

@Controller('containers')
export class ContainersController {
  constructor(
    private readonly containersService: ContainersService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findAll(@GetCurrentUserId() userId: number): Promise<ReadContainerDto[]>  {
    console.log('findAllContainers called!')
    const containers = await this.containersService.findAll(userId);
    return this.classMapper.mapArray(containers, Container, ReadContainerDto)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findOne(@GetCurrentUserId() userId: number,
                @Param('id') id: number): Promise<ReadContainerDto> {
    console.log('findOneCalled called!', id)
    const container = await this.containersService.findOne(userId, id);
    console.log(container)
    if(!container) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    return this.classMapper.map(container, Container,ReadContainerDto)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async create(@GetCurrentUserId() userId: number,
               @MessageBody() createContainerDto: CreateContainerDto): Promise<ReadContainerDto> {
    console.log('createContainer called!', createContainerDto)
    const container = await this.containersService.create(userId, createContainerDto);
    console.log(container)
    return this.classMapper.map(container, Container, ReadContainerDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async remove(@GetCurrentUserId() userId: number,
                   @Param('id') id: number): Promise<RemoveContainerResponseDto> {
    console.log('removeContainer called!', id)
    const affected = await this.containersService.remove(userId, id);
    const response = new RemoveContainerResponseDto()
    response.id = affected ? id : -1;
    if(response.id === -1) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    return response;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async update(@GetCurrentUserId() userId: number,
               @Param('id') id: number,
               @MessageBody() updateContainerDto: UpdateContainerRequestDto): Promise<ReadContainerDto> {
    console.log('updateContainer called!', id,  updateContainerDto)
    const container = await this.containersService.update(userId, id, updateContainerDto);
    if(!container) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return this.classMapper.map(container, Container, ReadContainerDto)
  }


}
