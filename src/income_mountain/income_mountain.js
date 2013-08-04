gapminder.income_mountain = function income_mountain(properties) {
    "use strict";   // remove before final?
    
    var that = this;
    
    var active_data = [];
    
    var play_flag = true;

    var viz_state = {
        first_year: 1820,
        final_year: 2010,
        year: 1820,
        active_geo: [],
        height: 500,
        width: 900,
        stacked: false
    };
    
    var mountain = {};
    var data_manager = {};
    
    var init = function init(properties) {
        viz_state.first_year = properties.start_year || viz_state.first_year;
        viz_state.final_year = properties.final_year || viz_state.final_year;
        viz_state.year = properties.year || viz_state.year;
        viz_state.width = properties.width || viz_state.width;
        viz_state.height = properties.height || viz_state.height;
        viz_state.stacked = properties.stack || viz_state.stacked;
        
        // We accept an array or a string for the active geos.
        if (typeof properties.geo === "object") {
            viz_state.active_geo = properties.geo;
        } else if (typeof properties.geo === "string") {
            viz_state.active_geo = [properties.geo];
        }
            
        mountain = gapminder.viz.income_mountain({
            div: properties.div,
            width: viz_state.width,
            height: viz_state.height
        });

        data_manager = gapminder.data_manager.income_mountain();
        
        load_data();
    };
    
    var load_data = function load() {
        for (var i = 0; i < viz_state.active_geo.length; i++) {
            data_manager.load(viz_state.active_geo[i], viz_state.year, function(data) {
                if (gapminder.debug) {
                    active_data.push(data);
                    adjust_height();
                }
            });
        }
    };
    
    var draw = function draw() {
        data_manager.consume({
            geo: viz_state.active_geo,
            year: viz_state.year,
            callback: function(data) {
                mountain.show({
                    name: "Zoropa",
                    data: [data],
                    color: "blue"
                });
            };
        });
    };
    
    var stack = function stack() {
        return d3.layout.stack()
            .offset("zero")
            .values(function(d) { console.log(d); return d; })
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });
    };
    
    // send this to timeslider when that's done. But keep the functions here.
    var play = function play() {
        play_flag = true;

        while (viz_state.year < viz_state.final_year && play_flag) {
            viz_state.year += 1;
            //that.draw();
        }
    };
    
    var stop = function stop() {
        play_flag = false;
    };

    init(properties);
    //draw();

    return {
        play: play,
        stop: stop
    };
};


// How should data be like?
//
// Country > year > points?
// Year > country > points? (Win!)

// Remember to optimize for being able to view all points (max_height property in elements)