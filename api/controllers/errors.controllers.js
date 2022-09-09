exports.allMethodErrors = (req, res) => {
    res.status(404).send({msg: 'Not Found'})
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg){
     res.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
};

exports.handlePSQLErrors = (err, req, res, next) => {
    console.log(err)
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({msg: "Bad Request"})
    } else if (err.code === '23503') {
        res.status(404).send({msg: 'Does not exist'})
    } else {
        next(err);
    }
}

exports.handleInternalServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Internal server error'});
};