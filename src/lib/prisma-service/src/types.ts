import { PrismaClient, Prisma, User, Game } from '@prisma/client'

// TODO autogenerate this file
export type CreateInput =
  Prisma.GameCreateInput |
  Prisma.UserCreateInput

export type UpdateType =
  Prisma.UserUpdateInput |
  Prisma.GameCreateInput

export type ReturnType =
  User |
  Game

export type DelegateType =
  PrismaClient['game'] |
  PrismaClient['user'] 

export type CreateArgs = {
    data: CreateInput
}

export type Query = Prisma.GameWhereInput |
         Prisma.UserWhereInput

export type FindWhereArgs = {
  where: Query
}

export type UpdateByIdArgs = 
  Prisma.GameUpdateArgs |
  Prisma.UserUpdateArgs

export type DeleteByIdArgs =
  Prisma.GameDeleteArgs |
  Prisma.UserDeleteArgs

export type CreateMethod = (args: CreateArgs) => Promise<ReturnType>

export type FindAllMethod = () => Promise<ReturnType[]>

export type FindWhereMethod = (args: FindWhereArgs) => Promise<ReturnType>

export type UpdateByIdMethod = (args: UpdateByIdArgs) => Promise<ReturnType>

export type DeleteByIdMethod = (args: DeleteByIdArgs) => Promise<ReturnType>

