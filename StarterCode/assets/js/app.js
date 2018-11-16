// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("../../../data/data.csv", function(error, data) {
    if (error) return console.warn(error);
  
    console.log(data);
  
    var names = data.map(data => data.abbr);
    console.log("names", names);

    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.noHealthInsurance = +data.noHealthInsurance;
    });


    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty)-1, d3.max(data, d => d.poverty)+1])
      .range([0, width]);
  
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.noHealthInsurance)-1, d3.max(data, d => d.noHealthInsurance)+1])
      .range([height, 0]);
  
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    chartGroup.append("g")
      .call(leftAxis);
  

    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.noHealthInsurance))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.noHealthInsurance))
    .attr("font_family", "sans-serif")  
    .attr("font-size", "8px")  
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .text(d => d.abbr);

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 30])
    .html(function(d) {
      return (`${d.state}<br>Lacks Healthcare (%): ${d.noHealthInsurance}<br>In Poverty (%): ${d.poverty}`);
    });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

  });