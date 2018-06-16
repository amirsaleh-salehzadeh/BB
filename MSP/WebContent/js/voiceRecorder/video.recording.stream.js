var canvas2, context2, v, w, h, streamVideo;

function startVideoRecording() {
	refreshPods();
	$.get("http://localhost:8080/MuseInteraxon/REST/GetWS/StartHeadband");
	v = document.getElementById('webgazerVideoFeed');
	canvas2 = document.getElementById('webgazerVideoCanvas');
	context2 = canvas2.getContext('2d');
	w = canvas2.width;
	h = canvas2.height;
	streamEEG = setInterval(function() {
		context2.drawImage(v, 0, 0, w, h);
		sendText(convertToBinary(canvas2.toDataURL('image/jpeg', 1.0)));
	}, 30);
}