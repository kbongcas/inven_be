import { Test, TestingModule } from '@nestjs/testing';
import { ItemInstancesService } from './item-instances.service';

describe('ItemInstancesService', () => {
  let service: ItemInstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemInstancesService],
    }).compile();

    service = module.get<ItemInstancesService>(ItemInstancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
