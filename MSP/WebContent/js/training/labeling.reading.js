var timeSnaps = [];
var sessionStamp;

function readingStart() {
	$("#MW").val("0");
	$.ajax({
		url : "/REST/GetWS/StartRecording",
		dataType : "json",
		async : true,
		success : function(data) {
			return;
		}
	});
	document.body.onkeypress = function(e) {
		if (e.keyCode == 32) {
			$("#MW").val("1");
			$("#dr").val("1");
			e.preventDefault();
			return;
		}
	}
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			$("#MW").val("0");
			$("#dr").val("0");
			e.preventDefault();
			return;
		}
	}
	sessionStamp = setInterval(intervalTimeStamp, 30);
}

function readingPause() {
	clearInterval(sessionStamp);
}

function readingDone() {
	clearInterval(sessionStamp);
}

function intervalTimeStamp() {
	if (cl == null)
		return;
	var faceFeatures = new Array();
	var labelElems = new Array();
	labelElems.push({
		MW : parseInt($("#MW").val())
	});
	labelElems.push({
		g : parseInt($("#gender").val())
	});
	labelElems.push({
		dr : parseInt($("#dr").val())
	});
	labelElems.push({
		m : parseInt($("#mood").val())
	});
	var currentFFPositions = cl.getCurrentPrediction();
	for (var i = 0; i < currentFFPositions.length; i++) {
		var pos = {
			x : currentFFPositions[i][0],
			y : currentFFPositions[i][1]
		}
		faceFeatures.push(pos);
	}
	$.ajax({
		url : "REST/GetWS/PostFaceFeatures",
		async : true,
		contentType : "application/json",
		type : 'POST',
		dataType : "json",
		data : {
			faceFeatures : JSON.stringify(faceFeatures),
			mindWanderingLabels : JSON.stringify(labelElems)
		},
		success : function(data) {
			return;
		}
	});
	return;
}

