import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'courses' })
export class Course extends Document {
  @Prop({ required: true })
  courseName: string;

  @Prop()
  description?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Category', required: true, index: true })
  categories: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'SubCategory', required: true, index: true })
  subCategories: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
