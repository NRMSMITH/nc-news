const db = require('../../db/connection')

exports.selectArticleById = (article_id) => {
    if (!parseInt(article_id)) {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    } else {
        return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then((result) => {
            return result.rows[0]
        });
    }
};