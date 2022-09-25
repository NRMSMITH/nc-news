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

exports.addCommentsById = (article_id, addedComment) => {
    const articleQuery = db.query(`SELECT * FROM articles WHERE article_id =$1;`, [article_id])
    const insertCommentsQuery = db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING*;`, [addedComment.username, addedComment.body, article_id])

    return Promise.all([articleQuery, insertCommentsQuery]).then(([articleQueryResult, insertCommentsQueryResult]) => {
        if (articleQueryResult.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article ID does not exist"})
        } else {
            return insertCommentsQueryResult.rows[0]
        }
    })
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then((results) => {
        return results.rows[0]
    })
}
