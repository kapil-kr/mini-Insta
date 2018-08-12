var express = require('express')
app = express();
var mongoose = require('mongoose');

// including middlewares
var config = require('./Server/configure')

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '\\views');

app = config(app)             // using middleware

mongoose.connect('mongodb://localhost/ProjImageShare');
mongoose.connection.on('open', function(){
        console.log('Connected to DB via Mongoose');
})


app.listen(app.get('port'), function(){
    console.log('Server up on: http://localhost:' + app.get('port'));
});
