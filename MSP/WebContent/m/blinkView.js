function blinkView(model, idArr,title, description) {

	var my = view(model, idArr,title, description);

	var padding = my.getPadding();
	


	my.render = function() {
		//console.log('rawEEGView.render');
		//console.log(my);
		//console.log('title: ' + my.getTitle());
		//console.log('description: ' + my.getDescription());

		//my.renderCommon();

		
		console.log(model.blink);

		if(model.blink == 1){
			//we have a blink
			select('#eye_open').hide();
			select('#eye_closed').show();
			select('#eye_closed').style('margin-top','100px');
			select('#eye_closed').style('margin-left','100px');
		}
		else{
			select('#eye_closed').hide();
			select('#eye_open').show();
			select('#eye_open').style('margin-top','100px');
			select('#eye_open').style('margin-left','100px');
			
		}

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

