
import {
  PipeTransform,
  Injectable,
  HttpException,
  Logger,
} from '@nestjs/common'

@Injectable()
export class ValidateUnique implements PipeTransform {
  logger: Logger
  constructor(
    _logger: Logger
  ) {
    this.logger = _logger
  }

  transform(value: any) {
    const id = !!value?.id ? parseInt(value.id) : undefined
    const key = value?.key
    const email = value?.email
    // TODO autogenerate validation and mapping code

    if (!id && !key && !email) throw new HttpException('Missing unique identifier', 400)

    return {
      id,
      key,
      email,
    }
  }
}

@Injectable()
export class ValidateCreate implements PipeTransform {
  logger: Logger
  constructor(
    _logger: Logger
  ) {
    this.logger = _logger
  }

  transform(value: any) {
    //TODO don't allow custom keys or ids
    return value
  }
}

@Injectable()
export class ValidateUpdate implements PipeTransform {
  logger: Logger
  constructor(
    _logger: Logger
  ) {
    this.logger = _logger
  }

  transform(value: any) {
    //TODO don't allow changing of ids or keys
    return value
  }
}

@Injectable()
export class ValidateSearch implements PipeTransform {
  logger: Logger
  constructor(
    _logger: Logger
  ) {
    this.logger = _logger
  }

  transform(value: any) {
    const id = !!value?.id ? parseInt(value.id) : undefined
    return {
      ...value,
      id,
    }
  }
}

