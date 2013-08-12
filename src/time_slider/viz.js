gapminder.viz.time_slider = function viz_time_slider(properties) {
    var ts_div = {};
    var ts_svg = {};

    var time = {
        start: 1800,
        current: 1800,
        end: 2100
    };

    var buttons = {
        play_button: {},
        pause_button: {},
        moveable_button: {}
    };

    var timeline_x = {}; // future timeline X scale

    var init = function init(properties) {
        ts_div = d3.select(properties.div);
        //console.log(ts_div);
        ts_svg = ts_div.append("svg")
            .attr("height", ts_div.attr("height"))
            .attr("width", ts_div.attr("width"));

        time.start = +properties.start || time.start;
        time.end = +properties.end || time.end;
        time.current = +properties.current || time.start;
        
        timeline_x = d3.time.scale().range([60, 250])
            .domain([new Date(time.start, 0), new Date(time.end, 0)])
            .clamp(true);

        // Time slider pieces
        timeline();
        play_button();
        pause_button();
        moveable_button();
        year_text();
    };
    
    var timeline = function timeline() {
        var parse_time = d3.time.format("%Y").parse;
        
        var time_values = [
            new Date(time.start, 0),
            new Date(time.start + (time.end - time.start) / 2, 0),
            new Date(time.end, 0)
        ];

        var xAxis = d3.svg.axis().scale(timeline_x)
            .tickValues(time_values)
            .tickSize(15, 0, 2)
            .tickPadding(11)
            .tickSubdivide(1)
            .tickFormat(function(d) { return d.getFullYear(); });

        ts_svg.append("g")
            .attr("class", "timeline")
            .attr("transform", "translate(0,40)")
            .call(xAxis);
    };
    
    var play_button = function play_button() {    
        var button = ts_svg.append("g")
            .attr("class", "play_button");
        
        button.append("circle")
            .attr("r", 18.032)
            .attr("cx", 19.032)
            .attr("cy", 19.032);
        
        button.append("path")
            .attr("d", gapminder.graphics.time_slider.play_triangle);
        
        button.attr("transform", "translate(0, 18)")
            .attr("visibility", "visible");
        
        buttons.play_button = button;
    };
    
    var pause_button = function pause_button() {
        var button = ts_svg.append("g")
            .attr("class", "pause_button");
        
        button.append("circle")
            .attr("r", 18.032)
            .attr("cx", 19.032)
            .attr("cy", 19.032);
        
        button.append("path")
            .attr("d", gapminder.graphics.time_slider.pause_bar1);
        
        button.append("path")
            .attr("d", gapminder.graphics.time_slider.pause_bar2);
        
        button.attr("transform", "translate(0, 18)")
            .attr("visibility", "hidden");
        
        buttons.pause_button = button;
    };
    
    var moveable_button = function moveable_button() {
        var button = ts_svg.append("g")
            .attr("class", "moveable_button");

        // Miterlimit?
        button.append("path")
            .attr("stroke-miterlimit", 10)
            .attr("d", gapminder.graphics.time_slider.move_button);
        
        button.append("rect")
            .attr("x", 8.146993)
            .attr("y", 9.002818)
            .attr("width", 2.985586)
            .attr("height", 12.574781);
        
        button.append("rect")
            .attr("x", 12.77933)
            .attr("y", 9.002818)
            .attr("width", 2.985586)
            .attr("height", 12.574781);
        
        button.attr("transform", "translate(48, 25)");
        
        buttons.moveable_button = button;
    };
    
    var year_text = function year_text() {
        var text = ts_svg.selectAll(".time_slider_year")
            .data([time.current], function(d) { return d; });
        
        text.enter()
            .append("text")
            .attr("class", "time_slider_year")
            .attr("x", 155)
            .attr("y", 30)
            .text(function(d) { return Math.floor(time.current); });
        
        text.exit().remove();
    };
    
    var update = function update() {
        year_text();
    };
    
    init(properties);
    
    return {
        buttons: buttons,
        time: time,
        update: update,
        timeline_x: timeline_x
    };
};

// SPLASH DATA// SPLASH DATA// SPLASH DATA// SPLASH DATA// SPLASH DATA
