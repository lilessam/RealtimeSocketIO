module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var TasksController = require('../controllers/TasksController')(io);

    /* GET home page. */
    router.get('/', TasksController.getIndex);

    return router;
}