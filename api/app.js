const express = require('express');
const { getTopics } = require('./controllers/topics.controllers')
const { handleCustomErrors, handleInternalServerErrors, allMethodErrors } = require('./controllers/errors.controllers')
const { getArticleById } = require('./controllers/articles.controllers')
const app = express();


app.get('/api/topics', getTopics);
app.get(`/api/articles/:article_id`, getArticleById);



app.all('*', allMethodErrors);



app.use(handleCustomErrors);

app.use(handleInternalServerErrors);



module.exports = app;