/* helloWorld.js
   Simple "Hello World" nodejs service.
   Usage:  node helloWorld.js <port>
   Author: Pradipta Basu
*/
// We need the port so we will raise an alert if not given.

// First checking passed in args to take precedence
var args = process.argv.slice(2);
if (!args[0]) {
  // If the port is not passed in, then will check for MOCK_PORT env variable
  if (!process.env.MOCK_PORT) {
    //Cannot resolve the port, so raising the exception
    console.log('Usage: node helloWorld.js <port>');
    return;
  } else {
    //Port was not passed in, but env variable is set, so taking that.
    args[0] = process.env.MOCK_PORT;
  }
}

var express = require('express');
var os = require('os');
var url = require('url');
var app = express();
var port = args[0];
var bodyParser = require('body-parser');

// Our data-sets are small, so just keeping them in local variables for
// simplicity
var accounts = [
  {
    "account_number": "4859634",
    "name": "Pradipta",
    "environment": "Bangalore"
  },
  {
    "account_number": "5845241",
    "name": "Tupai",
    "environment": "Kolkata"
  }
];

var utilityEstimates = [
  {
    "account_number": "4859634",
    "name": "Pradipta",
    "gas_estimate_usage": "32,000 Btu",
    "gas_estimate_cost": "¥ 63,322",
    "electricity_estimate_usage": "5,325 kW",
    "electricity_estimate_cost": "¥ 18,324",
    "environment": "Bangalore"
  },
  {
    "account_number": "5845241",
    "name": "Tupai",
    "gas_estimate_usage": "480,000 Btu",
    "gas_estimate_cost": "¥ 306,424",
    "electricity_estimate_usage": "0 kW",
    "electricity_estimate_cost": "¥ 0",
    "environment": "Kolkata"
  }
];

var utilityUsage = [
  {
    "account_number": "4859634",
    "name": "Pradipta",
    "gas_usage": "20,005 Btu",
    "gas_cost": "¥ 46,896",
    "electricity_usage": "3,430 kW",
    "electricity_cost": "¥ 12,932",
    "environment": "Bangalore"
  },
  {
    "account_number": "5845241",
    "name": "Tupai",
    "gas_usage": "45,200 Btu",
    "gas_cost": "¥ 73,295",
    "electricity_usage": "0 kW",
    "electricity_cost": "¥ 0",
    "environment": "Kolkata"
  }
];

var utilityUsageLastMonth = [
  {
    "account_number": "4859634",
    "name": "Pradipta",
    "gas_usage": "30,000 Btu",
    "gas_cost": "¥ 56,436",
    "electricity_usage": "2,920 kW",
    "electricity_cost": "¥ 8,210",
    "environment": "Bangalore"
  },
  {
    "account_number": "5845241",
    "name": "Tupai",
    "gas_usage": "923,100 Btu",
    "gas_cost": "¥ 453,332",
    "electricity_usage": "0 kW",
    "electricity_cost": "¥ 0",
    "environment": "Kolkata"
  }
];

/* Accepting any type and assuming it is application/json, otherwise the caller
   is forced to pass the content-type specifically.
*/
function defaultContentTypeMiddleware (req, res, next) {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  next();
}

app.use(defaultContentTypeMiddleware);
app.use(bodyParser.json({ type: '*/*' }));

// /account api
app.post('/account', function(req, res) {
  var accountResponse = {};
  for (i=0; i<accounts.length; i++) {
    if (accounts[i].account_number.toString() == req.body.account_number) {
      res.statusCode = 200;
      accountResponse.message = 'Found Account ' + accounts[i].account_number.toString();
      res.json(accountResponse);
    }
  }
  res.statusCode = 404;
  accountResponse.message = 'I cannot find it';
  res.json(accountResponse);
});

// estimate api
app.get('/estimate/:id', function(req, res) {
  for (i=0; i<utilityEstimates.length; i++) {
    if (utilityEstimates[i].account_number == req.params.id) {
      utilityEstimates[i].serviceID = port.toString();
      res.statusCode = 200;
      res.json(utilityEstimates[i]);
    }
  }
  res.statusCode = 404;
  res.end('Account Number not found!');
});

// current month usage api
app.get('/usage/current/month/:id', function(req, res) {
  for (i=0; i<utilityUsage.length; i++) {
    if (utilityUsage[i].account_number == req.params.id) {
      utilityUsage[i].serviceID = port.toString();
      res.statusCode = 200;
      res.json(utilityUsage[i]);
    }
  }
  res.statusCode = 404;
  res.end('Account Number not found!');
});

// last month usage api
app.get('/usage/last/month/:id', function(req, res) {
  for (i=0; i<utilityUsageLastMonth.length; i++) {
    if (utilityUsageLastMonth[i].account_number == req.params.id) {
      utilityUsageLastMonth[i].serviceID = port.toString();
      res.statusCode = 200;
      res.json(utilityUsageLastMonth[i]);
    }
  }
  res.statusCode = 404;
  res.end('Account Number not found!');
});


// simple Hello World
app.get('/helloWorld/pradipta/greetings', function(req, res) {
	var greetingsResponse ={
			"greetingsName": "Hello World"
	};
    res.statusCode = 200;
    res.json(greetingsResponse);
});


// simple Hello World <name>
app.get('/helloWorld/pradipta/greetingsPerson/:name', function(req, res) {
	var greetingsResponse ={
			"greetingsName": "Hello " + req.params.name
	};
    res.statusCode = 200;
    res.json(greetingsResponse);
});


app.get('/serverInfo/all', function(req, res) {
//	var greetingsResponse ={
//			"greetingsName": "Hello " + req.params.name
//	};
//   res.statusCode = 200;
//    res.json(greetingsResponse);
	
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var call = url.parse(req.url).pathname.replace(/.*\/|\.[^.]*$/g, '');
	if( call === "all"){
		Object.keys(os).map(function(method) { res.write(method+":"+JSON.stringify(os[method](),2,true))+","; })
	}
	res.end(); 
});

app.get('/serverInfo/cpus', function(req, res) {
//	var greetingsResponse ={
//			"greetingsName": "Hello " + req.params.name
//	};
//   res.statusCode = 200;
//    res.json(greetingsResponse);
	
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var call = "cpus";
	try{
		var resu = os[call]();
		res.write(JSON.stringify(resu),'utf8');
	}
	catch(e){
		res.end("Sorry, try on of : "+Object.keys(os).join(", "));
	}
	res.end(); 
});


app.get('/serverInfoDynamic/:component', function(req, res) {
//	var greetingsResponse ={
//			"greetingsName": "Hello " + req.params.name
//	};
//   res.statusCode = 200;
//    res.json(greetingsResponse);
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
//	var call = url.parse(req.url).pathname.replace(/.*\/|\.[^.]*$/g, '');
	var call = req.params.component;
	if( call === "all"){
		Object.keys(os).map(function(method) { res.write(method+":"+JSON.stringify(os[method](),2,true))+","; })
	}
	else{
		try{
			var resu = os[call]();
			res.write(JSON.stringify(resu),'utf8');
		}
		catch(e){
			res.end("Sorry, try on of : "+Object.keys(os).join(", "));
		}
	}
	res.end(); 
});


app.get('/currentHostname', function(req, res) {
	var os_parameter = "hostname";
	var current_hostname = os[os_parameter]();
	var hostnameResponse ={
			"current_hostname": current_hostname
	};
	res.statusCode = 200;
	res.json(hostnameResponse);
});




//Creating the server process
app.listen(port);
console.log('Listening on port ' + port);
