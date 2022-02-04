import {
  UniqueFilter,
  GenericFilter,
  CreatePayload,
  UpdatePayload,
} from './types'

import {
  endpoints
} from './constants'

const toLogString = (
  verb: string,
  endpoint: string,
  method: string,
  query?: any,
  body?: any,
): string => {
  return JSON.stringify({
    verb,
    endpoint,
    method,
    query,
    body,
  })
}

export const logPost = (body: CreatePayload, base: string) =>
  toLogString('POST', `/${base}`, 'create()', undefined, body)

export const logGetOne = (query: UniqueFilter, base: string) =>
  toLogString('GET', `/${base}/${endpoints.locate}`, 'locate()', query)

export const logPut = (query: UniqueFilter, body: UpdatePayload, base: string) =>
  toLogString('PUT', `/${base}`, 'update()', query, body)

export const logGetMany = (query: GenericFilter, base: string) =>
  toLogString('GET', `/${base}/${endpoints.search}`, 'search()', query)

export const logDelete = (query: UniqueFilter, base: string) => 
  toLogString('DELETE', `/${base}`, 'delete()', query)

