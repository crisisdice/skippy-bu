
import {
  Controller,
  UseGuards,
  Post,
  Response,
  Get,
  Put,
  Body,
  Query,
} from '@nestjs/common'

import {
  GamesService
} from '../services'

import {
  Response as IResponse
} from 'express'

import {
  AuthGuard,
  getUser
} from '../utils'

/**/
@Controller('/')
export class GamesController {
  constructor() {

  }
}





