var fs = require('fs')
    path = require ('path');
var sidebar = require('../helpers/sidebar');
Models = require('../models');
md5 = require('MD5'); // for Gravatar

module.exports = {
    index: function(req, res) {
        //Stage 1: return the text to client
        //res.send('The image:index controller ' +
        //req.params.image_id);

        // Stage 2: return the HTML
        //res.render('image');
        
        var viewModel = {
            image : {},
            comments: []
            /*image: {
                uniqueId: 1,
                title: 'Sample Image 1',
                description: 'This is a sample.',
                filename: 'sample1.jpg',
                views: 0,
                likes: 0,
                timestamp: Date.now()
            },
            comments: [
            {
                image_id: 1,
                email: 'test@testing.com',
                name: 'Test Tester',
                gravatar: 'http://lorempixel.com/75/75/animals/1',
                comment: 'This is a test comment...',
                timestamp: Date.now()
            },{
                image_id: 1,
                email: 'test@testing.com',
                name: 'Test Tester',
                gravatar: 'http://lorempixel.com/75/75/animals/2',
                comment: 'Another followup comment!',
                timestamp: Date.now()
                }
            ] */

            };

            Models.Image.findOne({filename: {$regex: req.params.image_id}}, function(err, image){
                if (err)
                    {throw err;}
                if (image)
                {
                    image.views = image.views + 1; // incrementing the views of the image
                    viewModel.image = image;       
                    image.save();
                    // including the comments associated with the image.
                    Models.Comment.find({ image_id: image._id}, {}, { sort: {'timestamp': 1 }},function(err, comments){
                        if (err) 
                            { throw err; }
                        viewModel.comments = comments;
                        
                        sidebar(viewModel, function(viewModel) {
                            res.render('image', viewModel);
                            });
                        });
                }
                else
                {
                    //No image found simply go to the homepage
                    res.redirect('/');
                }                
            })
            // res.render('image', viewModel);    
        },
    create: function(req, res) {
            // Stage 1:
            //res.send('The image:create POST controller');
            //console.log(req.body);
            //console.log(req.body.file);
            var saveImage = function()
            {
                var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                    imgUrl = '';
                for(var i=0; i < 6; i+=1)
                {
                    imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                //search for an image with the same filename
                Models.Image.find({ filename: imgUrl }, function(err, images) {
                    if (images.length > 0) {
                        saveImage();        // name already exists in DB call saveImage again to choose another random name 
                        } 
                    else {
                        //var tempPath = req.files.file.path,
                        var tempPath = req.body.file,
                        ext = path.extname(req.body.file).toLowerCase(),
                        targetPath = path.resolve('./Public/upload/' + imgUrl + ext);
    
                        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext ==='.gif') 
                        {
                            fs.rename(tempPath, targetPath, function(err) {
                                    if (err) throw err;
                                // create a new Image model, populate its details:
                                var newImg = new Models.Image({
                                    title: req.body.title,
                                    filename: imgUrl + ext,
                                    description: req.body.description
                                    });
                                // and save the new Image
                                newImg.save(function(err, image) {
                                    res.redirect('/images/' + image.uniqueId);
                                    });
                            });
                        } 
                        else {
                                fs.unlink(tempPath, function () {
                                        if (err) throw err;
                                    res.json(500, {error: 'Only image files are allowed.'});
                                });
                            }
                        }
                    });
                    
            };
            saveImage();
        },
    like: function(req, res) {
        Models.Image.findOne({filename: {$regex: req.params.image_id}}, function(err, image){
            if (err)
                {throw err;}
            if (image)
            {
                image.likes = image.likes + 1; // incrementing the views of the image
                image.save(function(err) {
                    if (err) { res.json(err); } 
                    else { res.json({ likes: image.likes }); }
                });       
                
            }
        })
        //res.json({likes: 1});
    },
    comment: function(req, res) {
        //create a new comment model, populate its details:
        Models.Image.findOne({filename: {$regex : req.params.image_id}}, function (err, image){
            if(!err && image)
            {
                var newComment = new Models.Comment(req.body);
                newComment.gravatar = md5(newComment.email);
                newComment.image_id = image._id;
                newComment.save(function(err, comment) {
                    if (err) { throw err; }
                    res.redirect('/images/' + image.uniqueId + '#' + comment._id);
                });
            } 
            else { res.redirect('/');}
            
        })
        
        //res.send('The image:comment POST controller');
        }
    };