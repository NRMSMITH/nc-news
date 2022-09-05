const express = require('express');
const { getTopics } = require('./controllers/topics.controllers')
const { handleCustomErrors, handleInternalServerErrors, allMethodErrors } = require('./controllers/errors.controllers')

const app = express();
app.use(express.json());


app.get('/api/topics', getTopics);

app.all('*', allMethodErrors);

app.use(handleCustomErrors);

app.use(handleInternalServerErrors);



module.exports = app;