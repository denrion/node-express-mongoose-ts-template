import status from 'http-status';
import { Model, QueryPopulateOptions } from 'mongoose';
import ResponseStatus from '../constants/ResponseStatus';
import APIFeatures from '../utils/APIFeatures';
import catchAsync from '../utils/catchAsync';
import InternalServerError from '../utils/errors/InternalServerError';
import NotFoundError from '../utils/errors/NotFoundError';
import lowercaseFirstLetter from '../utils/helpers/lowercaseFirstLetter';
import setCorrectPluralSuffix from '../utils/helpers/setCorrectPluralSuffix';

export const getAll = (Model: Model<any>) =>
  catchAsync(async (req, res, next) => {
    const filter = req.dbFilter || {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query;
    const totalResults = await Model.countDocuments();

    res.status(status.OK).json({
      status: ResponseStatus.SUCCESS,
      returnedResults: documents.length,
      totalResults,
      pagination: features.createPaginationLinks(totalResults),
      data: {
        [setCorrectPluralSuffix(lowercaseFirstLetter(Model.modelName))]: documents,
      },
    });
  });

export const getOne = (Model: Model<any>, populateOptions?: QueryPopulateOptions) =>
  catchAsync<{ id: string }>(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;

    if (!document) return next(new NotFoundError('No document found with the specified id'));

    res.status(status.OK).json({
      status: ResponseStatus.SUCCESS,
      data: {
        [setCorrectPluralSuffix(lowercaseFirstLetter(Model.modelName))]: document,
      },
    });
  });

export const createOne = (Model: Model<any>) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    if (!document)
      return next(
        new InternalServerError('Error occured while creating a document. Please, try again.')
      );

    res.status(status.CREATED).json({
      status: ResponseStatus.SUCCESS,
      data: {
        [setCorrectPluralSuffix(lowercaseFirstLetter(Model.modelName))]: document,
      },
    });
  });

export const updateOne = (Model: Model<any>) =>
  catchAsync<{ id: string }>(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) return next(new NotFoundError('No document found with the specified id'));

    res.status(status.OK).json({
      status: ResponseStatus.SUCCESS,
      data: {
        [setCorrectPluralSuffix(lowercaseFirstLetter(Model.modelName))]: document,
      },
    });
  });

export const deleteOne = (Model: Model<any>) =>
  catchAsync<{ id: string }>(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) return next(new NotFoundError('No document found with the specified id'));

    res.status(status.NO_CONTENT).json({ status: ResponseStatus.SUCCESS, data: null });
  });
