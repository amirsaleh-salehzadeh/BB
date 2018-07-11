function absoluteBandView(model, idArr,title, description) {

	var my = view(model, idArr,title, description);

	var padding = my.getPadding();
	
	var BDomain = [-1,1];

	//data.absoluteBand.delta.leftFront


	var frequencies = ['Delta','Theta','Alpha','Beta','Gamma'];
	//var colors = ['#225378', '#1695A3', '#ACF0F2', '#F3FFE2', '#EB7F00'];
	var colors = [ '#0A7B83', '#2AA876', '#FFD265', '#F19C65', '#CE4D45'];
	
	my.render = function() {
		//console.log('rawEEGView.render');
		//console.log(my);
		//console.log('title: ' + my.getTitle());
		//console.log('description: ' + my.getDescription());

		//my.renderCommon();


		console.log(model.absoluteBand.delta);
		//var areaData = [model.absoluteBand.delta.leftFront,data.absoluteBand.theta.leftFront,data.absoluteBand.alpha.leftFront,data.absoluteBand.beta.leftFront,data.absoluteBand.gamma.leftFront];
		var areaData = [model.absoluteBand.delta.mean,data.absoluteBand.theta.mean,data.absoluteBand.alpha.mean,data.absoluteBand.beta.mean,data.absoluteBand.gamma.mean];
			
		var innerWidth = width - padding.left - padding.right;
		var innerHeight = 90;
		var gap = 10;


		strokeWeight(1);
		noStroke();
		push();
		translate(padding.left, padding.top);
		areaData.forEach(function(d,i){
			push();
			translate(0,i*(innerHeight+gap));
			fill(colors[i]);
			stroke(colors[i]);
			strokeWeight(1);
			areaChart(areaData[i],BDomain,innerWidth,innerHeight,'Bels (B)');
			pop();
		});
		


		//legend
		var colWidth = 100;
		var r = 15;
		var txtSze = 16;
		textSize(txtSze);
		translate(10,areaData.length*(innerHeight+gap) + 30);
		frequencies.forEach(function(f,i){
			//console.log(f,i);
			push();
			translate(i*colWidth,0);
			noStroke();
			fill(colors[i]);
			ellipse(0,0,r,r);
			fill(0);
			text(f,r,6);
			pop();
		});
		pop();
/*
		var lineData = [model.rawEEG.leftEar, model.rawEEG.leftFront, model.rawEEG.rightFront, model.rawEEG.rightEar];
		var innerWidth = width - padding.left - padding.right;
		var innerHeight = 100;
		var gap = 10;

		push();
		translate(padding.left, padding.top);
		lineData.forEach(function(ld, i) {
			push();
			translate(0,i*(innerHeight+gap));
			fill(250);
			noStroke();
			rect(0, 0, innerWidth, innerHeight);
			noFill();
			stroke(50);
			strokeWeight(1.8);
			lineChart(ld, uVDomain, innerWidth, innerHeight);
			pop();
		});
		
		pop();*/
	}

	return my;
}


/**

delta_absolute	1-4Hz			
theta_absolute	4-8Hz			
alpha_absolute	7.5-13Hz			
beta_absolute	13-30Hz			
gamma_absolute	30-44Hz

*/

