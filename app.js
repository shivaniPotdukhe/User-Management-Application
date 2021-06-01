const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const routes = require('./routes/index');
const { notFoundResponse } = require('./helper/apiResponse');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', routes);

// throw 404 if URL not found
app.all('*', function (req, res) {
  return notFoundResponse(res, 'Not found');
});

app.listen(5001, (err) => {
  if (err)
    console.log('Error in connecting to server..', err);
  else
    console.log('Server started at port 5001');
});