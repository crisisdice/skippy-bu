import {
  HttpException,
  Logger
} from '@nestjs/common'

import {
  DelegateType
} from './delegate-type'

type InternalArgs<C, D, U, S, R> = {
  logger: Logger
  route: string
  delegate: DelegateType<C, D, U, S, R>
}

const toLogString = <C, D, U, S>(
  verb: string,
  endpoint: string,
  method: string,
  query?: U | S,
  body?: C | D,
): string => {
  return JSON.stringify({
    verb,
    endpoint,
    method,
    query: JSON.stringify(query),
    body: JSON.stringify(body),
  })
}

export function createBase<C, D, U, S, R>(args: InternalArgs<C, D, U, S, R> & { validateCreate: (query: C) => C }) {
  return async (body: C): Promise<R> => {
    const { logger, route, validateCreate, delegate } = args

    logger.log(toLogString('POST', route, 'create()', undefined, body))

    const data = validateCreate(body)

    return await delegate.create({ data })
  }
}

export function locateBase<C, D, U, S, R>(args: InternalArgs<C, D, U, S, R> & { validateLocate: (query: U) => U }) {
  return async (query: U): Promise<R> => {
    const { logger, route, validateLocate, delegate } = args

    logger.log(toLogString('GET', route + '/locate', 'locate()', query))

    const where = validateLocate(query)

    const result = await delegate.findFirst({ where })

    if (!result) throw new HttpException(`${JSON.stringify(where)} returns no records`, 404)

    return result
  }
}

export function searchBase<C, D, U, S, R>(args: InternalArgs<C, D, U, S, R> & { validateSearch: (query: S) => S }) {
  return async (query: S): Promise<R[]> => {
    const { logger, route, validateSearch, delegate } = args

    logger.log(toLogString('GET', route + '/search', 'search()', query))

    const where = validateSearch(query)

    return await delegate.findMany({ where })
  }
}

export function updateBase<C, D, U, S, R>(
  args: InternalArgs<C, D, U, S, R> & { validateUpdate: (query: U, body: D) => { where: U, data: D } }
) {
  return async (query: U, body: D): Promise<R> => {
    const { logger, route, validateUpdate, delegate } = args

    logger.log(toLogString('PUT', route, 'update()', query, body))

    const { where, data } = validateUpdate(query, body)

    return await delegate.update({ where, data })
  }
}

export function deleteBase<C, D, U, S, R>(args: InternalArgs<C, D, U, S, R> & { validateDelete: (query: U) => U }) {
  return async (query: U): Promise<void> => {
    const { logger, route, validateDelete, delegate } = args

    logger.log(toLogString('DELETE', route, 'delete()', query))

    const where = validateDelete(query)

    const result = await delegate.delete({ where })

    if (!result) throw new HttpException(`${JSON.stringify(where)} returns no records`, 404)
  }
}
