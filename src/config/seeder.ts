import colors from 'colors';
import fs from 'fs';
import path from 'path';
import User from '../models/User/user.model';
import connectMongoDB from './connectMongoDB';
import './loadEnvironmentVariables';

connectMongoDB();

const users = JSON.parse(fs.readFileSync(path.resolve('__dev-data__', 'users.json'), 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log(colors.green.inverse('Data successfuly imported'));
  } catch (error) {
    console.error(colors.red(error));
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await User.deleteMany({});
    console.log(colors.red.inverse('Data successfuly deleted'));
  } catch (error) {
    console.error(colors.red(error));
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
