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
  ControllersModule
} from './controllers.module'

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
    ControllersModule,
  ],
})

export class AppModule {}

