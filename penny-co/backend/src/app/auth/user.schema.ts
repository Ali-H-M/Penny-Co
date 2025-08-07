import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;


 // User schema to define the structure of User documents in MongoDB
@Schema()
export class User extends Document {

  @Prop({require: true, unique: true})
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

// Create a Mongoose schema from the User class
export const UserSchema = SchemaFactory.createForClass(User);
