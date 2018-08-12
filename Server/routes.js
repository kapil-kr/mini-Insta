var express = require('express')

router = express.Router(),

home = require('../Controllers/home'),
image = require('../Controllers/image');

module.exports = function(app) {

    router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.post('/images', image.create);
    router.post('/images/:image_id/like', image.like);
    router.post('/images/:image_id/comment', image.comment);
    
    app.use(router);
    };