var qp = {
	"4029":16,
	"8221":14,
	"4220":14,
	"4107":12,
	"6051":12,
	"6337":12,
	"365":12,
	"6081":11,
	"4347":10,
	"577":10,
	"4999":10,
	"4977":10,
	"2753":9,
	"3113":8,
	"4311":8,
	"4137":8,
	"5169":8,
	"4592":8,
	"7294":8,
	"5904":8,
	"154":7,
	"6496":7,
	"4433":6,
	"3737":6,
	"6191":6,
	"5421":6,
	"7039":6,
	"4183":6,
	"5378":6,
	"4084":6,
	"7120":4,
	"5488":4,
	"36":4,
	"4924":2,
	"5030":2,
	"6657":2,
	"5414":14,
	"248":14,
	"4856":14,
	"7149":14,
	"5069":12,
	"6508":12,
	"6100":12,
	"3085":11,
	"5468":10,
	"4185":10,
	"4102":10,
	"3749":10,
	"6820":9,
	"4174":9,
	"4240":8,
	"5017":8,
	"6055":8,
	"4318":8,
	"4970":8,
	"1885":8,
	"4134":6,
	"61":6,
	"4995":6,
	"7055":6,
	"7350":6,
	"1":6,
	"6347":6,
	"4082":6,
	"6217":6,
	"6029":6,
	"5357":5,
	"3415":4,
	"4554":4,
	"4377":4,
	"5602":2,
	"519":0
};

var xData = [];
var yData = [];
var oD = [];
data.forEach(function(o) {
	// xData.push(o.coeff);
	// yData.push(qp[o.name]);
	oD.push({coeff:o.coeff, qp:qp[o.name]});
});

oD = oD.sort(function(a, b){
	if (a.coeff > b.coeff) {
		return 1;
	}
	return -1;
});

oD.forEach(function(o) {
	xData.push(o.coeff);
	yData.push(o.qp);
});

//////////

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

// setup x 
var xValue = function(d) { return d.coeff;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return qp[d.name]}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data

  // don't want dots overlapping axis, so add in buffer to data domain
xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

// x-axis
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
.append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Coeff");

function linearRegression(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}

var lr = linearRegression(yData, xData);



var yval = data.map(yMap);
var xval = data.map(xMap);
var max = d3.max(data, function(d) { return d.coeff;});
var min = d3.min(data, function(d) { return d.coeff;});

var myLine = svg.append("svg:line")
    .attr("x1", xScale(min))
    .attr("y1", yScale(lr.intercept))
    .attr("x2", xScale(max))
    .attr("y2", yScale((max * lr.slope) + lr.intercept ))
    .style("stroke", "rgb(29,107,161)")
    .attr('stroke-width', 4);

// y-axis
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("qp");

// draw dots
svg.selectAll(".dot")
  .data(data)
.enter().append("circle")
  .attr("class", "dot")
  .attr("r", 3.5)
  .attr("cx", xMap)
  .attr("cy", yMap)
  .style("fill", function(d) { return color(cValue(d));})
  .on("mouseover", function(d) {
      tooltip.transition()
           .duration(200)
           .style("opacity", 0.9);
      tooltip.html(d.name + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
           .style("left", (d3.event.pageX + 5) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
      tooltip.transition()
           .duration(500)
           .style("opacity", 0);
  });