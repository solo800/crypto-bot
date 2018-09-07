// const assets = require('./src/assets');
const AvailableAssets = require('./src/server/models/AvailableAssets');

// Include the cluster module
const cluster = require('cluster');

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

    // AWS.config.region = process.env.REGION;
    AWS.config.region = 'us-west-2';
    AWS.config.endpoint = 'http://localhost:8000';
    // AWS.config.aws_access_key_id = 'AKIAJSAVW2XLH4FAM6BA';
    // AWS.config.aws_secret_access_key = '6rRXLubwNWI2ccv6kvH4BiwjXJalpKRwjC52dX4';

    var db = new AWS.DynamoDB();

    // var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;

    var app = express();

    app.use(express.static(`${__dirname}/dist`));
    app.set('views', `${__dirname}/dist`);
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(bodyParser.urlencoded({extended: true}));

    // app.get('/', function(req, res) {
    //     res.render('index.html');
    // });

    app.get('/assets-list', (req, res) => {
        const availableAssets = new AvailableAssets(db);

        availableAssets.getAssets(db).then(result => {
            res.json(result);
        }).catch(err => {
            res.json(err);
        });
        // describeTable(db)
        //     .then(res => {
        //         console.log('found table', res);
        //
        //         // saveAssets(db)
        //         //     .then(res => {
        //         //         console.log('results of saving assets', res);
        //         //     })
        //         //     .catch(err => {
        //         //         console.log('error saving assets', err);
        //         //     });
        //     })
        //     .catch(err => {
        //         createTable(db)
        //             .then(res => {
        //                 // add data to table
        //                 console.log('in create then');
        //                 saveAssets(db)
        //                     .then(res => {
        //                         console.log('results of saving assets after creating table', res);
        //                     })
        //                     .catch(err => {
        //                         console.log('error saving assets after creating table', err);
        //                     });
        //             });
        //     });

        // res.json(assets);
    });

    // app.get('/:currency/:nextCurrency', function(req, res) {
    //     setTimeout(() => {
    //         res.json({
    //             currency: req.params.currency,
    //             nextCurrency: req.params.nextCurrency,
    //         });
    //     }, 2000);
    // });

    // var port = process.env.PORT || 3000;
    const port = process.env.PORT || 8081;

    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}