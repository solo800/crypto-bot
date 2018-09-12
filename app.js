const Assets = require('./src/server/models/Assets');
const Exchanges = require('./src/server/models/Exchanges');
const Symbols = require('./src/server/models/Symbols');
const OpenHighLowCloseVolume = require('./src/server/models/OpenHighLowCloseVolume');

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

    app.get('/ohlcv/:symbol/:startDate/:endDate', (request, response) => {
        try {
            const symbol = request.params.symbol;
            const startDate = request.params.startDate;
            const endDate = request.params.endDate;

            const ohlcv = new OpenHighLowCloseVolume({db, docClient});

            console.log(`Symbol: ${symbol} Start: ${startDate} End: ${endDate}`);

            ohlcv.get(symbol, startDate, endDate)
                .then(result => {
                    console.log('result', result);
                    response.send(result.data)
                })
                .catch(error => {
                    console.warn('error', error);
                    response.send(error)
                });
        } catch (error) {
            console.warn('error in ohlcv endpoint');
            response.send(error);
        }
    });

    app.get('/:tableName/:action?', (request, response) => {
        try {
            console.log('tableName', request.params.tableName, 'action', request.params.action);

            let model;

            switch (request.params.tableName) {
                case 'assets':
                    model = new Assets({db, docClient});
                    break;
                case 'exchanges':
                    model = new Exchanges({db, docClient});
                    break;
                case 'symbols':
                    model = new Symbols({db, docClient});
                    break;
                default:
                    response.send(`Error, ${request.params.tableName}/${request.params.action}`);
            }

            if (request.params.tableName === 'assets' || request.params.tableName === 'exchanges') {
                model[request.params.action]()
                    .then(result => {
                        console.log('res in app.js', result);
                        response.json(result);
                    })
                    .catch(error => {
                        console.warn('error in app.js', error);
                        response.send(error);
                    });
            } else {
                console.warn('tableName', request.params.tableName, request.params.action);
            }
        } catch (error) {
            console.warn('error getting action in assets endpoint', request.params.action);
            response.send(`Invalid request assets/${request.params.action}`);
        }
    });

    app.use((request, response) => {
        response.send('<h1>404!<br>Page not found</h1>');
    });

    // const port = process.env.PORT || 3000;
    const port = process.env.PORT || 8081;

    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}