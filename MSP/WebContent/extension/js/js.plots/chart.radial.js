var dataVal = null;
var keys = [ 'Alpha', 'Beta', 'Theta', 'Gamma', 'Delta' ];

function initData() {
	dataVal = [ {
		data : {}
	} ];
	for (var i = 0; i < keys.length; i++)
		dataVal[0].data[keys[i]] = Math.random();
};

function updateRadar() {
	if (dataVal == null)
		initData();
	d3.select('#chartBandWidths').datum(dataVal).call(chart);
}

// d3.select('#update')
// .on('click', update);

var chart = radialBarChart().barHeight(111).reverseLayerOrder(true)
		.capitalizeLabels(true).barColors(
				[ '#FF0099', '#660099', '#006600', '#FFCC00', '#990000' ])
		.domain([ -1, 1 ]).tickValues([ -1, 0, 1 ]).tickCircleValues(
				[ -1, 0, 1 ]);

updateRadar();