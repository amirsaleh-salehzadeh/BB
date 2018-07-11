var muse;

// initialize museData
var dummy = true;

var done = false;

var views = [];
var viewIndex = 0;
var currentView = null;

var canvasHeight = 111;

var muselinks = {
	'Raw EEG' : 'http://developer.choosemuse.com/research-tools/available-data#Raw_EEG',
	'Raw FFTs for Each Channel' : 'http://developer.choosemuse.com/research-tools/available-data#Raw_FFTs_for_Each_Channel',
	'Absolute Band Powers' : 'http://developer.choosemuse.com/research-tools/available-data#Absolute_Band_Powers',
	'Relative Band Powers' : 'http://developer.choosemuse.com/research-tools/available-data#Relative_Band_Powers',
	'Headband Status / Horseshoe' : 'http://developer.choosemuse.com/research-tools/available-data#Headband_Status',
	'Muscle Movement / Blinks' : 'http://developer.choosemuse.com/research-tools/available-data#Blinks',
	'Muscle Movement / Jaw Clenches' : 'http://developer.choosemuse.com/research-tools/available-data#Jaw_Clenches'
};

var dataMuse = {
	rawEEG : {
		leftEar : [],
		leftFront : [],
		rightFront : [],
		rightEar : []
	},
	rawFFT : {
		leftEar : [],
		leftFront : [],
		rightFront : [],
		rightEar : []
	},
	absoluteBand : {
		delta : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		theta : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		alpha : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		beta : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		gamma : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		}
	},
	relativeBand : {
		delta : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		theta : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		alpha : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		beta : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		},
		gamma : {
			leftEar : [],
			leftFront : [],
			rightFront : [],
			rightEar : [],
			mean : []
		}
	},
	horseshoe : {},
	touching_forehead : 0,
	blink : 0,
	jaw : 0
};

var maxN = 300;
var preloadImg = null;

//function preload() {
//	preloadImg = createImg('preloader.gif');
//}

