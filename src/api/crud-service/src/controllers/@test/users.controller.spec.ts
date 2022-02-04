import {
  Test,
  TestingModule
} from '@nestjs/testing'

import {
  PrismaService
} from 'prisma-service'

import {
  UsersService
} from '../../@services'

import {
  UsersController
} from '../users.controller'

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UsersController
      ],
      providers: [
        {
          provide: PrismaService,
          useValue: {}
        },
        UsersService,
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
