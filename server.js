//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    http = require("http"),
    https = require("https"),
    bodyParser = require('body-parser'),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

// My part

app.use(express.static(__dirname + '/public'));


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

// End of my part




var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
