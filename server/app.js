const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const port = 5000;

dotenv.config({ path: './.env' });
require('./db/connection');

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./routes/auth'));




app.listen(port, () => console.log(`Backend started on port ${port}!`));