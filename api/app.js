const express = require('express');
const { getTopics } = require('./controllers/topics.controllers')
const { handleCustomErrors, handleInternalServerErrors, allMethodErrors, handlePSQLErrors } = require('./controllers/errors.controllers')
const { getArticleById, patchArticleVotesById } = require('./controllers/articles.controllers')
const { getUsers } = require('./controllers/users.controllers')
const app = express();
app.use(express.json());


app.get('/api/topics', getTopics);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/users`, getUsers)

app.patch(`/api/articles/:article_id`, patchArticleVotesById);

app.all('*', allMethodErrors);


app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalServerErrors);



module.exports = app;