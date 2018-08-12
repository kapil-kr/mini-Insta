var Stats = require('./stats'),
    Images = require('./image'),
    Comments = require('./comments');
    async = require('async');

module.exports = function(viewModel, callback){
    async.parallel([
        //calling all these functions in parallel
        function(next) {
            //calling stats module in sidebar
            Stats(next);
        },
        function(next) {
            //calling popular images module in sidebar
            Images.popular(next);
        },
        function(next) {
            //calling newest comments module in sidebar
            Comments.newest(next);
        }
    ], function(err, results){
            viewModel.sidebar = {
                stats: results[0],
                popular: results[1],
                comments: results[2]
            };
            callback(viewModel);
        }   
    );
};

/*
    viewModel.sidebar = {
        stats: Stats(),
        popular: Images.popular(),
        comments: Comments.newest()
    };
*/