gapminder.data_manager.income_mountain = function dm_income_mountain() {
    "use strict";

    var income_mountain_data = {};
    
    var path = "data/";
    var extension = ".csv";
    
    var load = function load(geo_id, year, callback) {
        if (income_mountain_data[geo_id] && income_mountain_data[geo_id][year]) {
            return income_mountain_data[geo_id][year];
        } else if (!income_mountain_data[geo_id]) {
            d3.csv(path + geo_id + extension, function(data) {
                income_mountain_data[geo_id] = nest(data);                
                if (typeof callback === "function") {
                    callback(income_mountain_data[geo_id][year]);
                }
                console.log(income_mountain_data);
            });
        } else if (!income_mountain_data[geo_id][year]) {
            return [];
        }

        return undefined;
    };
    
    var get = function get_year(geo_id, year, callback) {
        return load(geo_id, year, callback);
    };
    
    var get_full_data = function get_full() {
        return income_mountain_data;
    };

    // Groups 'data' by year and creates the properties 'x', 'y' and 'y0' for
    // each drawable point. These properties are used for calculation of the
    // curve. Returns a data stick with the nested data.
    var nest = function nest(data) {
        var geo_max_height = 0;

        var data_stick = d3.nest()
            .key(function(d) {
                return d.year;
            })
            .rollup(function(d) {
                var year_data = [];
                var year_max_height = 0;
                
                d.forEach(function(d) {
                    year_max_height = Math.max(year_max_height, d.height);
                    
                    year_data.push({
                        height: d.height,
                        x: d.x,
                        y: d.height,
                        y0: 0
                    });
                });
                
                year_data.year_max_height = year_max_height;
                geo_max_height = Math.max(geo_max_height, year_max_height);

                return year_data;
            })
            .map(data);
        
        data_stick.geo_max_height = geo_max_height;
        
        console.log(data_stick);
        
        return data_stick;
    };
    
    var adjust_height = function adjust() {
        // fix height
        var max_height = max_current_height();
        
        console.log(max_height);
        
        for (var i = 0; i < active_data.length; i++) {
            console.log(i);
            for (var j = 0; j < active_data[i].length; j++) {
                console.log(j, active_data[i][j]);
                active_data[i][j].y = scale_height(active_data[i][j].height, max_height);
            }
        }
    };
    
    var scale_height = function scale_height(y, max_height) {
        return viz_state.height * (y / max_height);
    };
    
    var max_current_height = function max_height() {
        var max_height = 0;

        if (viz_state.stacked) {
            if (active_data.length) {
                var last_geo = active_data.length - 1;

                for (var j = 0; j < active_data[last_geo]; j++) {
                    max_height = Math.max(max_height, active_data[last_geo][j].y);
                }
            }
        } else {
            for (var i = 0; i < active_data.length; i++) {
                for (var j = 0; j < active_data[i].length; j++) {
                    max_height = Math.max(max_height, active_data[i][j].y);
                }
            }
        }
        
        return max_height;
    };
    
    // Send it a list and it returns just what needs to be visualized
    var consume = function consume(properties) {
        var data = [];
        
        var geo_list = properties.geo_list;
        var year = properties.year;
        var callback = properties.callback;
        
        for (var i = 0; i < geo_list.length; geo_list++) {
            load(geo_list, year, callback);
        }

        return data;
    };
    
    return {
        load: load,
        get: get,
        get_all: get_full_data
    };
};
