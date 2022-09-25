const db = require('../../db/connection')

exports.selectArticles = (topic, sort_by ='created_at', order = 'asc') => {
    const validColumns = ["title", "topic", "author", "body", "created_at", "votes"];
    const validOrder = ["asc", "desc"];
   return db.query(`SELECT * FROM topics;`).then((topics) => {
     const validTopics = topics.rows.map(currTopic => {
         return  currTopic.slug
        })
        const queryVals = []
        let queryStr = `SELECT
        articles.article_id, articles.title, articles.topic, articles.author, articles.votes, articles.created_at, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `
        if(topic) {
        if (!validTopics.includes(topic)) {
            return Promise.reject({ status: 404, msg: "Article topic does not exist"})
         } else {
            queryStr = queryStr + `WHERE articles.topic = $1 `
            queryVals.push(topic)
         }
        }
        queryStr = queryStr + `GROUP BY articles.article_id `
        if(validColumns.includes(sort_by)) {
            queryStr = queryStr + `ORDER BY ${sort_by}`
        } else {
            return Promise.reject({ status: 400, msg: "Column does not exist"})
        }
        if(!validOrder.includes(order)) {
            return Promise.reject({
              status: 400,
              msg: "Invalid order request",
            });
        } else {
            queryStr = queryStr + ` ${order}`
        }
        return db.query(queryStr, queryVals)
    }).then((result) => { 
        return result.rows
    })

}
    
exports.selectArticleById = (article_id) => {
    return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.votes, articles.created_at, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
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