import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CreateCatDto {
  @Field()
  readonly name: string;
  @Field(() => Int)
  readonly age: number;
  @Field()
  readonly breed: string;
}
