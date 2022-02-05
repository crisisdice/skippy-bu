import {
  Prisma,
  User,
  Game
} from '@prisma/client'

// TODO autogenerate these files based on */.primsa/index.d.ts
// TODO expand DTO generation to validate bespoke unique parameters

export type CreatePayload =
  Prisma.GameCreateInput |
  Prisma.UserCreateInput

export type UpdatePayload =
  Prisma.UserUpdateInput |
  Prisma.GameCreateInput

export type ReturnType =
  User |
  Game

export type GenericFilter =
  Prisma.GameWhereInput |
  Prisma.UserWhereInput

export type UniqueFilter =
  Prisma.GameWhereUniqueInput |
  Prisma.UserWhereUniqueInput
