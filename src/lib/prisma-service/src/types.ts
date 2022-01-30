import { PrismaClient, Prisma, User, Game } from '@prisma/client'

// TODO autogenerate this file


type SharedBase = "key" | "metadata" | "createdAt" | "updatedAt"
type A = Prisma.UserCreateInput
type SharedTypeSafe = { [K in SharedBase]: A[K] }
type JustGame = Omit<Prisma.GameCreateInput, SharedBase>
type JustUser = Omit<Prisma.UserCreateInput, SharedBase>


// TODO there must be a way to genericize this
export type CreateInput = Prisma.GameCreateInput | Prisma.UserCreateInput

type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

export type NoUnion<T, TError> = [T] extends [UnionToIntersection<T>] ? {} : TError


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

