
import {
  DelegateType,
  CreateType,
  UpdateType,
  CreateMethod,
  FindAllMethod,
  FindByIdMethod,
  UpdateByIdMethod,
  DeleteByIdMethod,
} from './types'

export class BaseService {
  constructor(
    private delegate: DelegateType
  ) {}

  public async create(data: CreateType) {
    const method: CreateMethod = this.delegate.create
    return await method({ data })
  }

  public async findAll() {
    const method: FindAllMethod = this.delegate.findMany 
    return await method()
  }

  public async findById(id: number) {
    const method: FindByIdMethod = this.delegate.findFirst
    return await method({ where: { id } })
  }

  public async updateById(id: number, data: UpdateType) {
    const method: UpdateByIdMethod = this.delegate.update
    return await method({ where: { id }, data })
  }

  public async deleteById(id: number) {
    const method: DeleteByIdMethod = this.delegate.delete
    return await method({ where: { id} })
  }
}

