const { selectArticleById } = require('../models/articles.models')

exports.getArticleById = (req, res) => {
const {article_id} = req.params;
  selectArticleById(article_id).then((result) => {
    res.status(200).send({result})
  });
};