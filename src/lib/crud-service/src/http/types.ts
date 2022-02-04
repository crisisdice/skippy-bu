import {
  PrismaClient,
  Prisma,
  User,
  Game
} from '@prisma/client'

// TODO autogenerate these files based on */.primsa/index.d.ts
// TODO expand DTO generation to validate bespoke unique parameters

export type DelegateType = {
//  PrismaClient['game'] |
//  PrismaClient['user'] 
  create: Create
  findFirst: Locate
  findMany: Search
  update: Update
  delete: Delete
}

export type CreatePayload =
  Prisma.GameCreateInput |
  Prisma.UserCreateInput

export type UpdatePayload =
  Prisma.UserUpdateInput |
  Prisma.GameCreateInput

export type Object =
  User |
  Game

export type GenericFilter =
  Prisma.GameWhereInput |
  Prisma.UserWhereInput

export type UniqueFilter =
  Prisma.GameWhereUniqueInput |
  Prisma.UserWhereUniqueInput

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

export type Create = (args: CreateArgs) => Promise<Object>

export type Locate = (args: LocateArgs) => Promise<Object | null>

export type Update = (args: UpdateArgs) => Promise<Object>

export type Search = (args: SearchArgs) => Promise<Object[]>

export type Delete = (args: DeleteArgs) => Promise<Object>

