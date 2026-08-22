import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { AwsService } from '../aws/aws.service';

describe('OpenaiController', () => {
  let controller: OpenaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenaiController],
      providers: [
        { provide: OpenaiService, useValue: {} },
        { provide: AwsService, useValue: {} },
      ],
    }).compile();

    controller = module.get<OpenaiController>(OpenaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
