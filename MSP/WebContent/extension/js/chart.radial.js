var data = null;
var keys = ['Alpha', 'Beta', 'Theta', 'Gamma', 'Delta'];

function initData() {
  data = [{data: {}}];
  for(var i=0; i<keys.length; i++)
    data[0].data[keys[i]] = Math.random();
};

function update() {
  initData();

  d3.select('#chart')
    .datum(data)
    .call(chart);
}

d3.select('#update')
  .on('click', update);

var chart = radialBarChart()
  .barHeight(88)
  .reverseLayerOrder(true)
  .capitalizeLabels(true)
  .barColors(['#FF0099', '#660099', '#006600', '#FFCC00', '#990000'])
  .domain([0,1])
  .tickValues([1,.5,1])
  .tickCircleValues([0,.5,1]);

update();