function setup() {
	var parentContainer = select('#chartEEGs');
//	preloadImg.parent('chartEEGs');
//	preloadImg.position(0.5 * parentContainer.width, 0.5 * canvasHeight);
	var can = createCanvas(parentContainer.width, canvasHeight);

	can.parent('chartEEGs');

	// data connection to muse with sampling rate of muse
	if (dummy) {
		console.log('using dummy data');
		muse = museData().dummyData();
	} else {
		var museAddress = $("#serverAddress").val() + ':'
		$("#serverPort").val();
		console.log('trying to connect to muse on ' + museAddress);
		muse = museData().connection($("#serverAddress").val(),
				$("#serverPort").val());
	}

	// listen to the messages we are interested in
	muse.listenTo('/muse/eeg');
	muse.listenTo('/muse/elements/raw_fft0');
	muse.listenTo('/muse/elements/raw_fft1');
	muse.listenTo('/muse/elements/raw_fft2');
	muse.listenTo('/muse/elements/raw_fft3');
	muse.listenTo('/muse/elements/delta_absolute');
	muse.listenTo('/muse/elements/theta_absolute');
	muse.listenTo('/muse/elements/alpha_absolute');
	muse.listenTo('/muse/elements/beta_absolute');
	muse.listenTo('/muse/elements/gamma_absolute');
	muse.listenTo('/muse/elements/delta_relative');
	muse.listenTo('/muse/elements/theta_relative');
	muse.listenTo('/muse/elements/alpha_relative');
	muse.listenTo('/muse/elements/beta_relative');
	muse.listenTo('/muse/elements/gamma_relative');
	muse.listenTo('/muse/elements/horseshoe');
	muse.listenTo('/muse/elements/touching_forehead');
	muse.listenTo('/muse/elements/blink');
	muse.listenTo('/muse/elements/jaw_clench');

	// muse.get('/muse/elements/theta_relative');

	muse.start();

	var rawfftview = rawFFTView(
			dataMuse,
			[ '/muse/elements/raw_fft0', '/muse/elements/raw_fft1',
					'/muse/elements/raw_fft2', '/muse/elements/raw_fft3' ],
			'Raw FFTs for Each Channel',
			'FFT stands for Fast Fourier Transform. This computes the power spectral density of each frequency on each channel. Basically, it shows which frequencies make up a signal, and  “how much” of each frequency is present. These values are the basis for many of the subsequent DSP values in Muse Elements. Each path contains 129 decimal values with a range of roughly -40.0 to 20.0. Each array represents FFT coefficients (expressed as Power Spectral Density) for each channel, for a frequency range from 0hz-110Hz divided into 129 bins. We use a Hamming window of 256 samples(at 220Hz), then for the next FFT we slide the window 22 samples over(1/10th of a second). This gives a 90% overlap from one window to the next. These values are emitted at 10Hz.');
	views
			.push(rawEEGView(
					dataMuse,
					[ '/muse/eeg' ],
					'Raw EEG',
					'This is the raw EEG data for each channel on the headband as measured in microvolts.'));
	views.push(rawfftview);
	views
			.push(absoluteBandView(
					dataMuse,
					[ '/muse/elements/delta_absolute',
							'/muse/elements/theta_absolute',
							'/muse/elements/alpha_absolute',
							'/muse/elements/beta_absolute',
							'/muse/elements/gamma_absolute' ],
					'Absolute Band Powers',
					'The absolute band power for a given frequency range (for instance, alpha, i.e. 9-13Hz) is the logarithm of the sum of the Power Spectral Density of the EEG data over that frequency range. They are provided for each of the four to six channels/electrode sites on Muse. Since it is a logarithm, some of the values will be negative (i.e. when the absolute power is less than 1) They are given on a log scale, units are Bels.'));
	views
			.push(relativeBandView(
					dataMuse,
					[ '/muse/elements/delta_relative',
							'/muse/elements/theta_relative',
							'/muse/elements/alpha_relative',
							'/muse/elements/beta_relative',
							'/muse/elements/gamma_relative' ],
					'Relative Band Powers',
					'The relative band powers are calculated by dividing the absolute linear-scale power in one band over the sum of the absolute linear-scale powers in all bands. The linear-scale band power can be calculated from the log-scale band power thusly: linear-scale band power = 10^ (log-scale band power). Therefore, the relative band powers can be calculated as percentages of linear-scale band powers in each band. The resulting value is between 0 and 1. However, the value will never be 0 or 1. These values are emitted at 10Hz.'));
	views
			.push(horseshoeView(
					dataMuse,
					[ '/muse/elements/horseshoe',
							'/muse/elements/touching_forehead' ],
					'Headband Status / Horseshoe',
					'Status indicator for each channel (think of the Muse status indicator that looks like a horseshoe). 1 = good, 2 = ok, >=3 bad'));

	// set the font
	textFont('HelveticaNeue-Light');
	frameRate(30);

	select('#horseshoe').show();

	currentView = views[viewIndex];
	currentView.init();
}

function draw() {

	// wait for a few seconds so that the data can come trough
	if (frameCount < 30) {
		background('transprant');
		return;
	}

//	preloadImg.hide();
	background(0);

//	if (frameCount % 10 == 0) {
//		console.log('frameRate: ' + frameRate());
//	}

	updateData();

	views[viewIndex].render();
	currentView.render();

	// var alph = muse.get('/muse/elements/alpha_relative');
	// var beta = muse.get('/muse/elements/beta_relative');
	// var theta = muse.get('/muse/elements/theta_relative');

	// console.log('alph',alph.mean);
	// console.log('beta',beta.mean);
	// console.log('theta',theta.mean);

}

