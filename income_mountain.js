var income_mountain = function(properties) {
    "use strict";

    var wrapper_div;                        // Where the div will be loaded

    var mountain_svg;                       // Income mountains svg
    var svg_height = 450;                   // SVG height
    var svg_width = 900;                    // SVG width
    
    var label_div;                          // Labels div
    var labels = [];                        // Labels array
    
    var stacked = true;                     // Whether mountains are stacked or not

    /** Initialize variables */
    var init = function(properties) {
        if (properties === undefined || typeof properties.div !== "string") {
            console.error("You must initialize at least with a div identifier!");
            return;
        }
        
        wrapper_div = d3.select(properties.div).empty()
            ? d3.select("body")
            : d3.select(properties.div);
        
        svg_height = properties.height || svg_height;
        svg_width = properties.width || svg_width;
        
        stacked = properties.stacked || stacked;
        
        init_drawing_space();
    };

    /** Draws the svg box for the Income Mountain in the wrapper div */
    var init_drawing_space = function() {
        mountain_svg = wrapper_div.append("svg:svg")
            .attr("width", svg_width)
            .attr("height", svg_height)
            .attr("class", "mountains")
            .attr("id", "gapminder-income-mountains");
        
        label_div = wrapper_div.append("div")
            .attr("class", "im-labels")
            .attr("id", "gapminder-geo-labels");
        
        label_div.style("position", "relative")
            .style("top", (-svg_height + svg_height * 0.1) + "px")  // fix positioning to use bbox
            .style("left", (svg_width * 0.05) + "px");              // fix positioning to use bbox
    };

    /** This function calls the drawing of the mountain and the label which are
     *  passed to the function as parameter.
     *
     *  @param  geo_name    Name of geo location associated with the mountain
     *  @param  geo_data    Data for drawing the mountain
     */
    var draw = function(geo_name, geo_data) {
        mountain(geo_name, geo_data);
        label(geo_name);
    };
    
    /** Draws a income mountain.
     *
     *  @param  geo_name    Name of geo location associated with the mountain
     *  @param  geo_data    Data for drawing the mountain
     */
    var mountain = function(geo_name, geo_data) {
        if (!mountain_svg) {
            return;
        }
        
        mountain_svg.append("svg:g").selectAll("path")
            .data([geo_data])
          .enter().append("svg:path")
            .attr("id", geo_name + "-mountain")
            .attr("fill", "#FF5471")
            .attr("d", function(d) { return stacked ? stacked_area(d) : area(d); });
    };

    /** Helper function that returns a svg path using d3's svg area based on
     *  the points supplied by area_points.
     *
     *  @param  area_points     Desc
     */
    var area = function(area_points) {
        return d3.svg.area()
            .interpolate("basis")
            .x(function(d) { return d[0]; })
            .y0(svg_height)
            .y1(function(d) { return d[1]; })
          (area_points);
    };
    
    var stacked_area = function(area_points) {
        return d3.svg.area()
            .interpolate("basis")
            .x(function(d) { return d[0]; })
            .y0(function(d) { return svg_height - d.y0; })
            .y1(function(d) { return svg_height - (d.y0 + d.y); })
          (area_points);
    };
    
    var label = function(geo_name) {
        labels.push(geo_name);

        // Text + close button
        label_div.append("p").selectAll("p")
            .data(labels)
          .enter().append("p")
            .text(function(d) { return d; })
            .append("rect")
    };

    /** Function that clears the mountain svg of all its elements */
    var clear = function() {
        labels = [];
        mountain_svg.remove();
    }

    /**
     *  Public API
     *  ----------
     *
     *  init - initializes an income mountain
     *  draw - draws an income mountain
     *  clear - clears all elements from the income mountain
     */
    return {
        init: init,
        draw: draw,
        clear: clear
    };
};


