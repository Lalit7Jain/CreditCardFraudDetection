var express = require('express');
var app = express();
var http = require("http");

var https = require("https");

var querystring = require("querystring");

var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));


var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_IPORT || 3000;

app.listen(port, ipaddress);

app.post("/test",test);
app.post("/live-data",liveData);

//maml-server.js
var result = '';

function liveData(req, res){
    var data = req.body;
    var path = '/workspaces/45b46042032542099deeace0661fa453/services/ce90e5443ed744118ef6c25cb11c53f0/execute?api-version=2.0&details=true';
    var key = '4GQwhA8dWDWV67bQBfSwYTyEVU3NjmyWl0NlWKfo1jEVfa6FLEKmIKCpWSUb9o7f93Zb8k9PZITGdcM6OQT5VQ==';
    getPred(data, path, key);
    setTimeout(function() {
        res.json(result);
    }, 800);
}

function test(req, res){
    var data = req.body;
    console.log(data);
    var path = '/workspaces/0e6e3268518847ab90cb1087c291e541/services/73de7741b0cf4a12b3d15d46f27d0ea3/execute?api-version=2.0&details=true';
    var key = 'UnWT75iaqAPE4VCDlgCBCGKueyThymFlLa7uygBBNb15tmKP/qXsYcZTHAffgUZbX1WjKd2UcoDv0av1HySOiw==';
    getPred(data, path, key);
    setTimeout(function() {
        console.log(result);
        res.json(result);
    }, 3000);

}

function getPred(data, path, api_key) {

    var dataString = JSON.stringify(data);    
    var host = 'ussouthcentral.services.azureml.net';
    var headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api_key};

    var options = {
        host: host,
        port: 443,
        path: path,
        method: 'POST',
        headers: headers
    };

    result = '';
    var reqPost = https.request(options, function (res) {
        res.on('data', function (d) {
            setTimeout(function() {
                //process.stdout.write(d);
                result = '';
                result += d;
            }, 2000);
            //return d;
        });
    });

// Would need more parsing out of prediction from the result
    reqPost.write(dataString);
    reqPost.end();
    reqPost.on('error', function (e) {
        console.error(e);

    });
    //console.log(result);
    //return result;
}

function send404Reponse(response) {
    response.writeHead(404, {"Context-Type": "text/plain"});
    response.write("Error 404: Page not Found!");
    response.end();
}

function onRequest(request, response) {
    if(request.method == 'GET' && request.url == '/' ){
        response.writeHead(200, {"Context-Type": "text/plain"});
        fs.createReadStream("./index.html").pipe(response);
    }else {
        send404Reponse(response);
    }
}

http.createServer(onRequest).listen(8050);
//buildFeatureInput();