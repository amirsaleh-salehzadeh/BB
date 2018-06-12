function jawView(model, title, description) {

	var my = view(model, title, description);

	var padding = my.getPadding();
	


	my.render = function() {
		//console.log('rawEEGView.render');
		//console.log(my);
		//console.log('title: ' + my.getTitle());
		//console.log('description: ' + my.getDescription());

		//my.renderCommon();

		
		console.log(model.jaw);

		if(model.jaw == 1){
			//we have a blink
			select('#smile').hide();
			select('#jaw_clench').show();
			select('#jaw_clench').style('margin-top','0px');
			select('#jaw_clench').style('margin-left','0px');
		}
		else{
			select('#jaw_clench').hide();
			select('#smile').show();
			select('#smile').style('margin-top','0px');
			select('#smile').style('margin-left','0px');
			
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

