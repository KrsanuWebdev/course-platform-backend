import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DB_URL');
        if (!dbUrl) {
          throw new Error('DB_URL is not defined in .env');
        }

        const maskMongoUrl = (url: string) =>
          url.replace(/\/\/(.*):(.*)@/, '//****:****@');

        // console.log(`Connecting to MongoDB: ${maskMongoUrl(dbUrl)}`);

        return {
          uri: dbUrl,
          serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true,
          },
          serverSelectionTimeoutMS: 5000,
          connectionFactory: (connection) => {
            console.log(`Connected to database: ${connection.name}`);

            connection.on('connected', () =>
              console.log('MongoDB connection established'),
            );
            connection.on('error', (err) =>
              console.error('MongoDB connection error', err),
            );
            connection.on('disconnected', () =>
              console.warn('MongoDB disconnected'),
            );

            return connection;
          },
        };
      },
    }),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {}
