function rawEEGView(model, idArr,title, description) {

	var my = view(model, idArr,title, description);

	var padding = my.getPadding();
	//0.0 - 1682.815
	//var uVDomain = [0, 1682.815];
	var uVDomain = [1682.815/3,2*1682.815/3];

	console.log(my);

	my.render = function() {
		//console.log('rawEEGView.render');
		//console.log(my);
		//console.log('title: ' + my.getTitle());
		//console.log('description: ' + my.getDescription());

		//my.renderCommon();


		var lineData = [model.rawEEG.leftEar, model.rawEEG.leftFront, model.rawEEG.rightFront, model.rawEEG.rightEar];
		var innerWidth = width - padding.left - padding.right;
		var innerHeight = 100;
		var gap = 10;

		push();
		translate(padding.left, padding.top);
		lineData.forEach(function(ld, i) {
			push();
			translate(0,i*(innerHeight+gap));
			//fill(250);
			//noStroke();
			//rect(0, 0, innerWidth, innerHeight);
			noFill();
			stroke(50);
			strokeWeight(2);
			lineChart(ld, uVDomain, innerWidth, innerHeight,'uV');
			pop();
		});
		
		pop();
	}

	return my;
}

