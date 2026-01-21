import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'subCategories' })
export class SubCategory extends Document {
  @Prop({ name: 'subCategoryId' })
  id: string;

  @Prop({ required: true, unique: true })
  subCategoryName: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
