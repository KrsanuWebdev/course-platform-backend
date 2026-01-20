import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'categories' })
export class Category extends Document {
  @Prop({ name: 'categoryId' })
  id: string;

  @Prop({ required: true, unique: true })
  categoryName: string;

  @Prop({ required: true })
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
