import {
  HttpException
} from '@nestjs/common'

import {
  Object,
  DelegateType,
  CreatePayload,
  UpdatePayload,
  GenericFilter,
  UniqueFilter,
} from './types'

export class BaseService {
  constructor(
    private delegate: DelegateType
  ) {}

  public async create(data: CreatePayload): Promise<Object> {
    return this.delegate.create({ data })
  }

  public async locate(where: UniqueFilter): Promise<Object> {
    const result = await this.delegate.findFirst({ where })
    if (result === null) throw new HttpException(
      `${JSON.stringify(where)} did not return any results`, 404
    )
    return result
  }

  public async update(where: UniqueFilter, data: UpdatePayload): Promise<Object> {
  // TODO where to handle missing failure.
    return this.delegate.update({ where, data })
  }

  public async search(where: GenericFilter): Promise<Object[]> {
    return this.delegate.findMany({ where })
  }

  public async delete(where: UniqueFilter): Promise<void> {
    const result = await this.delegate.delete({ where })
    if (result === null) throw new HttpException(
      `${JSON.stringify(where)} did not return any results`, 404
    )
  }
}

