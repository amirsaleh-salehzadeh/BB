var wsUri = "wss://" + document.location.host
		+ "/MSP/VideoStreamSocket/5";
var websocket;
function onMessage(evt) {
	if (evt.data != "" && evt.data != null && evt.data != "null") {
		var dataTMP = JSON.parse(evt.data);
		var index = dataTMP.Concentration;
		if (index != null) {
			plotSignals(dataTMP);
		}
	}
}

function getColor(l) {
	switch (l) {
	case 0:
		return '#00ff00';
		break;
	case 1:
		return '#00ff00';
		break;
	case 2:
		return '#FF9900';
		break;
	case 3:
		return '#FF9900';
		break;
	case 4:
		return '#ff0000';
		break;
	default:
		return '#ff0000';
	}
}

function plotSignals(data) {
	isStreaming = true;
	updateBar("X", Math.abs(data.ACC_X + 1)/4000);
	updateBar("Y", Math.abs(data.ACC_Y + 1)/4000);
	updateBar("Z", Math.abs(data.ACC_Z + 1)/4000);
	updateBar("D", data.Meditation);
	updateBar("F", data.Concentration);
	dataBandWidths = [data.alphaABS, data.betaABS, data.tetaABS, data.gammaABS, data.deltaABS];
	updateRadialBandWidth();
	$("#focus").val(data.RNN)
	if(data.RNN!=null)
	updateBar("RNNPrediction", $("#focus").val());
	if (data.foreheadConneted)
		$("#hs3").attr('style', 'background: green !important');
	else
		$("#hs3").attr('style', 'background: red !important');
	if (data.blink)
		$("#blinkContainer").css('visibility', 'visible');
	else
		$("#blinkContainer").css('visibility', 'hidden');
	$("#battVal").html(Math.round((data.battery / 100)) + "%");
	if(data.horseShoes!=null)
	for ( var int = 0; int < data.horseShoes.length; int++) {
		if (int < 2) {
			$("#hs" + (int + 1)).attr('style', 'background: '+getColor(data.horseShoes[int])+' !important');
		} else if (int >= 2) {
			$("#hs" + (int + 2)).attr('style', 'background: '+getColor(data.horseShoes[int])+' !important');
		}
	}
}

function binaryToString(str) {
	var binaryCode = [];
	for ( var i = 0; i < str.length; i++) {
		binaryCode.push(String.fromCharCode(parseInt(str[i], 2)));
	}
	return binaryCode.join("");
}

function onError(evt) {
	alert('ERROR: ' + evt.data);
}

function onOpen() {
	console.log("Connected to " + wsUri);
}

function onClose(evt) {
	console.log("closing websockets: " + evt.data);
	websocket.close();
}

function sendText(json) {
	websocket.send(json);
}

var canvas2, context2, v, w, h;

function connectToHeadband() {
// connectToTheSocket();
// $.get("https://localhost:8443/MSP/REST/GetWS/ConnectHeadband");
//	socket = io.connect('http://10.0.0.27', { port: 8085, rememberTransport: false});
//	   console.log('oi');
//	   socket.on('connect', function() {
//	        // sends to socket.io server the host/port of oscServer
//	        // and oscClient
//	        socket.emit('config',
//	            {
//	                server: {
//	                    port: 5000,
//	                    host: 'localhost'
//	                },
//	                client: {
//	                    port: 3334,
//	                    host: 'localhost'
//	                }
//	            }
//	        );
//	    });
	   setup();
//	    socket.on('message', function(obj) {
//	        var status = document.getElementById("status");
//	        status.innerHTML = obj[0];
//	         console.log(obj);
//	    });
}

function connectToTheSocket() {
	websocket = new WebSocket(wsUri);
	websocket.onmessage = function(evt) {
		onMessage(evt);
	};
	websocket.onerror = function(evt) {
		onError(evt);
	};
	websocket.onopen = function(evt) {
		onOpen(evt);
	};
	websocket.onclose = function(evt) {
		onClose(evt);
	};
}

function finishRecording() {
	$.get("https://localhost:8443/MSP/REST/GetWS/StopHeadband");
	if(websocket!= null && websocket.readyState !== websocket.CLOSED) {
		websocket.close();
	}
	readingDone();
}