function updateData() {
	var eeg = muse.get('/muse/eeg');
	var raw_fft0 = muse.get('/muse/elements/raw_fft0');
	var raw_fft1 = muse.get('/muse/elements/raw_fft1');
	var raw_fft2 = muse.get('/muse/elements/raw_fft2');
	var raw_fft3 = muse.get('/muse/elements/raw_fft3');
	var delta_absolute = muse.get('/muse/elements/delta_absolute');
	var theta_absolute = muse.get('/muse/elements/theta_absolute');
	var alpha_absolute = muse.get('/muse/elements/alpha_absolute');
	var beta_absolute = muse.get('/muse/elements/beta_absolute');
	var gamma_absolute = muse.get('/muse/elements/gamma_absolute');
	var delta_relative = muse.get('/muse/elements/delta_relative');
	var theta_relative = muse.get('/muse/elements/theta_relative');
	var alpha_relative = muse.get('/muse/elements/alpha_relative');
	var beta_relative = muse.get('/muse/elements/beta_relative');
	var gamma_relative = muse.get('/muse/elements/gamma_relative');
	var horseshoe = muse.get('/muse/elements/horseshoe');
	var touching_forehead = muse.get('/muse/elements/touching_forehead');
	var blink = muse.get('/muse/elements/blink');
	var jaw = muse.get('/muse/elements/jaw_clench');

	// console.log(alpha_absolute);

	// raw EEG
	dataMuse.rawEEG.leftEar.push(eeg.leftEar);
	dataMuse.rawEEG.leftFront.push(eeg.leftFront);
	dataMuse.rawEEG.rightFront.push(eeg.rightFront);
	dataMuse.rawEEG.rightEar.push(eeg.rightEar);

	shiftArrays([ dataMuse.rawEEG.leftEar, dataMuse.rawEEG.leftFront,
		dataMuse.rawEEG.rightFront, dataMuse.rawEEG.rightEar ], maxN);

	// raw FFT
	dataMuse.rawFFT.leftEar = raw_fft0.values;
	dataMuse.rawFFT.leftFront = raw_fft1.values;
	dataMuse.rawFFT.rightFront = raw_fft2.values;
	dataMuse.rawFFT.rightEar = raw_fft3.values;

	// absolute band powers
	// left ear
	dataMuse.absoluteBand.delta.leftEar.push(delta_absolute.leftEar);
	dataMuse.absoluteBand.theta.leftEar.push(theta_absolute.leftEar);
	dataMuse.absoluteBand.alpha.leftEar.push(alpha_absolute.leftEar);
	dataMuse.absoluteBand.beta.leftEar.push(beta_absolute.leftEar);
	dataMuse.absoluteBand.gamma.leftEar.push(gamma_absolute.leftEar);

	shiftArrays([ dataMuse.absoluteBand.delta.leftEar,
		dataMuse.absoluteBand.theta.leftEar, dataMuse.absoluteBand.alpha.leftEar,
		dataMuse.absoluteBand.beta.leftEar, dataMuse.absoluteBand.gamma.leftEar ],
			maxN);

	// left front
	dataMuse.absoluteBand.delta.leftFront.push(delta_absolute.leftFront);
	dataMuse.absoluteBand.theta.leftFront.push(theta_absolute.leftFront);
	dataMuse.absoluteBand.alpha.leftFront.push(alpha_absolute.leftFront);
	dataMuse.absoluteBand.beta.leftFront.push(beta_absolute.leftFront);
	dataMuse.absoluteBand.gamma.leftFront.push(gamma_absolute.leftFront);

	shiftArrays(
			[ dataMuse.absoluteBand.delta.leftFront,
				dataMuse.absoluteBand.theta.leftFront,
				dataMuse.absoluteBand.alpha.leftFront,
				dataMuse.absoluteBand.beta.leftFront,
				dataMuse.absoluteBand.gamma.leftFront ], maxN);

	// right front
	dataMuse.absoluteBand.delta.rightFront.push(delta_absolute.rightFront);
	dataMuse.absoluteBand.theta.rightFront.push(theta_absolute.rightFront);
	dataMuse.absoluteBand.alpha.rightFront.push(alpha_absolute.rightFront);
	dataMuse.absoluteBand.beta.rightFront.push(beta_absolute.rightFront);
	dataMuse.absoluteBand.gamma.rightFront.push(gamma_absolute.rightFront);

	shiftArrays([ dataMuse.absoluteBand.delta.rightFront,
		dataMuse.absoluteBand.theta.rightFront,
		dataMuse.absoluteBand.alpha.rightFront,
		dataMuse.absoluteBand.beta.rightFront,
		dataMuse.absoluteBand.gamma.rightFront ], maxN);

	// right ear
	dataMuse.absoluteBand.delta.rightEar.push(delta_absolute.rightEar);
	dataMuse.absoluteBand.theta.rightEar.push(theta_absolute.rightEar);
	dataMuse.absoluteBand.alpha.rightEar.push(alpha_absolute.rightEar);
	dataMuse.absoluteBand.beta.rightEar.push(beta_absolute.rightEar);
	dataMuse.absoluteBand.gamma.rightEar.push(gamma_absolute.rightEar);

	shiftArrays(
			[ dataMuse.absoluteBand.delta.rightEar,
				dataMuse.absoluteBand.theta.rightEar,
				dataMuse.absoluteBand.alpha.rightEar,
				dataMuse.absoluteBand.beta.rightEar,
				dataMuse.absoluteBand.gamma.rightEar ], maxN);

	// calculate absolute means
	dataMuse.absoluteBand.delta.mean
			.push((delta_absolute.leftEar + delta_absolute.leftFront
					+ delta_absolute.rightFront + delta_absolute.rightEar) / 4);
	dataMuse.absoluteBand.theta.mean
			.push((theta_absolute.leftEar + theta_absolute.leftFront
					+ theta_absolute.rightFront + theta_absolute.rightEar) / 4);
	dataMuse.absoluteBand.alpha.mean
			.push((alpha_absolute.leftEar + alpha_absolute.leftFront
					+ alpha_absolute.rightFront + alpha_absolute.rightEar) / 4);
	dataMuse.absoluteBand.beta.mean
			.push((beta_absolute.leftEar + beta_absolute.leftFront
					+ beta_absolute.rightFront + beta_absolute.rightEar) / 4);
	dataMuse.absoluteBand.gamma.mean
			.push((gamma_absolute.leftEar + gamma_absolute.leftFront
					+ gamma_absolute.rightFront + gamma_absolute.rightEar) / 4);

	shiftArrays([ dataMuse.absoluteBand.delta.mean, dataMuse.absoluteBand.theta.mean,
		dataMuse.absoluteBand.alpha.mean, dataMuse.absoluteBand.beta.mean,
		dataMuse.absoluteBand.gamma.mean ], maxN);

	// relative band powers
	// left ear
	dataMuse.relativeBand.delta.leftEar.push(delta_relative.leftEar);
	dataMuse.relativeBand.theta.leftEar.push(theta_relative.leftEar);
	dataMuse.relativeBand.alpha.leftEar.push(alpha_relative.leftEar);
	dataMuse.relativeBand.beta.leftEar.push(beta_relative.leftEar);
	dataMuse.relativeBand.gamma.leftEar.push(gamma_relative.leftEar);

	shiftArrays([ dataMuse.relativeBand.delta.leftEar,
		dataMuse.relativeBand.theta.leftEar, dataMuse.relativeBand.alpha.leftEar,
		dataMuse.relativeBand.beta.leftEar, dataMuse.relativeBand.gamma.leftEar ],
			maxN);

	// left Front
	dataMuse.relativeBand.delta.leftFront.push(delta_relative.leftFront);
	dataMuse.relativeBand.theta.leftFront.push(theta_relative.leftFront);
	dataMuse.relativeBand.alpha.leftFront.push(alpha_relative.leftFront);
	dataMuse.relativeBand.beta.leftFront.push(beta_relative.leftFront);
	dataMuse.relativeBand.gamma.leftFront.push(gamma_relative.leftFront);

	shiftArrays(
			[ dataMuse.relativeBand.delta.leftFront,
				dataMuse.relativeBand.theta.leftFront,
				dataMuse.relativeBand.alpha.leftFront,
				dataMuse.relativeBand.beta.leftFront,
				dataMuse.relativeBand.gamma.leftFront ], maxN);

	// right front
	dataMuse.relativeBand.delta.rightFront.push(delta_relative.rightFront);
	dataMuse.relativeBand.theta.rightFront.push(theta_relative.rightFront);
	dataMuse.relativeBand.alpha.rightFront.push(alpha_relative.rightFront);
	dataMuse.relativeBand.beta.rightFront.push(beta_relative.rightFront);
	dataMuse.relativeBand.gamma.rightFront.push(gamma_relative.rightFront);

	shiftArrays([ dataMuse.relativeBand.delta.rightFront,
		dataMuse.relativeBand.theta.rightFront,
		dataMuse.relativeBand.alpha.rightFront,
		dataMuse.relativeBand.beta.rightFront,
		dataMuse.relativeBand.gamma.rightFront ], maxN);

	// right ear
	dataMuse.relativeBand.delta.rightEar.push(delta_relative.rightEar);
	dataMuse.relativeBand.theta.rightEar.push(theta_relative.rightEar);
	dataMuse.relativeBand.alpha.rightEar.push(alpha_relative.rightEar);
	dataMuse.relativeBand.beta.rightEar.push(beta_relative.rightEar);
	dataMuse.relativeBand.gamma.rightEar.push(gamma_relative.rightEar);

	shiftArrays(
			[ dataMuse.relativeBand.delta.rightEar,
				dataMuse.relativeBand.theta.rightEar,
				dataMuse.relativeBand.alpha.rightEar,
				dataMuse.relativeBand.beta.rightEar,
				dataMuse.relativeBand.gamma.rightEar ], maxN);

	// calculate relative means
	dataMuse.relativeBand.delta.mean
			.push((delta_relative.leftEar + delta_relative.leftFront
					+ delta_relative.rightFront + delta_relative.rightEar) / 4);
	dataMuse.relativeBand.theta.mean
			.push((theta_relative.leftEar + theta_relative.leftFront
					+ theta_relative.rightFront + theta_relative.rightEar) / 4);
	dataMuse.relativeBand.alpha.mean
			.push((alpha_relative.leftEar + alpha_relative.leftFront
					+ alpha_relative.rightFront + alpha_relative.rightEar) / 4);
	dataMuse.relativeBand.beta.mean
			.push((beta_relative.leftEar + beta_relative.leftFront
					+ beta_relative.rightFront + beta_relative.rightEar) / 4);
	dataMuse.relativeBand.gamma.mean
			.push((gamma_relative.leftEar + gamma_relative.leftFront
					+ gamma_relative.rightFront + gamma_relative.rightEar) / 4);

	shiftArrays([ dataMuse.relativeBand.delta.mean, dataMuse.relativeBand.theta.mean,
		dataMuse.relativeBand.alpha.mean, dataMuse.relativeBand.beta.mean,
		dataMuse.relativeBand.gamma.mean ], maxN);

	// horseshoe
	// console.log(horseshoe);
	dataMuse.horseshoe = horseshoe;

	// touching forehead
	// console.log(touching_forehead);
	dataMuse.touching_forehead = touching_forehead.value;

	// blink
	// console.log(blink);
	// data.blink = blink.value;

	// jaw clench
	// data.jaw = jaw.value;
	// console.log(jaw);

	// console.log(alpha_absolute);

	// console.log('data.rawEEG');
	// console.log(data.rawEEG.leftEar);

	/*
	 * var data = { rawEEG: [], rawFFT: [], absoluteBand: {}, relativeBand: {},
	 * horseshoe: {} };
	 */

}

