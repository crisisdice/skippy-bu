import {
  Module
} from '@nestjs/common'

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config'

import {
  NestFactory
} from '@nestjs/core'

import {
  LoggerModule,
  Logger,
} from 'nestjs-pino'

import * 
  as bodyParser
from 'body-parser'

import {
  GamesController,
  UsersController
} from './controllers'

import {
  GamesService,
  UsersService,
  configureWsServer,
} from './clients'

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

  configureWsServer()

  await app.listen(port ?? 3001)
}

bootstrap()

