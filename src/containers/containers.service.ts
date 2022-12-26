import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerRequestDto, UpdateContainerResponseDto } from "./dto/update-container.dto";
import { Container } from './entities/container.entity';
import { Inject } from '@nestjs/common/decorators';
import { UsersService } from "../users/users.service";
import { Item } from "../items/entities/item.entity";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";


@Injectable()
export class ContainersService {

  constructor(
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
    @Inject(UsersService)
    private userService: UsersService,
    @InjectMapper()
    private readonly classMapper: Mapper,
  ) {}
  
  async findAll(userId: number) : Promise<Container[]> {
    return this.containerRepository
      .createQueryBuilder("container")
      .leftJoinAndSelect("container.user", "user")
      .where("container.userId = :userId", { userId })
      .getMany()
  }

  async findOne(userId: number, id: number): Promise<Container> {
    return await this.containerRepository
      .createQueryBuilder("container")
      .leftJoinAndSelect("container.user", "user")
      .where("container.userId = :userId", { userId })
      .andWhere("container.id = :id", { id })
      .getOne()
  }

  async create(userId: number, createContainerDto: CreateContainerDto): Promise<Container> {

    // @Todo handle if user is not found
    const foundUser = await this.userService.findOneById(+userId);
    if(!foundUser) return null;

    const container = this.classMapper.map(createContainerDto, CreateContainerDto, Container)
    container.user = foundUser;
    
    return await this.containerRepository.save(container);
  }


  async update(userId: number, id: number, updateContainerDto: UpdateContainerRequestDto) {

    const container = this.classMapper.map(updateContainerDto,UpdateContainerRequestDto, Container)
    container.id = +id;

    const result = await this.containerRepository
      .createQueryBuilder("container")
      .update(Container)
      .set({...container})
      .where("userId = :userId", { userId })
      .andWhere("id = :id", { id })
      .execute()
    return result.affected ? container : null;
  }

  async remove(userId: number, id: number): Promise<number> {

    const result = await this.containerRepository
      .createQueryBuilder("container")
      .delete()
      .from(Container)
      .where("userId = :userId", { userId })
      .andWhere("id = :id", { id })
      .execute()
    return result.affected;
  }
}
