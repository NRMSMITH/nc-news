const { selectArticleById, updateArticleVoteById, selectArticles } = require('../models/articles.models')

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({articles})
  })
  .catch(next)
}

exports.getArticleById = (req, res, next) => {
const {article_id} = req.params;
  selectArticleById(article_id).then((result) => {
    res.status(200).send({result})
  })
  .catch(next)
};

exports.patchArticleVotesById = (req, res, next) => {
  const update = req.body;
  const {article_id} = req.params;
  updateArticleVoteById(article_id, update)
  .then((article) => {
    res.status(200).send({article})
  })
  .catch(next)
 }