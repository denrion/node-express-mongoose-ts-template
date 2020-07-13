import mongoose, { Schema } from 'mongoose';

const sanitizeMongooseFields = (schema: Schema) => {
  const toJSON = schema.methods.toJSON || mongoose.Document.prototype.toJSON;

  schema.set('toJSON', {
    virtuals: true,
  });

  schema.methods.toJSON = function (...args: string[]) {
    const json = toJSON.apply(this, args);

    delete json._id;
    delete json.__v;
    delete json.updatedAt;
    delete json.createdAt;

    return json;
  };
};

export default sanitizeMongooseFields;
