import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AwsService } from './aws.service';

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        { provide: ConfigService, useValue: { get: () => 'test' } },
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
