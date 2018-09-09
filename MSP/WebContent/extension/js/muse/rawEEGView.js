var eeg1 = [];
function rawEEGView(model, idArr,title, description) {
	var my = view(model, idArr,title, description);
	var padding = my.getPadding();
	var uVDomain = [1682.815/3,2*1682.815/3];
	var BDomain = [-1,1];
	var frequencies = ['Delta','Theta','Alpha','Beta','Gamma'];
	// var colors = ['#225378', '#1695A3', '#ACF0F2', '#F3FFE2', '#EB7F00'];
// var colors = [ '#0A7B83', '#2AA876', '#FFD265', '#F19C65', '#CE4D45'];
	
var padding = my.getPadding();
	var colors = {
		'1': '#2AA876',
		'2': '#FFD265',
		'3': '#CE4D45',
		'4': '#CE4D45',
		'5': '#CE4D45'
	};

	var foreHeadColors = {
		'0': '#eee',
		'1': 'black'
	};

	var colors = [ '#0A7B83', '#2AA876', '#FFD265', '#F19C65', '#CE4D45'];
	my.render = function() {
		eeg1 = model.rawEEG.leftEar;
		var lineData = [model.rawEEG.leftEar, model.rawEEG.leftFront,
		model.rawEEG.rightFront, model.rawEEG.rightEar];
		var innerWidth = width - padding.left - padding.right;
		var innerHeight = 50;
		var gap = 2;
		var horseshoe = select('#horseshoe');
		horseshoe.style('margin-top','0px');
		horseshoe.style('margin-left','0px');
		$("#battVal").html(Math.round((model.batt.value / 100))+ "%");
		select('#leftEar').style('fill',colors[model.horseshoe.leftEar]);
		select('#leftFront').style('fill',colors[model.horseshoe.leftFront]);
		select('#rightFront').style('fill',colors[model.horseshoe.rightFront]);
		select('#rightEar').style('fill',colors[model.horseshoe.rightEar]);
		updateBarAcc("X", Math.abs(model.acc.values[0] + 2000)/4000);
		updateBarAcc("Y", Math.abs(model.acc.values[1] + 2000)/4000);
		updateBarAcc("Z", Math.abs(model.acc.values[2] + 2000)/4000);
		select('#front').style('fill',foreHeadColors[model.touching_forehead]);
		push();
		translate(padding.left, padding.top);
		lineData.forEach(function(ld, i) {
			push();
			translate(0,i*(innerHeight+gap));
			noFill();
			stroke(10);
			strokeWeight(1);
			lineChart(ld, uVDomain, innerWidth, innerHeight,'uV');
			pop();
		});
		var areaData = [model.absoluteBand.delta.mean,model.absoluteBand.theta.mean,
			model.absoluteBand.alpha.mean,model.absoluteBand.beta.mean,model.absoluteBand.gamma.mean];
		strokeWeight(1);
		noStroke();
		translate(padding.left, padding.top + 222);
		areaData.forEach(function(d,i){
			push();
			translate(0,i*(innerHeight+gap));
			fill(colors[i]);
			stroke(colors[i]);
			strokeWeight(1);
			areaChart(areaData[i],BDomain,innerWidth,innerHeight,'Bels (B)');
			pop();
		});

		// legend
		var colWidth = 55;
		var r = 11;
		var txtSze = 12;
		textSize(txtSze);
		translate(10,areaData.length*(innerHeight+gap) + 20);
		frequencies.forEach(function(f,i){
			// console.log(f,i);
			push();
			translate(i*colWidth,0);
			noStroke();
			fill(colors[i]);
			ellipse(0,0,r,r);
			fill(colors[i]);
			text(f,r,6);
			pop();
		});
		
		
		
		
		
		
		
		
		
		pop();
	}

	return my;
}

function updateBarAcc(id, value) {
	$("#" + id).css("height", Math.abs(100 - Math.abs(value * 100)) + "%");
}
