const {selectCommentsById, addCommentsById} = require('../models/comments.models')

exports.getCommentsById = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsById(article_id).then((comments) => {
        return res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentsById = (req, res, next) => {
    const {article_id} = req.params;
    const addedComment = req.body;
addCommentsById(article_id, addedComment).then((comment) => {
        return res.status(201).send({comment})
    }).catch(next)
}