const db = require('../../db/connection')

exports.selectArticleById = (article_id) => {
        return db
        .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.votes, articles.created_at, COUNT(*):: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
        .then((result) => {
            console.log(result.rows)
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "article id does not exist"})
            }
            else {
                return result.rows[0]
            }
        });
    };