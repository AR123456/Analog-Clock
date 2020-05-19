// boiler plate for margin convention
const svg = d3.select("svg"),
  margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = svg.attr("width") - margin.left - margin.right,
  height = svg.attr("height") - margin.top - margin.bottom;
// specifier for year b and d are set to match the data
const parseDate = d3.timeParse("%Y %b %d");
// time on x axi
const x = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  // z = d3.scaleOrdinal(d3.schemeCategory20);
  // https://github.com/d3/d3-scale-chromatic
  z = d3.scaleOrdinal(d3.schemeDark2);
// call to d3 stack
const stack = d3.stack();
//path generator for area fields
const area = d3
  // this passes the array data associated with the
  ///groups(layers) to the area function.  the "d"
  .area()
  .x((d) => {
    // date object for each row
    return x(d.data.date);
  })
  .y0((d) => {
    return y(d[0]);
  })
  .y1((d) => {
    return y(d[1]);
  });
// setting the g variable
const g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// the data loading function passing in the type function defined
// below - it transforms every data point in the array
// what is the syntax for passing in the type function in version 5?
// https://stackoverflow.com/questions/49941618/dynamic-loading-data-using-d3-csv-in-d3-v5
// http://learnjsdata.com/read_data.html
//v5 syntax
d3.tsv("data/stacked_area1.tsv", type)
  .then((data) => {
    console.log(data);

    // column headers, slice at 1 removes the
    //date heading so we just have the  browser names
    const keys = data.columns.slice(1);
    // setting the x scale domain
    x.domain(
      d3.extent(data, (d) => {
        return d.date;
      })
    );
    // the y scale domanin defalts to a value of 0 to 1
    // since y scale is 0 - 100% no need to set they y domain
    // the list of browswer names is the domain for
    // the colors in the color scale
    z.domain(keys);
    // passing list of browser names as the keys method to d3 stack
    stack.keys(keys);
    // raw data
    console.log(data);
    // result of stack functin being passed into
    // data join
    console.log(stack(data));

    const layer = g
      // matching elements with class of layer
      .selectAll(".layer")
      // doing data join on stack of data

      .data(stack(data))
      .enter()
      // appending svg groups for each of
      //the 8 browsers which are the items in the array
      .append("g")
      .attr("class", "layer");
    // attach path to each of the (8) groups
    layer
      .append("path")
      // using area generator function
      .attr("class", "area")
      // giving it a fill color based on
      // ordinal scale in key field
      .style("fill", (d) => {
        return z(d.key);
      })
      // set the d attribute of the paths with the
      // area generator
      // this passes the array data associated with the
      ///groups(layers) to the area function
      .attr("d", area);
    // this block of code adds the text labels to the chart
    // Only label the layers left at the end (if one browser disappears)
    // this is not great design,lables could overlap and it dosent look nice
    // a legand for each of the browsers would be better design
    layer
      .filter((d) => {
        return d[d.length - 1][1] - d[d.length - 1][0] > 0.01;
      })
      .append("text")
      .attr("x", width - 6)
      .attr("y", (d) => {
        return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
      })
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "end")
      .text((d) => {
        return d.key;
      });
    // adding the axes at the end of the data loading function
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));
  })
  .catch((error) => {
    console.log(error);
  });

// transfroms every data point in the array
function type(d, i, columns) {
  // convert the data string into js date object
  d.date = parseDate(d.date);
  // make values in the object into a %
  for (let i = 1, n = columns.length; i < n; ++i)
    d[columns[i]] = d[columns[i]] / 100;
  return d;
}
