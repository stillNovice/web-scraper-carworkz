import express from 'express';
import request from 'request-promise';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import chalk from 'chalk';

import config from '../config/config';

import mainRoute from '../routes/mainRoute';
import searchRoute from '../routes/searchRoute';

const mongo_url = config.mongo_url;
const db_name = config.db_name;

// connect database
mongoose.connect(mongo_url + db_name, function(err) {
  if(err) {
    throw err;
  }
  console.log(chalk.green(`connected to ${db_name} database`));
});

const PORT = process.env.PORT | 3000;
const app = express();

// setup morgan logger
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRoute);
app.use('/garage', searchRoute);

app.listen(PORT, () => {
  console.log(chalk.green(`app started @ ${PORT}`));
});