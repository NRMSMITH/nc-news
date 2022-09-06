const db = require('../../db/connection')

exports.selectArticleById = (article_id) => {
        return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "article id does not exist"})
            }
            else {
                return result.rows[0]
            }
        });
    };


exports.updateArticleVoteById = (article_id, update) => {
    const { inc_votes } = update
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING*`, [inc_votes, article_id])
    .then((result) => {
        return result.rows[0]
    })
}