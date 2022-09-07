const db = require('../../db/connection')


exports.selectArticleById = (article_id) => {
    return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.votes, articles.created_at, COUNT(comments.article_id):: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "article id does not exist"})
        }
        else {
            return result.rows[0]
        }
    });
};

exports.selectArticles = () => {
    return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.votes, articles.created_at, COUNT(comments.article_id):: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`).then((result) => {
        return result.rows
    })
}


exports.updateArticleVoteById = (article_id, update) => {
    const { inc_votes } = update
    if (typeof inc_votes !== 'number'){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    } 
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING*`, [inc_votes, article_id])
    .then((result) => {
        if(result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        } else {
            return result.rows[0]
        }
    })
}