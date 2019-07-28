// === Set up canvas === //

var width = 750,
  height = 400;

var data = [];
var value = 5000;
var colourScale;

var canvas = d3
  .select("#container")
  .append("canvas")
  .attr("width", width)
  .attr("height", height);

var context = canvas.node().getContext("2d");

// === Load and prepare the data === //

d3.range(value).forEach(function(el) {
  data.push({ value: el });
});

console.log(data);

// === Bind data to custom elements === //

var customBase = document.createElement("custom");
var custom = d3.select(customBase); // this is our svg replacement

// settings for a grid with 40 cells in a row and 2x5 cells in a group
var groupSpacing = 4;
var cellSpacing = 2;
var cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing;

// === First call === //

databind(data); // ...then update the databind function

var t = d3.timer(function(elapsed) {
  draw();
  if (elapsed > 300) t.stop();
}); // start a timer that runs the draw function for 500 ms (this needs to be higher than the transition in the databind function)

// === Bind and draw functions === //

function databind(data) {
  colourScale = d3.scaleSequential(d3.interpolateSpectral).domain(
    d3.extent(data, function(d) {
      return d.value;
    })
  );

  var join = custom.selectAll("custom.rect").data(data);

  var enterSel = join
    .enter()
    .append("custom")
    .attr("class", "rect")
    .attr("x", function(d, i) {
      var x0 = Math.floor(i / 100) % 10,
        x1 = Math.floor(i % 10);
      return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
    })
    .attr("y", function(d, i) {
      var y0 = Math.floor(i / 1000),
        y1 = Math.floor((i % 100) / 10);
      return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
    })
    .attr("width", 0)
    .attr("height", 0);

  join
    .merge(enterSel)
    .transition()
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fillStyle", function(d) {
      return colourScale(d.value);
    });

  var exitSel = join
    .exit()
    .transition()
    .attr("width", 0)
    .attr("height", 0)
    .remove();
} // databind()

// === Draw canvas === //

function draw() {
  // clear canvas

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  // draw each individual custom element with their properties

  var elements = custom.selectAll("custom.rect"); // this is the same as the join variable, but used here to draw

  elements.each(function(d, i) {
    // for each virtual/custom element...

    var node = d3.select(this);
    context.fillStyle = node.attr("fillStyle");
    context.fillRect(
      node.attr("x"),
      node.attr("y"),
      node.attr("width"),
      node.attr("height")
    );
  });
} // draw()

// === Listeners/handlers === //

d3.select("#text-input").on("keydown", function() {
  if (d3.event.keyCode === 13) {
    d3.select("#alert").html("");

    if (+this.value < 1 || +this.value > 10000) {
      d3.select("#text-explain").classed("alert", true);

      return;
    } else {
      d3.select("#text-explain").classed("alert", false);

      data = [];

      d3.range(+this.value).forEach(function(el) {
        data.push({ value: el });
      });

      databind(data);

      var t = d3.timer(function(elapsed) {
        draw();
        if (elapsed > 500) t.stop();
      }); // start a timer that runs the draw function for 500 ms (this needs to be higher than the transition in the databind function)
    } // value test
  } // keyCode 13 === return
}); // text input listener/handler