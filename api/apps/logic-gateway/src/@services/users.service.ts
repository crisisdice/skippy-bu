import {
  HttpException,
  Injectable
} from '@nestjs/common'

import axios from 'axios'

/**/
@Injectable()
export class UsersService {
  constructor() {}

  async login(data: { email: string, password: string }) {
    const { email, password } = data
    const { data: user } = await axios.get('http://localhost:3000/users', {
      params: {
        email
      }
    })

    if (user.password === password) return 'TOKEN'

    throw new HttpException('', 403)
  }
}

