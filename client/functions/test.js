"use strict"

const http = require('http');
const HOST = `us-central1-jphacks2019-lifeleaf.cloudfunctions.net`;


// test_postIsSitting(true);
test_getIsSitting(true);

function test_getIsSitting(isSitting){
    var postData = {
        isSitting: isSitting
    };
    var postDataStr = JSON.stringify(postData);

    var options = {
        host: HOST,
        port: 80,
        path: "/getIsSitting",
        method: 'GET',
    };

    var req = http
        .request(options, (res) => {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log('BODY: ' + chunk);
            });
        })
        .on('error', (e) => {
            console.log('problem with request: ' + e.message);
        });

    // HTTPリクエストの送信
    req.write(postDataStr);

    req.end();
}

function test_postIsSitting(isSitting){
    var postData = {
        isSitting: isSitting
    };
    var postDataStr = JSON.stringify(postData);

    var options = {
        host: HOST,
        port: 80,
        path: "/postIsSitting",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postDataStr)
        }
    };

    var req = http
        .request(options, (res) => {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log('BODY: ' + chunk);
            });
        })
        .on('error', (e) => {
            console.log('problem with request: ' + e.message);
        });

    // HTTPリクエストの送信
    req.write(postDataStr);

    req.end();
}
