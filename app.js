const AvailableAssets = require('./src/server/models/AvailableAssets');
const AvailableExchanges = require('./src/server/models/AvailableExchanges');

// Include the cluster module
const cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    const cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
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
    const AWS = require('aws-sdk');
    const express = require('express');
    const bodyParser = require('body-parser');

    // AWS.config.region = process.env.REGION;
    AWS.config.region = 'us-west-2';
    AWS.config.endpoint = 'http://localhost:8000';
    // AWS.config.aws_access_key_id = 'AKIAJSAVW2XLH4FAM6BA';
    // AWS.config.aws_secret_access_key = '6rRXLubwNWI2ccv6kvH4BiwjXJalpKRwjC52dX4';

    const db = new AWS.DynamoDB;
    const docClient = new AWS.DynamoDB.DocumentClient();

    // const ddbTable =  process.env.STARTUP_SIGNUP_TABLE;

    const app = express();

    app.use(express.static(`${__dirname}/dist`));
    app.set('views', `${__dirname}/dist`);
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/asset-list/:action?', (req, res) => {
        const action = req.params.action;

        const availableAssets = new AvailableAssets({db, docClient});

        try {
            console.log('action', action);

            availableAssets[action]()
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                });
        } catch (err) {
            console.warn('error getting action', action);
            res.send(`Invalid request asset-list/${action}`);
        }
    });

    app.get('/exchange-list/:action?', (req, res) => {
        const action = req.params.action;

        const availableExchanges = new AvailableExchanges({db, docClient});

        try {
            console.log('action', action);

            availableExchanges[action]()
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                });
        } catch (err) {
            console.warn('error getting action in exchange-list endpoint', action);
            res.send(`Invalid request exchange-list/${action}`);
        }
    });

    app.use((req, res) => {
        res.send('<h1>404!<br>Page not found</h1>');
    });

    // const port = process.env.PORT || 3000;
    const port = process.env.PORT || 8081;

    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}