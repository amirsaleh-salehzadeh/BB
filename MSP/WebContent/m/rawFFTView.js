function rawFFTView(model, idArr,title, description) {

	var my = view(model, idArr,title, description);
	var padding = my.getPadding();

	//var dBDomain = [-40.0, 20.0];
	var dBDomain = [-40.0, 40.0];

	var no_freq = 'Low';
	var delta_absolute = 'Delta';
	var theta_absolute = 'Theta';
	var alpha_absolute = 'Alpha';
	var beta_absolute = 'Beta';
	var gamma_absolute = 'Gamma';
	var high_freq = 'High Frequency';

	var frequencies = [no_freq,delta_absolute,theta_absolute,alpha_absolute,beta_absolute,gamma_absolute,high_freq];
	//var colors = ['black', '#225378', '#1695A3', '#ACF0F2', '#F3FFE2', '#EB7F00','black'];
	//var colors = ['black', '#7F1637', '#047878', '#FFB733', '#F57336', '#C22121','black'];
	//var colors = ['black', '#FF5B2B', '#B1221C', '#B1221C', '#8CC6D7', '#FFDA8C','black'];
	//var colors = ['black', '#F15A5A', '#F0C419', '#4EBA6F', '#2D95BF', '#955BA5','black'];
	//var colors = ['black', '#393A3D', '#DB0048', '#63A8A5', '#C8DBBF', '#E0FCEB','black'];
	var colors = ['black', '#0A7B83', '#2AA876', '#FFD265', '#F19C65', '#CE4D45','black'];
	
	var colorLookup = [];

	frequencies.forEach(function(f,i){
		colorLookup[f] = colors[i];
	});

	//console.log(my);

	my.render = function() {
		//console.log('rawEEGView.render');
		//console.log(my);
		//console.log('title: ' + my.getTitle());
		//console.log('description: ' + my.getDescription());

		//my.renderCommon();

		//var barData = data.rawFFT.leftEar;
		//var barData = [data.rawFFT.leftEar,data.rawFFT.leftFront,data.rawFFT.rightFront,data.rawFFT.rightEar];
		var barData = [data.rawFFT.leftEar];
		//console.log(barData);
		var innerWidth = width - padding.left - padding.right;
		var innerHeight = 400;
		var gap = 10;
		var colors = data.rawFFT.leftEar.map(function(d,i){
			return getColor(i);
		});




		strokeWeight(4);
		push();
		translate(padding.left, padding.top);
		barData.forEach(function(d,i){
			push();
			translate(0,i*(innerHeight+gap));
			//console.log('barData.length',barData[i]);
			fftBarChart(barData[i],dBDomain,innerWidth,innerHeight,colors);
			pop();
		});

		//build a xaxis
				/*
		Name	Frequency Range			
		low_freqs	2.5-6.1Hz			
		delta_absolute	1-4Hz			
		theta_absolute	4-8Hz			
		alpha_absolute	7.5-13Hz			
		beta_absolute	13-30Hz			
		gamma_absolute	30-44Hz
		*/
		var ticks = [1,4,8,13,30,44,50,60,70,80,90,100,110];
		push();
		translate(0,innerHeight+10);
		stroke(100);
		strokeWeight(1);
		line(0,0,innerWidth,0);
		ticks.forEach(function(t,i){
			var tx = map(t,0,110,0,innerWidth);
			stroke(100);
			line(tx,0,tx,5);
			noStroke();
			fill(0);
			textAlign(CENTER,TOP);
			if(i==0){
				textAlign(LEFT,TOP);
			}
			if(i==ticks.length-1){
				textAlign(RIGHT,TOP);
			}
			text(t,tx,5);
		});
		pop();

		var colWidth = 100;
		var r = 15;
		var txtSze = 16;
		textSize(txtSze);
		translate(10,barData.length*(innerHeight+gap) +60);

		frequencies.forEach(function(f,i){
			//console.log(f,i);
			push();
			translate(i*colWidth,0);
			noStroke();
			fill(colorLookup[f]);
			ellipse(0,0,r,r);
			fill(0);
			text(f,r,6);
			pop();
		});

		pop();
	}


	function getColor(index) {
		var freq = index * 0.86;
		var band = getFrequencyBand(freq);
		return colorLookup[band];
	}

	function getFrequencyBand(freq) {

		/*
		Name	Frequency Range			
		low_freqs	2.5-6.1Hz			
		delta_absolute	1-4Hz			
		theta_absolute	4-8Hz			
		alpha_absolute	7.5-13Hz			
		beta_absolute	13-30Hz			
		gamma_absolute	30-44Hz
		*/
		if (freq < 1) {
			return no_freq;
		} else if (freq < 4) {
			return delta_absolute;
		} else if (freq < 8) {
			return theta_absolute;
		} else if (freq < 13) {
			return alpha_absolute;
		} else if (freq < 30) {
			return beta_absolute;
		} else if (freq < 44) {
			return gamma_absolute;
		} else {
			return high_freq;
		}
	}

	return my;
}



/**

Understanding Frequency Bins

The FFTs are calculated using a 256 sample window, 
which gives a transform that has 256 components and is symmetric (i.e. mirrored)
 around an additional component at 0Hz. In other words, you have 128 components, 
 followed by one for 0Hz, and then the mirror image of the same components. 
 This means you need only consider half of them (because the other half are the same, 
 only reflected) plus the one for 0Hz at the centre, which gives you 129 in total.

To get the frequency resolution for the bins, you can divide the sampling rate by the FFT length, 
so in the case of Muse: 220/256 ~ 0.86Hz/bin

So, the zeroth index of the FFT array represents 0Hz, the next index represents 0-0.86Hz, 
and so on up to 128*0.86 = 110Hz, which is the maximum frequency that our FFT with its 220Hz sampling rate can detect.


*/