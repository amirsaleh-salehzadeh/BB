window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
		|| navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audioContext;
function updateBar(id, value) {
	$("#" + id).css("height", Math.abs(100 - Math.abs(value * 100)) + "%");
}

var spectro;

function init() {
	spectro = Spectrogram(document.getElementById('canvasMicrophone'), {
		canvas : {
			width : function() {
				return 333;
			},
			height : 111
		},
		audio : {
			enable : true
		},
		colors : function(steps) {
			var baseColors = [ [ 0, 0, 255, 1 ], [ 0, 255, 255, 1 ],
					[ 0, 255, 0, 1 ], [ 255, 255, 0, 1 ], [ 255, 0, 0, 1 ] ];
			var positions = [ 0, 0.15, 0.30, 0.50, 0.75 ];

			var scale = new chroma.scale(baseColors, positions).domain([ 0,
					steps ]);

			var colors = [];

			for (var i = 0; i < steps; ++i) {
				var color = scale(i);
				colors.push(color.hex());
			}

			return colors;
		}
	});

	try {
		audioContext = new AudioContext();
	} catch (e) {
		alert('No web audio support in this browser!');
	}
	navigator.getUserMedia({
		video : false,
		audio : true
	}, function(stream) {
		handleMicStream(stream);
	}, handleMicError);
}

function handleMicStream(stream) {
	var input = audioContext.createMediaStreamSource(stream);
	var analyser = audioContext.createAnalyser();
	analyser.smoothingTimeConstant = 0;
	analyser.fftSize = 2048;
	input.connect(analyser);
	spectro.connectSource(analyser, audioContext);
	spectro.start();
}

function handleMicError(error) {
	alert(error);
	console.log(error);
}

window.addEventListener('load', init, false);
