import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerRequestDto } from "./dto/update-container.dto";
import { Container } from './entities/container.entity';
import { Inject } from '@nestjs/common/decorators';
import { UsersService } from "../users/users.service";
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
    return await this.containerRepository
      .createQueryBuilder("container")
      .leftJoinAndSelect("container.createdBy", "user")
      .where("container.createdById = :userId", { userId })
      .getMany()
  }

  async findAllIds(userId: number) : Promise<number[]> {
    const results = await this.containerRepository
      .createQueryBuilder("container")
      .leftJoinAndSelect("container.createdBy", "user")
      .where("container.createdById = :userId", { userId })
      .getMany()
    return results.map((container) => container.id)
  }

  async findOne(userId: number, id: number): Promise<Container> {
    return await this.containerRepository
      .createQueryBuilder("container")
      .leftJoinAndSelect("container.createdBy", "user")
      .where("container.createdById = :userId", { userId })
      .andWhere("container.id = :id", { id })
      .getOne()
  }

  async create(userId: number, createContainerDto: CreateContainerDto): Promise<Container> {

    // @Todo handle if user is not found
    const foundUser = await this.userService.findOneById(+userId);
    if(!foundUser) return null;

    const container = this.classMapper.map(createContainerDto, CreateContainerDto, Container)
    container.createdBy = foundUser;
    
    return await this.containerRepository.save(container);
  }


  async update(userId: number, id: number, updateContainerDto: UpdateContainerRequestDto) {

    const container = this.classMapper.map(updateContainerDto,UpdateContainerRequestDto, Container)
    container.id = +id;

    const result = await this.containerRepository
      .createQueryBuilder("container")
      .update(Container)
      .set({...container})
      .where("createdById = :userId", { userId })
      .andWhere("id = :id", { id })
      .execute()
    return result.affected ? container : null;
  }

  async remove(userId: number, id: number): Promise<number> {

    const result = await this.containerRepository
      .createQueryBuilder("container")
      .delete()
      .from(Container)
      .where("createdById = :userId", { userId })
      .andWhere("id = :id", { id })
      .execute()
    return result.affected;
  }
  
}
