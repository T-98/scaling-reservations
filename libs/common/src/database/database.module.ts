import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        NestConfigModule.forRoot({
          validationSchema: Joi.object({
            MONGODB_URI: Joi.string().required(),
          }),
        }),
      ],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URI')!,
          serverSelectionTimeoutMS: 3000,
          // Optional: log mongo queries
          // debug: true, // Mongoose 8 supports this option
          connectionFactory: (conn) => {
            const states = [
              'disconnected',
              'connected',
              'connecting',
              'disconnecting',
              'unauthorized',
              'unknown',
            ];
            console.log(
              '[MongoDB] readyState at startup:',
              states[conn.readyState] ?? conn.readyState,
            );

            conn.on('connecting', () => console.log('[MongoDB] connecting'));
            conn.on('connected', () => console.log('[MongoDB] connected'));
            conn.once('open', () => console.log('[MongoDB] open (ready)'));
            conn.on('disconnected', () =>
              console.warn('[MongoDB] disconnected'),
            );
            conn.on('error', (err) => console.error('[MongoDB] error', err));

            // Optional: log queries for a minute to prove activity
            // conn.set('debug', true);

            return conn;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
