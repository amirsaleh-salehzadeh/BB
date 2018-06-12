function horseshoeView(model, idArr,title, description) {

	var my = view(model, idArr,title, description);

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
		//console.log('rawEEGView.render');
		//console.log(my);
		//console.log('title: ' + my.getTitle());
		//console.log('description: ' + my.getDescription());

		//my.renderCommon();

		var horseshoe = select('#horseshoe');
		horseshoe.style('margin-top','100px');
		horseshoe.style('margin-left','100px');

		 select('#muse').position(600,250);
		 select('#muse').style('width','500px');
		//console.log(model.horseshoe);
		//console.log(select('#leftFront'));
		select('#leftFront').style('fill','red');

		select('#leftEar').style('fill',colors[model.horseshoe.leftEar]);
		select('#leftFront').style('fill',colors[model.horseshoe.leftFront]);
		select('#rightFront').style('fill',colors[model.horseshoe.rightFront]);
		select('#rightEar').style('fill',colors[model.horseshoe.rightEar]);

		select('#front').style('fill',foreHeadColors[model.touching_forehead]);

		//console.log(model.horseshoe);



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

