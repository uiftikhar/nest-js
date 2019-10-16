import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { CatsModule } from './cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaModule } from './idea/idea.module';

@Module({
  imports: [
    // CatsModule,
    // GraphQLModule.forRoot({
    //   autoSchemaFile: 'schema.gql',
    // }),
    // MongooseModule.forRoot('mongodb://localhost/nest'),
    TypeOrmModule.forRoot(),
    IdeaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
