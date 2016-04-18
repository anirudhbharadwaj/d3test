var headers=[]
var all_lines=[]
var csv_file = "car.csv"
var xVal=""
var yVal=""

function process_data(all_data) {
    var allTextLines = all_data.split(/\r\n|\n/);
    headers = allTextLines[0].split(',');
    var select = $('select');
    for(var i=0; i<headers.length;i++){
        if(headers[i] != 'name' && headers[i] != 'origin'){
            $('<option></option>').val(headers[i])
                .text(headers[i])
                .appendTo(select)
        }
    }
	xVal='mpg';
	yVal='mpg';
	for(var i=1;i<allTextLines.length;i++)	{
		var line={};
		var attrs=allTextLines[i].split(',');
		line[headers[0]]=attrs[0];
		line[headers[1]]=attrs[1];
		line[headers[2]]=attrs[2];
		line[headers[3]]=attrs[3];
		line[headers[4]]=attrs[4];
		line[headers[5]]=attrs[5];
		line[headers[6]]=attrs[6];
		line[headers[7]]=attrs[7];
		line[headers[8]]=attrs[8];
		line['id']=i;
		all_lines.push(line);
	}
	draw(all_lines);
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}  

function checkQuery()	{
	if(!$('#mpg-min').val() || !$('#mpg-max').val())	{
		alert("Input a min and a max MPG value !!!");
		return false;
	}
	else if(Number($('#mpg-max').val())<=Number($('#mpg-min').val()))	{
		alert("Max must be lesser than min !!!");
		return false;
	}
	return true;
}


// Draw the SVG
var draw = function(values) {
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    var svg = d3.select('svg')
        .attr('width',width + margin.left + margin.right)
        .attr('height',height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	//$("svg").css({top: 10, left: 200, position:'absolute'});
	// setup x
	var xValue = function(obj) { return Number(obj[xVal]);},
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	// setup y
	var yValue = function(d) { return Number(d[yVal]);},
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left");
	var cValue = function(d) { return d.origin;},
    color = d3.scale.category10();
	var max=d3.max(values, xValue);
	var min=d3.min(values, xValue);
	var padding=(max-min)*0.01;
	xScale.domain([min-padding, max+padding]);
	max=d3.max(values, yValue);
	min=d3.min(values, yValue);
	padding=(max-min)*0.01;
	yScale.domain([min-padding, max+padding]);
	
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(xVal);

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
      .text(yVal);
	  
	var rects = svg.selectAll('.dot').data(values,function(obj)	{	return obj.id	});
    rects.enter().append("circle")
	rects
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
	  .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          d3.select('h4').text(d.name);
      });
	  
	  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});
		
	d3.select("[id=sel-x]").on("change", function(){
		xAxy = this.value;
		xVal=xAxy;
		max=d3.max(values, xValue);
		min=d3.min(values, xValue);
		padding=(max-min)*0.01;
		console.log(xAxy);
		xScale.domain([min-padding, max+padding]);
		svg.select(".x.axis").transition().call(xAxis);
		svg.selectAll(".dot").transition().attr("cx", xMap);
		svg.selectAll(".x.axis").selectAll("text.label").text(xAxy);
	});
	d3.select("[id=sel-y]").on("change", function(){
		yAxy = this.value;
		yVal=yAxy;
		max=d3.max(values, yValue);
		min=d3.min(values, yValue);
		padding=(max-min)*0.01;
		console.log(d3.max(values, yValue));
		yScale.domain([min-padding, max+padding]);
		svg.select(".y.axis").transition().call(yAxis);
		svg.selectAll(".dot").transition().attr("cy", yMap);
		svg.selectAll(".y.axis").selectAll("text.label").text(yAxy);
	});
	d3.select("[id=update]").on("click", function(){
		if(checkQuery())	{
			console.log("F");
			min = Number($('#mpg-min').val());
			max = Number($('#mpg-max').val());
			svg.selectAll(".dot")
				.filter(function(d) {return (d.mpg<min || d.mpg>max)?true:false;})
				.attr("display", "none");
			svg.selectAll(".dot")
				.filter(function(d) {return (d.mpg>=min && d.mpg<=max)?true:false;})
				.attr("display", "inline");
		}
	});
		
	rects.exit().remove();

}


$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: csv_file,
        dataType: "text",
        success: function(data) {process_data(data);}
    });
});