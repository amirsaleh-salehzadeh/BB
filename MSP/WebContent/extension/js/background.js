var showFaceOverlay = true;
var cl;
var pauseOverlay = false;
window.onload = function() {
	var leftDist = '0px';
	// $("#connectToMuseBTN").on('click', connectToMuse);
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
		canvas.width = '313px';
		canvas.height = '187px';
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

var percentColors = [ {
	pct : 0.0,
	color : {
		r : 0xff,
		g : 0x00,
		b : 0
	}
}, {
	pct : 0.5,
	color : {
		r : 0xff,
		g : 0xff,
		b : 0
	}
}, {
	pct : 1.0,
	color : {
		r : 0x00,
		g : 0xff,
		b : 0
	}
} ];

var getColorForPercentage = function(pct) {
	for (var i = 1; i < percentColors.length - 1; i++) {
		if (pct < percentColors[i].pct) {
			break;
		}
	}
	var lower = percentColors[i - 1];
	var upper = percentColors[i];
	var range = upper.pct - lower.pct;
	var rangePct = (pct - lower.pct) / range;
	var pctLower = 1 - rangePct;
	var pctUpper = rangePct;
	var color = {
		r : Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
		g : Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
		b : Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
	};
	return 'rgb(' + [ color.r, color.g, color.b ].join(',') + ')';
	// or output as hex if preferred
}

var requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(/* function FrameRequestCallback */callback, /*
																		 * DOMElement
																		 * Element
																		 */
			element) {
				return window.setTimeout(callback, 1000 / 60);
			};
})();