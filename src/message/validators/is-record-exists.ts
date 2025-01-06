import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({async: true})
class IsRecordExistsConstraint implements ValidatorConstraintInterface {
  async validate(id: string, args: ValidationArguments): Promise<boolean> {
    const modelName = args.constraints[0];
    const model = mongoose.models[modelName];

    if (!model) {
      throw new Error(`Model ${modelName} not found in Mongoose.`);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const record = await model.findById(id);
    return !!record;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Record with ID ${args.value} does not exist.`;
  }
}

const IsRecordExists = (
  modelName: string,
  validationOptions?: ValidationOptions,
) => function (object: Object, propertyName: string) {
  registerDecorator({
    target: object.constructor,
    propertyName: propertyName,
    options: validationOptions,
    constraints: [modelName],
    validator: IsRecordExistsConstraint,
  });
};

export default IsRecordExists;