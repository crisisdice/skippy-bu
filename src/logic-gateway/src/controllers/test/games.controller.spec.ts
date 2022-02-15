import {
  Test,
  TestingModule
} from '@nestjs/testing'

import {
  GamesService
} from '../../services'

import {
  GamesController
} from '../games.controller'

describe('GamesController', () => {
  let controller: GamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        GamesController
      ],
      providers: [
        GamesService,
      ]
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
