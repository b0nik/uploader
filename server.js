global.api={};
api.bodyParser  = require('body-parser');
api.fs=require('fs');
api.formidable = require('formidable')
api.express=require('express');

var app = api.express();

app.use(api.express.static(__dirname+'/static/'));
app.use(api.bodyParser.json()); // for parsing application/json
app.use(api.bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/',function (req, res) {
    res.sendFile(__dirname+'/static/index.html')
});

app.post('/upload', function (req, res) {
    var form = new api.formidable.IncomingForm();
    form.uploadDir=__dirname+'/catalog/';
    form.keepExtensions = true;

    form.parse(req)
        // .on ('fileBegin', function(name, file){
        //     file.path = form.uploadDir + "/" + file.name;
        // })
        .on('end', function() {
            res.status(200).send('OK')
        })
        .on('error', function(err) {
            console.log(err)
        });
});

app.listen(3000,console.log("listen at port 3000"));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.end(err.message);
        //res.render('error', {
        //  message: err.message,
        //  error: err
        //});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end(err.message);
    //res.render('error', {
    //  message: err.message,
    //  error: {}
    //});
});