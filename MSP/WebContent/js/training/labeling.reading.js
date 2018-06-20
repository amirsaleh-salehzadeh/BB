var timeSnaps = [];
var sessionStamp;

function readingStart() {
	$("#focus").val("0");
	$.ajax({
		url : "REST/GetWS/StartRecording",
		dataType : "json",
		async : true,
		type : 'GET',
		success : function(data) {
			return;
		}
	});
	document.body.onkeypress = function(e) {
		if (e.keyCode == 32) {
			$("#focus").val("0");
			$("#dr").val("0");
			$("#screen").val("0");
			e.preventDefault();
			return;
		}
	}
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			$("#focus").val("1");
			$("#dr").val("1");
			$("#screen").val("1");
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
		MW : parseInt($("#focus").val())
	});
	labelElems.push({
		dr : parseInt($("#dr").val())
	});
	labelElems.push({
		m : parseInt($("#mood").val())
	});
	var currentFFPositions = cl.getCurrentPosition();
	for (var i = 0; i < currentFFPositions.length; i++) {
		var pos = {
			x : currentFFPositions[i][0],
			y : currentFFPositions[i][1]
		}
		faceFeatures.push(currentFFPositions[i][0]+","+currentFFPositions[i][1]);
	}
	$.ajax({
		url : "REST/GetWS/PostFaceFeatures",
		async : true,
		contentType : "application/json",
		type : 'POST',
		dataType : "json",
		data : {
			faceFeatures : JSON.stringify(faceFeatures),
			mindWanderingLabels : $("#focus").val() + ","
					+ parseInt($("#dr").val()) + ","
					+ parseInt($("#mood").val()) + ","
					+ parseInt($("#screen").val()) + ","
					+ parseInt($("#activity").val())
		},
		success : function(data) {
			return;
		}
	});
	return;
}
