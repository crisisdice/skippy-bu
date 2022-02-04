import {
  Module
} from '@nestjs/common'

import {
  GamesController,
  UsersController
} from '../@controllers'

import {
  GamesService,
  UsersService,
} from '../@services'

/**/
@Module({
  controllers: [
    GamesController,
    UsersController
  ],
  providers: [
    GamesService,
    UsersService,
  ]
})

export class ControllersModule {}

