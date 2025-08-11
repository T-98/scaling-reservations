/*
* TDocument in TypeScript functions as a generic type, much like templates in C++. It allows you to
*  define a repository that can handle various document types that extend from an abstract document
*  class.

How It Works:
Generic Flexibility: By using TDocument, you ensure that any class extending your Abstract Repository
*  can operate on a specific document type. This customization enables the repository to perform
* CRUD operations while maintaining type safety.

Extending Functionality: TDocument must adhere to the structure defined in the abstract document
* class. This is similar to how C++ templates ensure that any instantiation conforms to specified
* constraints, promoting code reusability and reducing duplication.

Data Operations: In the abstract repository, common database functions (like create, read, update,
* delete) are implemented to work with the specific document types passed as TDocument.
* This way, you don't have to replicate CRUD logic in separate repositories for each document type.

Example:
Let’s say you have an abstract document class defining that all documents have _id.
* Now, by using TDocument, any specific repository can handle different document types
* while still benefiting from the common functionality defined in the abstract repository.
* This arrangement streamlines your code and enhances maintainability.
* */
import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<any>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }
}
