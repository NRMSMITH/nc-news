const express = require('express');
const { getTopics } = require('./controllers/topics.controllers')
const { handleCustomErrors, handleInternalServerErrors, allMethodErrors, handlePSQLErrors } = require('./controllers/errors.controllers')
const { getArticleById } = require('./controllers/articles.controllers')
const { getUsers } = require('./controllers/users.controllers')
const app = express();


app.get('/api/topics', getTopics);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/users`, getUsers)



app.all('*', allMethodErrors);


app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalServerErrors);



module.exports = app;