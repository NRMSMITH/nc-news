const express = require('express');
const { getTopics } = require('./api/controllers/topics.controllers')
const { handleCustomErrors, handleInternalServerErrors, allMethodErrors, handlePSQLErrors } = require('./api/controllers/errors.controllers')
const { getArticleById, patchArticleVotesById, getArticles } = require('./api/controllers/articles.controllers')
const { getUsers } = require('./api/controllers/users.controllers')
const {getCommentsById, postCommentsById, deleteComment} = require('./api/controllers/comments.controllers')
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/articles/:article_id/comments`, getCommentsById)
app.get(`/api/users`, getUsers)

app.patch(`/api/articles/:article_id`, patchArticleVotesById);

app.post(`/api/articles/:article_id/comments`, postCommentsById)

app.delete(`/api/comments/:comment_id`, deleteComment)

app.all('*', allMethodErrors);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalServerErrors);



module.exports = app;