import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return this.userRepository.save(user)
  }


  async updateToken(userId: number, refreshToken: string){
    await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ refreshToken: refreshToken})
      .where("refreshToken != :refreshToken", { refreshToken: refreshToken })
      .where("id = :id", { id: userId })
      .execute();
  }

  async findOneByEmail(email: string): Promise<User>{
    return await this.userRepository.findOneBy({ email: email})
  }

  async findOneById(id: number): Promise<User>{
    return await this.userRepository.findOneBy({ id: id})
  }

  findAll() {
    return `This action returns all users`;
  }

}
