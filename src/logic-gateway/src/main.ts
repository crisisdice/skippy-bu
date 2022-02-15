import {
  Module
} from '@nestjs/common'

import {
  ConfigModule,
} from '@nestjs/config'

import {
  LoggerModule
} from 'nestjs-pino'

import {
  NestFactory
} from '@nestjs/core'

import {
  ConfigService
} from '@nestjs/config'

import * 
  as bodyParser
from 'body-parser'

import {
  Logger
} from 'nestjs-pino'

import {GamesController, UsersController} from './controllers'
import {GamesService, UsersService} from './services'
import { configureServer } from './ws'

/**/
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: {
          },
        }
      }
    }),
  ],
  providers: [
    GamesService,
    UsersService,
  ],
  controllers: [
    GamesController,
    UsersController,
  ]
})
class AppModule {}

/**/
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const configService = app.get(ConfigService)

  app.useLogger(app.get(Logger))
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  const port = configService.get<number>('PORT')

  configureServer()

  await app.listen(port ?? 3001)
}

bootstrap()

