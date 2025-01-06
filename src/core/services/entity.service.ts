import { Model } from 'mongoose';
import { BadRequestException } from 'light-kite';

class EntityService<T> {
  constructor(protected model: Model<T>) {}

  async getAll(): Promise<T[]> {
    return this.model.find({});
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async getById(id: string): Promise<T> {
    const entity: T | null = await this.model.findById(id);

    if (!entity) throw new BadRequestException(`${this.model.modelName} not found`);

    return entity;
  }
}

export default EntityService;