function keyTyped() {
	select('#horseshoe').show();
	console.log('keyCode', keyCode, LEFT_ARROW);

	if (key == 'q' || keyCode == LEFT_ARROW) {
		viewIndex = constrain(viewIndex - 1, 0, views.length - 1);
		currentView = views[viewIndex];
		currentView.init();
		console.log('viewIndex: ', viewIndex, views.length);
	} else if (key == 'w' || keyCode == RIGHT_ARROW) {
		viewIndex = constrain(viewIndex + 1, 0, views.length - 1);
		currentView = views[viewIndex];
		currentView.init();
		console.log('viewIndex: ', viewIndex, views.length);
	}

	// show or hide horseshow
	// ugly needs to be made better
	if (viewIndex == 4) {
		select('#horseshoe').show();
		select('canvas').hide();
		select('#jaw_clench').hide();
		select('#smile').hide();
		select('#eye_closed').hide();
		select('#eye_open').hide();
	} else if (viewIndex == 5) {
		select('#horseshoe').hide();
		select('#eye_closed').hide();
		select('#eye_open').show();
		select('canvas').hide();
		select('#jaw_clench').hide();
		select('#smile').hide();
	} else if (viewIndex == 6) {
		select('#horseshoe').hide();
		select('#eye_closed').hide();
		select('#eye_open').hide();
		select('canvas').hide();
		select('#jaw_clench').hide();
		select('#smile').show();
	} else {
		select('#horseshoe').hide();
		select('canvas').show();
	}

}

function shiftArrays(arrOfArrays, n) {
	arrOfArrays.forEach(function(arr) {
		if (arr.length > n) {
			arr.shift();
		}
	});
}

function windowResized() {
	console.log('windowResized')
	resizeCanvas(select('#chartEEGs').width, canvasHeight);
	console.log('width', width, 'height', height);

}

// this needs to be part of a helper library together with sum and mean maybe
// median also
function mean(arr) {
	var sum = 0;

	arr.forEach(function(d) {
		sum += d;
	});

	return sum / arr.length;
}