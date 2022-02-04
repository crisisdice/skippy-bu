import {
  HttpException
} from '@nestjs/common'

import {
  Object,
  Create,
  Locate,
  Update,
  Search,
  Delete,
  DelegateType,
  CreatePayload,
  UpdatePayload,
  GenericFilter,
  UniqueFilter,
} from 'prisma-service'

export class BaseService {
  constructor(
    private delegate: DelegateType
  ) {}

  public async create(data: CreatePayload): Promise<Object> {
    const method: Create = this.delegate.create
    return await method({
      data
    })
  }

  public async locate(where: UniqueFilter): Promise<Object> {
    const method: Locate = this.delegate.findFirst
    const result = await method({
      where
    })
    if (result === null) throw new HttpException(
      `${JSON.stringify(where)} did not return any results`, 404
    )
    return result
  }

  public async update(where: UniqueFilter, data: UpdatePayload): Promise<Object> {
  // TODO where to handle missing failure.
    const method: Update = this.delegate.update
    return await method({
      where,
      data
    })
  }

  public async search(where: GenericFilter): Promise<Object[]> {
    const method: Search = this.delegate.findMany 
    return await method({ where })
  }

  public async delete(where: UniqueFilter): Promise<void> {
    const method: Delete = this.delegate.delete
    const result = await method({
      where
    })
    if (result === null) throw new HttpException(
      `${JSON.stringify(where)} did not return any results`, 404
    )
  }
}

