var sidebar = require('../helpers/sidebar');
var ImageModel = require('../models').Image;

module.exports = {
    index: function(req, res) {
        //Stage 1: Sending text data back to client
        //res.send('The home:index controller');
        //Stage 2: Sending HTML back to client
        //res.render('index');

        //Stage 3: Sending a View Model

        var viewModel = {
            images : []           
            };
                
        ImageModel.find({},{}, {sort: {timestamp: -1}}, function(err, images) {
            if (err)
                {throw err;}
            viewModel.images = images;
            sidebar(viewModel, function(viewModel){
                res.render('index', viewModel);
            });
        });
    }
};

/* images:
    [ {
        uniqueId: 1,
        title: 'Sample Image 1',
        description: '',
        filename: 'sample1.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now
        },{
        uniqueId: 2,
        title: 'Sample Image 2',
        description: '',
        filename: 'sample2.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now
        }, {
        uniqueId: 3,
        title: 'Sample Image 3',
        description: '',
        filename: 'sample3.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now
        }, {
    
        uniqueId: 4,
        title: 'Sample Image 4',
        description: '',
        filename: 'sample4.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now
        }
    ]*/

//res.render('index', viewModel);