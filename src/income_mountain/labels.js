gapminder.viz.income_mountain.labels = function labels(properties) {
    "use strict";
    
    var labels_div = {};
    var geo = [];
    var on_click_callback = function() {};
    
    var init = function init(properties) {
        labels_div = d3.select(properties.div)
            .append("div")
            .style("width", "200px")
            .style("height", "300px")
            .style("position", "absolute")
            .attr("id", "labels");

        geo = properties.geo;
    };
    
    var show = function show() {
        var length = geo.length;

        for (var i = 0; i < length; i++) {
            var text = labels_div.append("text")
                .html(geo[i]);

            text.append("div")
                .style("display", "inline-block")
                .style("width", "10px")
                .style("height", "10px")
                .style("background-color", "blue")
                .style("color", "white")
                .style("font-size", "10px")
                .on("click", function() { on_click(geo[i]); });

            text.append("text")
                .html("<br>");
        }
    };

    var hide = function hide() {

    };

    var clear = function clear() {
        labels_div.selectAll("div").remove();
        labels_div.selectAll("text").remove();
    };
    
    var update = function update(geo_list) {
        geo = geo_list;
        clear();
        show();
    };
    
    var on_click = function on_click(content) {
        on_click_callback(content);
    };
    
    var set_on_click = function set_on_click(callback) {
        if (typeof callback === "function") {
            on_click_callback = callback;
        }
    };
    
    var debug = function() {
        console.log(labels_div);
    };
    
    init(properties);
    debug();
    show();
    
    return {
        debug: debug,
        show: show,
        hide: hide,
        update: update,
        set_on_click: set_on_click
    };
};
