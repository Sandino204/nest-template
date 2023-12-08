import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AuthModule} from "./modules/auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./modules/auth/entities/user.entity";

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: "localhost",
        port: parseInt("5432", 10),
        username: "postgres",
        password: "12345",
        autoLoadEntities: true,
        synchronize: true,
        entities: [User]
  }),
    AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
