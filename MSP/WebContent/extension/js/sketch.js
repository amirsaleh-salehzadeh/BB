var muse;


//initialize museData
var dummy = false;

var done = false;


var views = [];
var viewIndex = 0;
var currentView = null;

var canvasHeight = 600;

var muselinks = {
	'Raw EEG': 'http://developer.choosemuse.com/research-tools/available-data#Raw_EEG',
	'Raw FFTs for Each Channel': 'http://developer.choosemuse.com/research-tools/available-data#Raw_FFTs_for_Each_Channel',
	'Absolute Band Powers': 'http://developer.choosemuse.com/research-tools/available-data#Absolute_Band_Powers',
	'Relative Band Powers': 'http://developer.choosemuse.com/research-tools/available-data#Relative_Band_Powers',
	'Headband Status / Horseshoe': 'http://developer.choosemuse.com/research-tools/available-data#Headband_Status',
	'Muscle Movement / Blinks': 'http://developer.choosemuse.com/research-tools/available-data#Blinks',
	'Muscle Movement / Jaw Clenches': 'http://developer.choosemuse.com/research-tools/available-data#Jaw_Clenches'
};


var data = {
	rawEEG: {
		leftEar: [],
		leftFront: [],
		rightFront: [],
		rightEar: []
	},
	rawFFT: {
		leftEar: [],
		leftFront: [],
		rightFront: [],
		rightEar: []
	},
	absoluteBand: {
		delta: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		theta: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		alpha: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		beta: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		gamma: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		}
	},
	relativeBand: {
		delta: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		theta: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		alpha: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		beta: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		},
		gamma: {
			leftEar: [],
			leftFront: [],
			rightFront: [],
			rightEar: [],
			mean: []
		}
	},
	horseshoe: {},
	touching_forehead: 0,
	blink: 0,
	jaw: 0
};

var maxN = 300;
var preloadImg = null;

 function preload(){
   
    preloadImg = createImg('preloader.gif');
   }


function setup() {
	var parentContainer = select('#chart');
	preloadImg.parent('chart');
	preloadImg.position(0.5*parentContainer.width,0.5*canvasHeight);
	var can = createCanvas(parentContainer.width, canvasHeight);

	can.parent('chart');


	//data connection to muse with sampling rate of muse
	if (dummy) {
		console.log('using dummy data');
		muse = museData().dummyData();
	} else {
		var museAddress = 'http://10.0.0.27:8085';
		console.log('trying to connect to muse on ' + museAddress);
		muse = museData().connection(museAddress);
	}

	//listen to the messages we are interested in 
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



	//muse.get('/muse/elements/theta_relative');


	muse.start();

	var rawfftview = rawFFTView(data,['/muse/elements/raw_fft0','/muse/elements/raw_fft1','/muse/elements/raw_fft2','/muse/elements/raw_fft3'],'Raw FFTs for Each Channel', 'FFT stands for Fast Fourier Transform. This computes the power spectral density of each frequency on each channel. Basically, it shows which frequencies make up a signal, and  “how much” of each frequency is present. These values are the basis for many of the subsequent DSP values in Muse Elements. Each path contains 129 decimal values with a range of roughly -40.0 to 20.0. Each array represents FFT coefficients (expressed as Power Spectral Density) for each channel, for a frequency range from 0hz-110Hz divided into 129 bins. We use a Hamming window of 256 samples(at 220Hz), then for the next FFT we slide the window 22 samples over(1/10th of a second). This gives a 90% overlap from one window to the next. These values are emitted at 10Hz.');
	views.push(rawEEGView(data, ['/muse/eeg'],'Raw EEG', 'This is the raw EEG data for each channel on the headband as measured in microvolts.'));
	views.push(rawfftview);
	views.push(absoluteBandView(data, ['/muse/elements/delta_absolute','/muse/elements/theta_absolute','/muse/elements/alpha_absolute','/muse/elements/beta_absolute','/muse/elements/gamma_absolute'],'Absolute Band Powers', 'The absolute band power for a given frequency range (for instance, alpha, i.e. 9-13Hz) is the logarithm of the sum of the Power Spectral Density of the EEG data over that frequency range. They are provided for each of the four to six channels/electrode sites on Muse. Since it is a logarithm, some of the values will be negative (i.e. when the absolute power is less than 1) They are given on a log scale, units are Bels.'));
	views.push(relativeBandView(data, ['/muse/elements/delta_relative','/muse/elements/theta_relative','/muse/elements/alpha_relative','/muse/elements/beta_relative','/muse/elements/gamma_relative'],'Relative Band Powers', 'The relative band powers are calculated by dividing the absolute linear-scale power in one band over the sum of the absolute linear-scale powers in all bands. The linear-scale band power can be calculated from the log-scale band power thusly: linear-scale band power = 10^ (log-scale band power). Therefore, the relative band powers can be calculated as percentages of linear-scale band powers in each band. The resulting value is between 0 and 1. However, the value will never be 0 or 1. These values are emitted at 10Hz.'));
	views.push(horseshoeView(data, ['/muse/elements/horseshoe','/muse/elements/touching_forehead'],'Headband Status / Horseshoe', 'Status indicator for each channel (think of the Muse status indicator that looks like a horseshoe). 1 = good, 2 = ok, >=3 bad'));
	views.push(blinkView(data, ['/muse/elements/blink'],'Muscle Movement / Blinks', 'These are emitted at 10Hz. A boolean value, 1 represents a blink was detected.'));
	views.push(jawView(data, ['/muse/elements/jaw_clench'],'Muscle Movement / Jaw Clenches', 'A boolean value, 1 represents a jaw clench was detected.'));


	//set the font
	textFont('HelveticaNeue-Light');
	frameRate(30);

	select('#horseshoe').hide();
	select('#eye_open').hide();
	select('#eye_closed').hide();
	select('#jaw_clench').hide();
	select('#smile').hide();
	select('#muse').hide();


	currentView = views[viewIndex];
	currentView.init();
}

