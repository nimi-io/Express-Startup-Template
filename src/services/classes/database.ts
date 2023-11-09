import {
  HydratedDocument,
  Model,
  FilterQuery,
  QueryOptions,
  ProjectionType,
  Require_id,
  CreateOptions,
  UpdateQuery,
  Schema,
  UpdateWithAggregationPipeline,
} from "mongoose";
import {
  IPaginateResult,
  IDefaultPaginationOptions,
  IGetMetaProps,
  IMeta,
} from "../../types/db";
import { injectable } from "inversify";
export class AbstractRepository<TSchema> {
  constructor(private readonly schemaModel: Model<TSchema>) {}

  model() {
    return this.schemaModel;
  }

  async findOne(
    schemaFilterQuery: FilterQuery<TSchema>,
    options?: QueryOptions<TSchema>,
    projection?: ProjectionType<TSchema>
  ) {
    return this.schemaModel
      .findOne(schemaFilterQuery, projection, {
        projection: { __v: 0 },
        ...options,
      })
      .lean<TSchema>();
  }

  async find(
    schemaFilterQuery: FilterQuery<TSchema>,
    options?: QueryOptions<TSchema>,
    projection?: ProjectionType<TSchema>
  ) {
    return this.schemaModel
      .find(schemaFilterQuery, projection, {
        projection: { __v: 0 },
        ...options,
      })
      .lean<TSchema[]>();
  }

  async create(
    createSchemaData: Partial<Omit<Require_id<TSchema>, "_id">>,
    options?: CreateOptions
  ): Promise<TSchema> {
    return this.schemaModel
      .create([createSchemaData], options)
      .then((res) => res[0]);
    // const schema = new this.schemaModel(createSchemaData);
    // return schema.save();
  }

  async createMany(
    createSchemaData: Array<Partial<Omit<Require_id<TSchema>, "_id">>>
  ): Promise<TSchema[]> {
    return this.schemaModel
      .insertMany(createSchemaData, { lean: true })
      .then((res) => res) as Promise<TSchema[]>;
  }

  async count(schemaFilterQuery: FilterQuery<TSchema>): Promise<number> {
    return this.schemaModel.find(schemaFilterQuery).countDocuments().lean();
  }

  async findAndPaginate(
    schemaFilterQuery: FilterQuery<TSchema>,
    options = this.DEFAULTPAGINATIONOPTIONS
  ): Promise<IPaginateResult<TSchema[] | null>> {
    const { limit = 10, page = 1 } = options;
    const [data, total] = await Promise.all([
      this.schemaModel
        .find(schemaFilterQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean<TSchema[]>(),
      this.count(schemaFilterQuery),
    ]);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<TSchema>,
    updateData: UpdateQuery<TSchema>,
    options?: QueryOptions<TSchema> & { upsert: true }
  ): Promise<TSchema | null> {
    return this.schemaModel.findOneAndUpdate(entityFilterQuery, updateData, {
      new: true,
      ...(options && options),
    });
  }

  async update(
    id: Schema.Types.ObjectId | string,
    updateSchemaData: UpdateQuery<TSchema>,
    options?: QueryOptions<TSchema>
  ): Promise<unknown> {
    return this.schemaModel.findByIdAndUpdate(id, updateSchemaData, {
      ...(options || {}),
      new: true,
    });
  }

  async updateMany(
    schemaFilterQuery: FilterQuery<TSchema>,
    updateData: UpdateWithAggregationPipeline | UpdateQuery<TSchema>,
    options?: QueryOptions<TSchema>
  ): Promise<boolean> {
    const updateResult = await this.schemaModel.updateMany(
      schemaFilterQuery,
      updateData,
      options
    );
    return updateResult.matchedCount >= 1;
  }

  async findOneAndDelete(
    schemaFilterQuery: FilterQuery<TSchema>,
    options: QueryOptions<TSchema>
  ): Promise<TSchema | null> {
    return this.schemaModel.findOneAndDelete(schemaFilterQuery, options);
  }

  async delete(id: Schema.Types.ObjectId | string): Promise<unknown> {
    return this.schemaModel.findByIdAndDelete(id);
  }

  async deleteMany(entityFilterQuery: FilterQuery<TSchema>): Promise<boolean> {
    const deleteResult = await this.schemaModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  private DEFAULTPAGINATIONOPTIONS: IDefaultPaginationOptions = {
    limit: 10,
    page: 1,
  };

  protected getMeta({
    total,
    data,
    limit,
    page,
  }: IGetMetaProps<TSchema>): IMeta {
    return {
      totalItems: total,
      count: data?.length,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
