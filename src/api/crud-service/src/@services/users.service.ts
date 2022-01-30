import {
  Injectable
} from '@nestjs/common'

import {
  BaseService,
} from 'base-service'

import {
  PrismaService
} from 'prisma-service'

/**/
@Injectable()
export class UsersService extends BaseService {
  constructor(
    private readonly prisma: PrismaService
  ) {
    super(prisma.user)
  }
}