function draw() {



	//wait for a few seconds so that the data can come trough
	if (frameCount < 30) {
		background('#EEE');
		return;
	}

	preloadImg.hide();
	background('#EEE');



	if (frameCount % 10 == 0) {
		console.log('frameRate: ' + frameRate());
	}

	updateData();

	//views[viewIndex].render();
	currentView.render();


	//var alph = muse.get('/muse/elements/alpha_relative');
	//var beta = muse.get('/muse/elements/beta_relative');
	//var theta = muse.get('/muse/elements/theta_relative');

	//console.log('alph',alph.mean);
	//console.log('beta',beta.mean);
	//console.log('theta',theta.mean);

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



	//console.log(alpha_absolute);


	//raw EEG
	data.rawEEG.leftEar.push(eeg.leftEar);
	data.rawEEG.leftFront.push(eeg.leftFront);
	data.rawEEG.rightFront.push(eeg.rightFront);
	data.rawEEG.rightEar.push(eeg.rightEar);

	shiftArrays([data.rawEEG.leftEar, data.rawEEG.leftFront, data.rawEEG.rightFront, data.rawEEG.rightEar], maxN);


	//raw FFT
	data.rawFFT.leftEar = raw_fft0.values;
	data.rawFFT.leftFront = raw_fft1.values;
	data.rawFFT.rightFront = raw_fft2.values;
	data.rawFFT.rightEar = raw_fft3.values;


	//absolute band powers
	//left ear
	data.absoluteBand.delta.leftEar.push(delta_absolute.leftEar);
	data.absoluteBand.theta.leftEar.push(theta_absolute.leftEar);
	data.absoluteBand.alpha.leftEar.push(alpha_absolute.leftEar);
	data.absoluteBand.beta.leftEar.push(beta_absolute.leftEar);
	data.absoluteBand.gamma.leftEar.push(gamma_absolute.leftEar);

	shiftArrays([data.absoluteBand.delta.leftEar, data.absoluteBand.theta.leftEar, data.absoluteBand.alpha.leftEar, data.absoluteBand.beta.leftEar, data.absoluteBand.gamma.leftEar], maxN);

	//left front
	data.absoluteBand.delta.leftFront.push(delta_absolute.leftFront);
	data.absoluteBand.theta.leftFront.push(theta_absolute.leftFront);
	data.absoluteBand.alpha.leftFront.push(alpha_absolute.leftFront);
	data.absoluteBand.beta.leftFront.push(beta_absolute.leftFront);
	data.absoluteBand.gamma.leftFront.push(gamma_absolute.leftFront);

	shiftArrays([data.absoluteBand.delta.leftFront, data.absoluteBand.theta.leftFront, data.absoluteBand.alpha.leftFront, data.absoluteBand.beta.leftFront, data.absoluteBand.gamma.leftFront], maxN);

	//right front
	data.absoluteBand.delta.rightFront.push(delta_absolute.rightFront);
	data.absoluteBand.theta.rightFront.push(theta_absolute.rightFront);
	data.absoluteBand.alpha.rightFront.push(alpha_absolute.rightFront);
	data.absoluteBand.beta.rightFront.push(beta_absolute.rightFront);
	data.absoluteBand.gamma.rightFront.push(gamma_absolute.rightFront);

	shiftArrays([data.absoluteBand.delta.rightFront, data.absoluteBand.theta.rightFront, data.absoluteBand.alpha.rightFront, data.absoluteBand.beta.rightFront, data.absoluteBand.gamma.rightFront], maxN);

	//right ear
	data.absoluteBand.delta.rightEar.push(delta_absolute.rightEar);
	data.absoluteBand.theta.rightEar.push(theta_absolute.rightEar);
	data.absoluteBand.alpha.rightEar.push(alpha_absolute.rightEar);
	data.absoluteBand.beta.rightEar.push(beta_absolute.rightEar);
	data.absoluteBand.gamma.rightEar.push(gamma_absolute.rightEar);

	shiftArrays([data.absoluteBand.delta.rightEar, data.absoluteBand.theta.rightEar, data.absoluteBand.alpha.rightEar, data.absoluteBand.beta.rightEar, data.absoluteBand.gamma.rightEar], maxN);


	//calculate absolute means
	data.absoluteBand.delta.mean.push((delta_absolute.leftEar + delta_absolute.leftFront + delta_absolute.rightFront + delta_absolute.rightEar)/4);
	data.absoluteBand.theta.mean.push((theta_absolute.leftEar + theta_absolute.leftFront + theta_absolute.rightFront + theta_absolute.rightEar)/4);
	data.absoluteBand.alpha.mean.push((alpha_absolute.leftEar + alpha_absolute.leftFront + alpha_absolute.rightFront + alpha_absolute.rightEar)/4);
	data.absoluteBand.beta.mean.push((beta_absolute.leftEar + beta_absolute.leftFront + beta_absolute.rightFront + beta_absolute.rightEar)/4);
	data.absoluteBand.gamma.mean.push((gamma_absolute.leftEar + gamma_absolute.leftFront + gamma_absolute.rightFront + gamma_absolute.rightEar)/4);

	shiftArrays([data.absoluteBand.delta.mean, data.absoluteBand.theta.mean, data.absoluteBand.alpha.mean, data.absoluteBand.beta.mean, data.absoluteBand.gamma.mean], maxN);


	//relative band powers
	//left ear
	data.relativeBand.delta.leftEar.push(delta_relative.leftEar);
	data.relativeBand.theta.leftEar.push(theta_relative.leftEar);
	data.relativeBand.alpha.leftEar.push(alpha_relative.leftEar);
	data.relativeBand.beta.leftEar.push(beta_relative.leftEar);
	data.relativeBand.gamma.leftEar.push(gamma_relative.leftEar);

	shiftArrays([data.relativeBand.delta.leftEar, data.relativeBand.theta.leftEar, data.relativeBand.alpha.leftEar, data.relativeBand.beta.leftEar, data.relativeBand.gamma.leftEar], maxN);


	//left Front
	data.relativeBand.delta.leftFront.push(delta_relative.leftFront);
	data.relativeBand.theta.leftFront.push(theta_relative.leftFront);
	data.relativeBand.alpha.leftFront.push(alpha_relative.leftFront);
	data.relativeBand.beta.leftFront.push(beta_relative.leftFront);
	data.relativeBand.gamma.leftFront.push(gamma_relative.leftFront);

	shiftArrays([data.relativeBand.delta.leftFront, data.relativeBand.theta.leftFront, data.relativeBand.alpha.leftFront, data.relativeBand.beta.leftFront, data.relativeBand.gamma.leftFront], maxN);


	//right front
	data.relativeBand.delta.rightFront.push(delta_relative.rightFront);
	data.relativeBand.theta.rightFront.push(theta_relative.rightFront);
	data.relativeBand.alpha.rightFront.push(alpha_relative.rightFront);
	data.relativeBand.beta.rightFront.push(beta_relative.rightFront);
	data.relativeBand.gamma.rightFront.push(gamma_relative.rightFront);

	shiftArrays([data.relativeBand.delta.rightFront, data.relativeBand.theta.rightFront, data.relativeBand.alpha.rightFront, data.relativeBand.beta.rightFront, data.relativeBand.gamma.rightFront], maxN);


	//right ear
	data.relativeBand.delta.rightEar.push(delta_relative.rightEar);
	data.relativeBand.theta.rightEar.push(theta_relative.rightEar);
	data.relativeBand.alpha.rightEar.push(alpha_relative.rightEar);
	data.relativeBand.beta.rightEar.push(beta_relative.rightEar);
	data.relativeBand.gamma.rightEar.push(gamma_relative.rightEar);


	shiftArrays([data.relativeBand.delta.rightEar, data.relativeBand.theta.rightEar, data.relativeBand.alpha.rightEar, data.relativeBand.beta.rightEar, data.relativeBand.gamma.rightEar], maxN);


	//calculate relative means
	data.relativeBand.delta.mean.push((delta_relative.leftEar + delta_relative.leftFront + delta_relative.rightFront + delta_relative.rightEar)/4);
	data.relativeBand.theta.mean.push((theta_relative.leftEar + theta_relative.leftFront + theta_relative.rightFront + theta_relative.rightEar)/4);
	data.relativeBand.alpha.mean.push((alpha_relative.leftEar + alpha_relative.leftFront + alpha_relative.rightFront + alpha_relative.rightEar)/4);
	data.relativeBand.beta.mean.push((beta_relative.leftEar +beta_relative.leftFront + beta_relative.rightFront + beta_relative.rightEar)/4);
	data.relativeBand.gamma.mean.push((gamma_relative.leftEar +gamma_relative.leftFront + gamma_relative.rightFront + gamma_relative.rightEar)/4);


	shiftArrays([data.relativeBand.delta.mean, data.relativeBand.theta.mean, data.relativeBand.alpha.mean, data.relativeBand.beta.mean, data.relativeBand.gamma.mean], maxN);



	//horseshoe
	//console.log(horseshoe);
	data.horseshoe = horseshoe;

	//touching forehead
	//console.log(touching_forehead);
	data.touching_forehead = touching_forehead.value;


	//blink
	//console.log(blink);
	data.blink = blink.value;

	//jaw clench
	data.jaw = jaw.value;
	//console.log(jaw);


	//console.log(alpha_absolute);

	//console.log('data.rawEEG');
	//console.log(data.rawEEG.leftEar);

	/*
	var data = {
		rawEEG: [],
		rawFFT: [],
		absoluteBand: {},
		relativeBand: {},
		horseshoe: {} 
	};*/



}

