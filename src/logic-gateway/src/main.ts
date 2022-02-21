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
} from './services'

import {
  WebSocketServer,
} from 'ws'

import {
  routes,
  setupWsHandler,
  WS,
  Connections,
} from 'skip-models'

import {
  setUpUserVerification
} from './utils'

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
  app.enableCors()

  const port = parseInt(configService.get<string>('PORT') ?? '3001')

  configureWsServer({
    endpoint: configService.get<string>('CRUD_URL') ?? '',
    secret: configService.get<string>('SECRET') ?? '',
    port: port + 1,
  })

  await app.listen(port)
}

type WsArgs = { endpoint: string, secret: string, port: number }

export function configureWsServer({ port, endpoint, secret }: WsArgs) {
  const wss = new WebSocketServer({ port })
  const connections: Connections = new Map()
  const verifyUser = setUpUserVerification(`${endpoint}/${routes.users}/locate`, secret)
  const handler = setupWsHandler({ endpoint, verifyUser })

  wss.on(WS.CONNECTION, async (ws) => {
    ws.on(WS.MESSAGE, async (data: any) => await handler(ws, data.toString(), connections))
  })
}

bootstrap()

