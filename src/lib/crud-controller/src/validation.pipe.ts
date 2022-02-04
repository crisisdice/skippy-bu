
import {
  PipeTransform,
  Injectable,
  HttpException,
} from '@nestjs/common'

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any) {
    const id = !!value?.id ? parseInt(value.id) : undefined
    const key = value?.key

    if (!id && !key) throw new HttpException('Missing unique identifier', 400)

    return {
      id,
      key,
    }
  }
}

