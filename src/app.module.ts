import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items/entities/item.entity';
import { ItemsModule } from './items/items.module';
import { ContainersModule } from './containers/containers.module';
import { Container } from './containers/entities/container.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from "./users/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath:['.env.development.local, .env.development']
      }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Item, Container, User],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    ItemsModule,
    ContainersModule,
    AuthModule,
    UsersModule,
    JwtModule.register({}),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
