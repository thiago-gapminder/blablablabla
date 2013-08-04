gapminder.viz.income_mountain = function income_mountain(properties) {
    "use strict";
    
    var containing_div = {};
    
    var mountain_svg = {};
    
    var height = 500;
    var width = 900;
    
    var init = function init(properties) {
        if (gapminder.debug) {
            console.debug("gapminder.viz.income_mountain: init(): properties", properties);
        }
        
        containing_div = d3.select(properties.div);

        // Invalid div breaks the viz. Does not default to body because doing
        // that would hide the error.
        if (containing_div.empty()) {
            console.error("You should pass a valid div id!");
            return;
        }

        height = Number(properties.height) || height;
        width = Number(properties.width) || width;

        mountain_svg = containing_div.append("svg")
            .attr("class", "mountains")
            .attr("height", height)
            .attr("width", width);
    };

    var draw = function draw(mountain_info) {
        if (!mountain_info || !mountain_info.data) {
            return;
        }

        var shape = mountain_svg
            .append("g")
            .attr("id", mountain_info.name + "-income-mountain")
            .selectAll("path")
            .data(mountain_info.data);
        
        shape.enter()
            .append("path")
            .attr("fill", mountain_info.color)
            .attr("d", area);
    };

    var clear = function clear() {
        mountain_svg.selectAll("g").remove();
    };
    
    var area = function area(points) {
        return d3.svg.area()
            .interpolate("basis")
            .x(function(d) { return d.x; })
            .y0(function(d) { return height - d.y0; })
            .y1(function(d) { return height - (d.y0 + d.y); })
            (points);
    };
    
    
    // Execute
    init(properties);
    
    if (gapminder.debug) {
        console.debug("gapminder.viz.income_mountain: complete");
    }
    
    return {
        show: draw,
        clear: clear
    };
};


// var inc1 = gapminder.tools.income_mountain({
//      div: '#container',
//      height: 500,
//      width: 900
// }

// inc1.play(); --> inc1.clear(); for (i in list) draw(i);
// directory: group by viz or group by 'module'? Grouping by viz might be better.