//Substitute the real ip address on which the server is hosted in place of [IP_ADDRESS] in the url

http = require('http');
fs = require('fs');
const PORT=8080;
var dispatcher = require('httpdispatcher');
dispatcher.setStatic('resources');

total_pieces = new Array();
isFirst = 'Y';
isFirstTapped = 'Y';
isSecond = 'N';
isSecondTapped = 'N';
start = 0;
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}
var htmldata = '';
//A sample GET request    
dispatcher.onGet("/game", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('./gamenew.html', function (err, html) {
		console.log(html);
		htmldata = html;
		res.end(htmldata);
	});
    
});    
dispatcher.onPost("/checkstatus", function(req, res) {
	console.log('chegu post1');
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var data = req.body;
	var parseData = JSON.parse(data);
	console.log('parseData.isFirst:' + parseData.isFirst);
	console.log('parseData.isSecond:' + parseData.isSecond);
	if (parseData.isFirst == isFirst && parseData.isFirst == 'Y') {
		res.end('Y');
	}
	else if (parseData.isSecond == isSecond && parseData.isSecond == 'Y') {
		res.end('Y');
	}
	else {
		res.end('N');
	}	
});

dispatcher.onPost("/update", function(req, res) {
	var data = req.body;
	console.log('update:'+ data);
	var parseData = JSON.parse(data);
	console.log('update: td:'+ parseData.td);
	total_pieces.push(parseData.td);
	if (isFirst == 'Y') {
		console.log('1');
		isFirst = 'N';
		isSecond = 'Y';
	}
	else {
		console.log('2');
		isFirst = 'Y';
		isSecond = 'N';
	}
	var tempStr = isFirst+';'+isSecond+';'+total_pieces.toString();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(tempStr);
});
dispatcher.onPost("/start", function(req, res) {
	console.log('start');
	if (start == 0) {
		var data = 'Y;N';
		++start;
	}
	else {
		var data = 'N;Y';
	}
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(data);
});
dispatcher.onPost("/reset", function(req, res) {
	console.log('reset');
	start = 0; 
	total_pieces = [];
	var tempStr = isFirst+';'+isSecond+';'+total_pieces.toString();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(tempStr);
});
dispatcher.onPost("/broadcaste", function(req, res) {
	console.log('broadcaste');
    var tempStr = isFirst+';'+isSecond+';'+total_pieces.toString();
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(tempStr);
});
var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    //Callback triggered when server is successfully listening.
    console.log("Server listening on: http://[IP_ADDRESS]:%s", PORT);
});
    