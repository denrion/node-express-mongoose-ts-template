import mongoose, { Schema } from 'mongoose';

const sanitizeSpecifiedFields = (schema: Schema, fieldsToExclude: string[] = []) => {
  const toJSON = schema.methods.toJSON || mongoose.Document.prototype.toJSON;

  schema.set('toJSON', {
    virtuals: true,
  });

  schema.methods.toJSON = function (...args: string[]) {
    const json = toJSON.apply(this, args);

    fieldsToExclude.forEach((el) => delete json[el]);

    return json;
  };
};

export default sanitizeSpecifiedFields;
