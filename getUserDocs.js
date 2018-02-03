const express = require('express');
var router = express.Router();

var User = require('./models/User');

 router.get("/", function(req, res) {

    var username = req.query.username;

    User.find({username: username}, function(err, userFound) {

        if(err) return res.status(200).json({status:'KO', message:'ops, ' + err, listDoc: ''});

        return res.status(200).json({status:'OK', message:'List documents', listDocument: userFound[0].listDocument});
    });
 });

module.exports = router;
