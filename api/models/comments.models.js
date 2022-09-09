const db = require('../../db/connection')


exports.selectCommentsById = (article_id) => {

const commentsQuery = db.query(`SELECT * FROM comments WHERE article_id =$1`, [article_id])
 const articleQuery = db.query(`SELECT * FROM articles WHERE article_id =$1;`, [article_id])
        
    return Promise.all([commentsQuery, articleQuery]).then(([commentsQueryResult, articleQueryResult]) => {
        if (articleQueryResult.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article ID does not exist"})
        }
        else return commentsQueryResult.rows
        
    })
}
