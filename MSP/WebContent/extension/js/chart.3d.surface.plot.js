var svg33 = d3.select("#accelerometer3DPlot").append("svg").attr("width", 300)
		.attr("height", 600);
var data3D = [ [ [ 0, -1, 0 ], [ -1, 1, 0 ], [ 1, 1, 0 ] ] ];
var triangles3D = d3._3d().scale(100).origin([ 480, 250 ]).shape('TRIANGLE');
var projectedData = triangles3D(data3D);
init(projectedData);
function init(data) {
	var triangles = svg33.selectAll('path').data(data);
	console.log(data);
}