function keyTyped() {
	select('#horseshoe').show();
	console.log('keyCode',keyCode,LEFT_ARROW);

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


	//show or hide horseshow
	//ugly needs to be made better
	if (viewIndex == 4) {
		select('#horseshoe').show();
		select('#muse').show();
		select('canvas').hide();
		select('#jaw_clench').hide();
		select('#smile').hide();
		select('#eye_closed').hide();
		select('#eye_open').hide();
	} else if (viewIndex == 5) {
		select('#horseshoe').hide();
		select('#muse').hide();
		select('#eye_closed').hide();
		select('#eye_open').show();
		select('canvas').hide();
				select('#jaw_clench').hide();
		select('#smile').hide();
	}else if(viewIndex == 6){
		select('#horseshoe').hide();
		select('#muse').hide();
		select('#eye_closed').hide();
		select('#eye_open').hide();
		select('canvas').hide();
		select('#jaw_clench').hide();
		select('#smile').show();
	} 
	else {
		select('#horseshoe').hide();
		select('#muse').hide();
		select('#eye_closed').hide();
		select('#eye_open').hide();
		select('#jaw_clench').hide();
		select('#smile').hide();
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
	resizeCanvas(select('#chart').width, canvasHeight);
	console.log('width', width, 'height', height);

}




//this needs to be part of a helper library together with sum and mean maybe median also
function mean(arr) {
	var sum = 0;

	arr.forEach(function(d) {
		sum += d;
	});

	return sum / arr.length;
}