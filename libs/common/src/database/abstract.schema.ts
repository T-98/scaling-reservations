/*
* Abstract Schema in Mongoose
* Definition: An abstract schema acts as a blueprint for defining the common structure of database
  documents. In Mongoose, you typically use the @Schema() decorator to define such schemas.
* Purpose: It can contain properties that will be shared across multiple document schemas.
* For example, the _id field, which is automatically generated for each MongoDB document.
* This allows you to minimize code duplication by inheriting shared properties.
 *
 * */
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
/*
 * @Schema() Decorator: This marks a class as a schema definition for a MongoDB document.
 * This is how you signal that a class serves as a structure for database documents.*/
@Schema()
export class AbstractDocument {
  //Prop() decorator defines fields for your document schema.
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
