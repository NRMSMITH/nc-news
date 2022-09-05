const { selectTopics } = require('../models/topics.models')


exports.getTopics = (req, res, next) => {
    selectTopics().then((results) => {
        res.status(200).send({topics: results})
    })
    .catch(next);
}