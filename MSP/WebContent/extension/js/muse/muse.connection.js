var peerConnection = new RTCPeerConnection();
var dataChannelOptions = {
	ordered : false, // do not guarantee order
	maxRetransmitTime : 0, // in milliseconds
};
var dataChannel = peerConnection.createDataChannel("udp://localhost:5003",
		dataChannelOptions);

dataChannel.onerror = function(error) {
	console.log("Data Channel Error:", error);
};

dataChannel.onmessage = function(event) {
	console.log("Got Data Channel Message:", event.data);
};

dataChannel.onopen = function() {
	dataChannel.send("Hello World!");
};

dataChannel.onclose = function() {
	console.log("The Data Channel is Closed");
};