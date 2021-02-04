const svg = d3.select(".donut-chart-container")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");

const width = 350,
  height = 450,
	radius = Math.min(width, height) / 2;

const pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

const arc = d3.svg.arc()
	.outerRadius(radius * 0.95)
	.innerRadius(radius * 0.65);

const legendRectSize = (radius * 0.1);
const legendSpacing = radius * 0.02;

const reducer = (accumulator, currentValue) => accumulator + currentValue;

const monthlyPayment = d3.select(".donut-chart-container")
  .append("div")
  .attr("class", "monthly-payment");

const toolTip = d3.select(".donut-chart-container")
  .append("div")
  .attr("class", "tooltip");

const colorRange = d3.scale.category20();
const color = d3.scale.ordinal()
	.range(colorRange.range());

function change(data) {
  const sum = data.map(entry => entry.value).reduce(reducer, 0);
  monthlyPayment.html(`<span class="payment-amount">$${sum}</span><br>/month`);

	const slice = svg.select(".slices").selectAll("path.slice")
    .data(pie(data), function(d){ return d.data.label });

  slice.enter()
    .insert("path")
    .style("fill", function(d) { return color(d.data.label); })
    .attr("class", "slice");

  slice
    .transition().duration(300)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      const interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      };
    })

  slice
    .on("mousemove", function(d){
      const chartRect = document.getElementsByClassName("donut-chart-container")[0].getBoundingClientRect();
      toolTip.style("left", d3.event.pageX - chartRect.x + "px");
      toolTip.style("top", d3.event.pageY - chartRect.y + 25 + "px");
      toolTip.style("display", "inline-block");
      toolTip.html((d.data.label) + "<br>" + (d.data.value) + "$");
    });
  
  slice
    .on("mouseout", function(d){
      toolTip.style("display", "none");
    });

  slice.exit()
    .remove();

  const legend = svg.selectAll(".legend")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      const height = legendRectSize + legendSpacing;
      const horz = -10 * legendRectSize;
      const vert = i * height + 200;
      return "translate(" + horz + "," + vert + ")";
    });

  legend.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", function(d) { return color(d.label); })
    .style("stroke", function(d) { return color(d.label); });

  legend.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text(function(d) { return d.label + " ($" + d.value + ")"; });
};

export default change;
