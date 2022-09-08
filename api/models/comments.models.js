const db = require('../../db/connection')


exports.selectCommentsById = (article_id) => {
    return db.query(`SELECT * FROM articles;`).then((articles) => {
        const validIds = articles.rows.map(currId => {
            return currId.article_id
        }); 
            if(!validIds.includes(+article_id)) {
                return Promise.reject({ status: 404, msg: "Article ID does not exist"})
            } else {
                return db.query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
        }
    
    }).then((result) => {
    return result.rows
})

}