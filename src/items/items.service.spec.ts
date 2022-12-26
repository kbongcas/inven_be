import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContainersService } from '../containers/containers.service';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { Container } from "../containers/entities/container.entity";
import { CreateContainerDto } from "../containers/dto/create-container.dto";
import { CreateItemDto } from "./dto/create-item.dto";
import { ItemProfile } from "../profile/item.profile";

describe('ItemsService', () => {
  let service: ItemsService;

  const mockItemRepository = {
    // returns same object but with an id
    save: jest.fn().mockImplementation(item => Promise.resolve({
      ...item,
      id: Math.floor(100000 + Math.random() * 900000) ,
    }))
  }

  const mockContainerService = {
    // if no containerId then return null else get container
    findOne: jest.fn().mockImplementation(containerId => Promise.resolve(() => {
      if(containerId === null) return null;
      const foundContainer = new Container();
      foundContainer.id = Math.floor(100000 + Math.random() * 900000);
      return foundContainer;
    })),
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }) 
      ],
      providers: [
        ItemsService,
        ItemProfile,
        {
          provide: ContainersService,
          useValue: mockContainerService
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository
        }
      ],
    }).compile()

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should create new item and return created Item', async () => {
    
    const createItemDto = new CreateItemDto();
    createItemDto.name = "BattleAxe"
    createItemDto.type = "Martial Melee weapon"
    createItemDto.count = 1;
    createItemDto.description = "Axe description"
    createItemDto.cost = "10 gp"
    createItemDto.notes = "This item is of dwarven make"
    createItemDto.image = "battleAxe"
    createItemDto.weight = "4 lb"
      
    //expect(await service.create(createItemDto)).toEqual(({
    //  id: expect.any(Number),
    //  ...createItemDto
    //}))
  });
});
