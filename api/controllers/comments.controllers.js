const { reduce } = require('../../db/data/test-data/articles');
const {selectCommentsById, addCommentsById, removeComment} = require('../models/comments.models')

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

exports.deleteComment = (req, res, next) => {
    const comment_id = req.params.comment_id;
    removeComment(comment_id)
    .then((deletedComment) => {
        if (deletedComment) {
            res.sendStatus(204);
        } else {
            return Promise.reject({ status: 404, msg: 'Comment Not Found'})
        }
    })
    .catch(next);
}