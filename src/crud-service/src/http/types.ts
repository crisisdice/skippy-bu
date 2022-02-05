import {
  ReturnType,
  CreatePayload,
  UpdatePayload,
  UniqueFilter,
  GenericFilter,
} from '../generated/types'

export type CreateArgs = {
  data: CreatePayload
}

export type LocateArgs = LocateDeleteBase

export type UpdateArgs = {
  where: UniqueFilter
  data: UpdatePayload
}

export type SearchArgs = {
  where: GenericFilter
}

export type DeleteArgs = LocateDeleteBase

type LocateDeleteBase =  {
  where: UniqueFilter
}

export type Create = (args: CreateArgs) => Promise<ReturnType>

export type Locate = (args: LocateArgs) => Promise<ReturnType | null>

export type Update = (args: UpdateArgs) => Promise<ReturnType>

export type Search = (args: SearchArgs) => Promise<ReturnType[]>

export type Delete = (args: DeleteArgs) => Promise<ReturnType>

export type DelegateType = {
  create: Create
  findFirst: Locate
  findMany: Search
  update: Update
  delete: Delete
}

