import {
  NestFactory
} from '@nestjs/core'

import {
  Module,
  Logger,
} from '@nestjs/common'

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config'

import * 
  as bodyParser
from 'body-parser'

import {
  PrismaService
} from 'crud-controller'

import {
  GamesController,
  UsersController
} from './controllers'

/**/
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [
    GamesController,
    UsersController,
  ],
  providers: [
    PrismaService,
    Logger,
  ],
})
class AppModule {}

/**/
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })

  const configService = app.get(ConfigService)

  app.useLogger(
    app.get(Logger)
  )

  app.use(bodyParser.json({ 
    limit: '50mb',
  }))
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }))

  await app.listen(configService.get<number>('PORT', { infer: true }) ?? 3000)
}

bootstrap()

