var showFaceOverlay = true;
var cl;
var pauseOverlay = false;
window.onload = function() {
	var leftDist = '0px';
	var setup = function() {
		var width = 333;
		var height = Math.round(width / 1.33);
		var video2 = document.getElementById('webgazerVideoFeed');
		video2.style.display = 'block';
		video2.style.bottom = '0px';
		video2.style.left = leftDist;
		video2.style.position = 'absolute';
		video2.width = width;
		video2.height = height;
		video2.style.margin = '0px';
		video2.style.zIndex = '22';
		webgazer.params.imgWidth = width;
		webgazer.params.imgHeight = height;
		$("#webGazerContainer").width(width);
		$("#webGazerContainer").height(height);
		var overlay = document.createElement('canvas');
		overlay.id = 'overlay';
		overlay.width = width;
		overlay.height = height;
		overlay.style.bottom = '0px';
		overlay.style.left = leftDist;
		overlay.style.margin = '0px';
		overlay.style.position = 'absolute';

		// Draw the face overlay on the camera video feedback
		var faceOverlay = document.createElement('face_overlay');
		faceOverlay.id = 'faceOverlay';
		faceOverlay.style.position = 'absolute';
		faceOverlay.style.top = '59px';
		faceOverlay.style.left = '107px';
		faceOverlay.style.border = 'solid';
		faceOverlay.style.zIndex = '23';

		overlay.style.zIndex = '33';
		$("webGazerContainer").append(video2);
		document.getElementById("webGazerContainer").appendChild(overlay);
		document.getElementById("webGazerContainer").appendChild(faceOverlay);

		var canvas = document.getElementById("plotting_canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.position = 'fixed';
		canvas.style.top = '0px';
		canvas.style.right = '0px';
		canvas.style.left = '0px';
		canvas.style.bottom = '0px';
		cl = webgazer.getTracker().clm;
		$("#webGazerContainer").trigger("create");
		// cl.init();
		// This function draw the face of the user frame.
		function drawLoop() {
			if (pauseOverlay)
				return;
			requestAnimFrame(drawLoop);
			overlay.getContext('2d').clearRect(0, 0, width, height);
			if (cl.getCurrentPosition()) {
				cl.draw(overlay);
			}
			$("#microphone").css("height", "0%");
			$("#microphone").parent().css("background-color",
					getColorForPercentage(1 - meter.volume));
			$("#volume").val(1 - meter.volume);
		}
		drawLoop();
		// evaluateAccuracy();
	};
	webgazer.setRegression('ridge').setTracker('clmtrackr').setGazeListener(
			function(data, clock) {
				if (data != null) {
					return;
				}
			}).begin();

	function checkIfReady() {
		if (webgazer.isReady()) {
			setup();
		} else {
			setTimeout(checkIfReady, 500);
		}
	}
	setTimeout(checkIfReady, 500);
};

// function drawLoop() {
// if (pauseOverlay)
// return;
// $("#microphone").css("height", "0%");
// $("#microphone").parent().css("background-color",
// getColorForPercentage(1 - meter.volume));
// $("#volume").val(1 - meter.volume);
// }
// drawLoop();

function submitPreTaskForm() {
	$.ajax({
		url : "REST/GetWS/QuestionnaireSubmit",
		data : {
			formElements : $("#questionnaireForm").serialize()
		},
		async : true,
		contentType : "application/json",
		type : 'POST',
		dataType : "json",
		success : function(data) {
			return;
		}
	});
}

window.onbeforeunload = function() {
	webgazer.end();
	// window.localStorage.clear();
};

function Restart() {
	document.getElementById("Accuracy").innerHTML = "Not yet Calibrated";
	ClearCalibration();
	PopUpInstruction();
	$("#leftSidePanel").panel("close");
	$("#Accuracy").trigger("create");
}
