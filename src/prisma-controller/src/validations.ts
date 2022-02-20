import {
  HttpException
} from '@nestjs/common'

import {
  transformNumbers
} from './transformations'

const validateRequiredIntersection = <T>(arg: T, keys: (keyof T)[]) => {
  let flag = false
  keys.forEach((key) => { if (!!arg[key]) flag = true })
  if(!flag) throw new HttpException(`One of ${ keys.join(', ') } is required.`, 400)
}

const validateRequiredUnion = <T>(arg: T, keys: (keyof T)[]) => {
  const missing = keys.filter((key) => !arg[key])
  if (missing.length) throw new HttpException(`Fields ${ missing.join(', ') } are required.`, 400)
}

type Keys<G> = (keyof G)[]

export const setupValidateCreate = <C>(requiredKeys: Keys<C>) => {
  return (body: C) => {
    validateRequiredUnion(body, requiredKeys)
    return body
  }
}

export const setupValidateLocate = <U>(uniqueKeys: Keys<U>, numericalKeys: Keys<U>) => {
  return (query: U) => {
    validateRequiredIntersection(query, uniqueKeys)
    const transformed = transformNumbers(query, numericalKeys)
    return transformed
  }
}

export const setupValidateSearch = <S>(numericalKeys: Keys<S>) => {
  return (query: S) => {
    return query // TODO transform numbers
  }
}

export const setupValidateUpdate = <U, D>(uniqueKeys: Keys<U>, numericalKeys: Keys<U>) => {
  return (query: U, body: D) => { 
    validateRequiredIntersection(query, uniqueKeys)
    const transformed = transformNumbers(query, numericalKeys)
    return { where: transformed, data: body }
  }
}

export const setupValidateDelete = <U>(uniqueKeys: Keys<U>, numericalKeys: Keys<U>) => {
  return (query: U) => {
    validateRequiredIntersection(query, uniqueKeys)
    const transformed = transformNumbers(query, numericalKeys)
    return transformed
  }
}
