import {
  Controller
} from '@nestjs/common'

import {
  CrudController
} from 'crud-controller'

import {
  UsersService
} from '../@services'

/**/
@Controller('users')
export class UsersController extends CrudController {
  constructor(
    private readonly usersService: UsersService
  ) {
    super(usersService)
  }
}
