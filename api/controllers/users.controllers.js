const { selectUsers } = require("../models/users.models")
exports.getUsers = (req, res, next) => {
    selectUsers().then((results) => {
        res.status(200).send({users: results})
    })
    .catch(next);
}