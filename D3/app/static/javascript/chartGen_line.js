/**
 * Created by EduanOosthuizen on 28/03/2016.
 *
 * Many thanks to Nick Zhu (https://github.com/NickQiZhu) that has published substantial parts of the contained code
 * under the MIT License for open source software.
 * Please not that this code is dependant on the d3.js library.

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions
 of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function chartGen_line(data) {
    function lineChart() {
        var _chart = {};

        var _width = 600, _height = 300, // Specify width and height of the SVG element
            _margins = {top: 30, left: 30, right: 30, bottom: 30},
            _x, _y,
            _data = [],
            _colors = d3.scale.category10(),
            _svg,
            _bodyG,
            _line;

        _chart.render = function () {
            if (!_svg) {
                _svg = d3.select("body").append("svg") // Create SVG element
                    .attr("height", _height)
                    .attr("width", _width);

                renderAxes(_svg);

                defineBodyClip(_svg);
            }

            renderBody(_svg);
        };

        function renderAxes(svg) {
            var axesG = svg.append("g") // Create svg 'g' elements for ALL axes
                .attr("class", "axes"); // This class is specifically assigned with styling in mind, charts.css

            renderXAxis(axesG); // Render the x-axis on the chart body (on the margin) by appending to axesG

            renderYAxis(axesG);
        }

        function renderXAxis(axesG) {
            var xAxis = d3.svg.axis()
                .scale(_x.range([0, quadrantWidth()])) // quadrantWidth return the width of the chart body
                .orient("bottom");

            axesG.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(xAxis);

            d3.selectAll("g.x g.tick")
                .append("line")
                .classed("grid-line", true)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", -quadrantHeight());
        }

        function renderYAxis(axesG) {
            var yAxis = d3.svg.axis()
                .scale(_y.range([quadrantHeight(), 0]))
                .orient("left");

            axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(yAxis);

            d3.selectAll("g.y g.tick")
                .append("line")
                .classed("grid-line", true)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", quadrantWidth())
                .attr("y2", 0);
        }

        function defineBodyClip(svg) { // The body clip is where 'paint' is allowed
            var padding = 5;

            svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0 - padding)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
        }

        function renderBody(svg) {
            if (!_bodyG)
                _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate("
                        + xStart() + ","
                        + yEnd() + ")")
                    .attr("clip-path", "url(#body-clip)");

            renderLines();

            renderDots();
        }

        function renderLines() {
            _line = d3.svg.line()
                .x(function (d) {
                    return _x(d.x);
                })
                .y(function (d) {
                    return _y(d.y);
                });

            _bodyG.selectAll("path.line")
                .data(_data)
                .enter()
                .append("path")
                .style("stroke", function (d, i) {
                    return _colors(i); //<-4C
                })
                .attr("class", "line");

            _bodyG.selectAll("path.line")
                .data(_data)
                .transition()
                .attr("d", function (d) {
                    return _line(d);
                });
        }

        function renderDots() {
            _data.forEach(function (list, i) {
                _bodyG.selectAll("circle._" + i)
                    .data(list)
                    .enter()
                    .append("circle")
                    .attr("class", "dot _" + i);

                _bodyG.selectAll("circle._" + i)
                    .data(list)
                    .style("stroke", function (d) {
                        return _colors(i);
                    })
                    .transition()
                    .attr("cx", function (d) {
                        return _x(d.x);
                    })
                    .attr("cy", function (d) {
                        return _y(d.y);
                    })
                    .attr("r", 4.5);
            });
        }

        function xStart() {
            return _margins.left;
        }

        function yStart() {
            return _height - _margins.bottom;
        }

        function xEnd() {
            return _width - _margins.right;
        }

        function yEnd() {
            return _margins.top;
        }

        function quadrantWidth() {
            return _width - _margins.left - _margins.right;
        }

        function quadrantHeight() {
            return _height - _margins.top - _margins.bottom;
        }

        _chart.width = function (w) {
            if (!arguments.length) return _width;
            _width = w;
            return _chart;
        };

        _chart.height = function (h) {
            if (!arguments.length) return _height;
            _height = h;
            return _chart;
        };

        _chart.margins = function (m) {
            if (!arguments.length) return _margins;
            _margins = m;
            return _chart;
        };

        _chart.colors = function (c) {
            if (!arguments.length) return _colors;
            _colors = c;
            return _chart;
        };

        _chart.x = function (x) {
            if (!arguments.length) return _x;
            _x = x;
            return _chart;
        };

        _chart.y = function (y) {
            if (!arguments.length) return _y;
            _y = y;
            return _chart;
        };

        _chart.addSeries = function (series) {
            _data.push(series);
            return _chart;
        };

        return _chart;
    } // End of lineChart function.

    // function randomData() {
    //     return Math.random() * 9;
    // }

    // function update() {
    //    for (var i = 0; i < data.length; ++i) {
    //         var series = data[i];
    //         series.length = 0;
    //         for (var j = 0; j < numberOfDataPoint; ++j)
    //             series.push({x: j, y: randomData()});
    //     }
    //     chart.render();
    // }

    // for (var i = 0; i < numberOfSeries; ++i)
    //     data.push(d3.range(numberOfDataPoint).map(function (i) {
    //         return {x: i, y: randomData()};
    //     }));

    var chart = lineChart() // Create chart
        .x(d3.scale.linear().domain([0, 100])) // CORRECT, this should be dynamic, NOT hard code.
        .y(d3.scale.linear().domain([0, 5]));

    data.forEach(function (series) {
        chart.addSeries(series);
    });

    chart.render();
}