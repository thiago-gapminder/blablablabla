gapminder.income_mountain = function income_mountain(properties) {
    "use strict";   // remove before final?
    
    var that = this;
    
    var active_data = {};
    var draw_data = [];
    
    var status = "loading"; // maybe use boolean?

    var state = {
        command_queue: [],
        maximum_height: 0,
        first_year: 1820,
        final_year: 2010,
        year: 1990,
        active_geo: [],
        height: 500,
        width: 900,
        stacked: false,
        play: false
    };
    
    var mountain = {};                  // Visualization object
    var data_manager = {};              // Data manager object
    
    var init = function init(properties) {
        // Overwrites state properties
        state.first_year = properties.start_year || state.first_year;
        state.final_year = properties.final_year || state.final_year;
        state.year = properties.year || state.year;
        state.width = properties.width || state.width;
        state.height = properties.height || state.height;
        state.stacked = properties.stack || state.stacked;
        
        // We accept an ~array~ or a string for the active geos.
        if (typeof properties.geo === "object" && properties.geo.length) {
            state.active_geo = properties.geo;
        } else if (typeof properties.geo === "string") {
            state.active_geo = properties.geo.split(","); // Geos expected to be separated by ','
        }

        // Removes duplicates from active_geo
        remove_duplicates();
        
        // Loads the income mountain visualization
        mountain = gapminder.viz.income_mountain({
            div: properties.div,
            width: state.width,
            height: state.height
        });

        // Loads the income mountain data manager
        data_manager = gapminder.data_manager.income_mountain();

        // Loads and draws data
        var geos_to_load = state.active_geo.length;

        active_data = data_manager.load(state.active_geo, function() {
            geos_to_load -= 1;

            // If this is the last geo to load, draw everything
            if (geos_to_load === 0) {
                status = "success";
                draw();
                dequeue();
            }
        });
    };
    
    // Adds a geo to the list
    var add_geo = function add_geo(geo_id) {
        if (state.active_geo.indexOf(geo_id) === -1) {
            status = "loading";
            state.active_geo.push(geo_id);
            active_data = data_manager.load(state.active_geo, function() {
                status = "success";;
                draw();
                dequeue();
            });
        }
    };
    
    // Removes a geo from the list
    var remove_geo = function remove_geo(geo_id) {
        state.active_geo.splice(state.active_geo.indexOf(geo_id), 1);
    };

    // Removes duplicates from the list of geos
    var remove_duplicates = function remove_duplicates() {
        state.active_geo = state.active_geo.filter(function(e, pos, self) {
            return self.indexOf(e) == pos;
        });
    };

    // Always make sure you have the data already, otherwise draws nothing!
    var draw = function draw() {
        get_year();
        calculate_max_height();
        
        mountain.clear();   // remove any old paths
        
        for (var i = 0; i < draw_data.length; i++) {
            fix_mountain_height(draw_data[i].data);

            mountain.show({
                name: draw_data[i].name,
                data: [draw_data[i].data],
                color: draw_data[i].color
            });
        }
    };

    // To be called when the income mountain is supposed to stacked
    var stack = function stack() {
        return d3.layout.stack()
            .offset("zero")
            .values(function(d) { return d; })
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });
    };

    var get_year = function filter_year() {
        var data = [];
        var year = Math.floor(state.year);
        
        for (var i = 0; i < state.active_geo.length; i++) {
            var geo = state.active_geo[i];
            
            if (active_data[geo] && active_data[geo][year]) {
                // Linearly adjusts points according to year
                transition(geo, active_data[geo][year]);

                data.push({
                    name: geo,
                    data: active_data[geo][year],
                    color: "blue",
                    geo_max_height: active_data[geo].geo_max_height
                });
            }
        }

        draw_data = data;
    };

    var fix_mountain_height = function fix_height(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].y = (state.height / state.maximum_height) * data[i].y;
        }
    };

    var calculate_max_height = function calc_max_height() {
        state.maximum_height = 0;
        
        for (var geo in active_data) {
            if (active_data.hasOwnProperty(geo)) {
                state.maximum_height = Math.max(state.maximum_height, active_data[geo].geo_max_height);
            }
        }
    };
    
    // Adjust the data, giving it a 'transition' effect when showing data
    // between years. Data is increased linearly from year Y to year Y+1.
    var transition = function transition(geo, current_data) {
        var future_year = Math.ceil(state.year);
        var factor = state.year % 1;
        
        if (future_year !== state.year && active_data[geo][future_year]) {
            var future_data = active_data[geo][future_year];

            for (var i = 0; i < current_data.length; i++) {
                var difference = future_data[i].height - current_data[i].height;
                current_data[i].y = current_data[i].height + (difference * factor);
            }
        }
    };

    // Clears the command queue and executes every command issued while
    // the visualization was still loading.
    var dequeue = function dequeue() {
        for (var i = 0; i < state.command_queue.length; i++) {
            state.command_queue[i]();
            state.command_queue.unshift();
        }
    };

    // send this to timeslider when that's done. But keep the function here.
    // Should be called using setInterval
    var play = function play() {
        if (status === "loading") {
            state.command_queue.push(play);
            return;
        }

        if (state.play && state.year <= state.final_year) {
            draw();
            state.year += 0.1;
            state.year = parseFloat(state.year.toPrecision(5));
        } else {
            state.play = false;
        }
    };

    var stop = function stop() {
        if (status === "loading") {
            state.command_queue.push(stop);
            return;
        }
        
        state.play = false;
    };
    
    var update = function update(year, callback, params) {
        if (status === "loading") {
            state.command_queue.push(wrap_function(update, this, [year, callback]));
            return;
        }

        if (year >= state.first_year && year <= state.final_year) {
            state.year = year;
            if (typeof callback === "function") {
                callback();
            }
        }
    };
    
    var wrap_function = function wrap(func, context, params) {
        return function() {
            func.apply(context, params);
        }
    };

    init(properties);

    return {
        add: add_geo,
        remove: remove_geo,
        update: update,
        play: play,
        stop: stop
    };
};


// things to do:
//   Remember to optimize - be able to view all countries (max_height property in elements)
//   y pos on viz? (like x pos)
//   rename vars
//   solve for stack
