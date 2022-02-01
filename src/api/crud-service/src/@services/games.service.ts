import {
  Injectable
} from '@nestjs/common'

import {
  BaseService,
} from 'base-service'

import {
  DelegateType,
  PrismaService
} from 'prisma-service'

/**/
@Injectable()
export class GamesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService
  ) {
    super(prisma.game as unknown as DelegateType)
  }
}

