// Include the cluster module
var cluster = require('cluster');
// require('babel-polyfill');

// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {
        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

// Code to run if we're in a worker process
} else {
    var AWS = require('aws-sdk');
    var express = require('express');
    var bodyParser = require('body-parser');

    AWS.config.region = process.env.REGION

    var sns = new AWS.SNS();
    var ddb = new AWS.DynamoDB();

    var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;
    var snsTopic =  process.env.NEW_SIGNUP_TOPIC;
    var app = express();

    app.use(express.static(`${__dirname}/dist`));
    app.set('views', __dirname + '/dist');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(bodyParser.urlencoded({extended:true}));

    app.get('/:currency/:nextCurrency', function(req, res) {
        console.log('param', req.params);
        res.render('index.html', {
            currency: req.params.currency,
            nextCurrency: req.params.nextCurrency,
        });
    });
    // app.get('/*', function(req, res) {
    //     setTimeout(() => {
    //         res.json({'myName': 'adam eliot'});
    //     }, 200);
    // });

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}