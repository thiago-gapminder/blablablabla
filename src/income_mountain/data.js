gapminder.data_manager.income_mountain = function dm_income_mountain(properties) {
    "use strict";

    var income_mountain_data = {};

    var path = "data/";
    var extension = ".csv";

    // Loads csv with data for the Income Mountain
    var load_csv = function load_csv(geo, callback) {
        d3.csv(path + geo + extension, function(csv_data) {
            if (typeof callback === "function") {
                callback(csv_data);
            }
        });
    };

    // Loads a list of 'geo' locations. The geos that have not been cached
    // are loaded asynchronously and accessible to the returning object
    // once they are completely loaded.
    var load = function load(geo_list, callback) {
        var data_box = {};

        for (var i = 0; i < geo_list.length; i++) {
            if (!income_mountain_data[geo_list[i]]) {
                (function(geo) {
                    load_csv(geo, function(csv_data) {
                        // Store the loaded data
                        income_mountain_data[geo] = nest(csv_data);
                        data_box[geo] = income_mountain_data[geo];
                        
                        // Run any supplied callback function
                        if (typeof callback === "function") {
                            callback(csv_data, i);
                        }
                    });
                })(geo_list[i]);
            } else {
                data_box[geo_list[i]] = income_mountain_data[geo_list[i]];
            }
        }

        return data_box;
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
                
                d.forEach(function(p) {
                    year_max_height = Math.max(year_max_height, p.height);
                    
                    year_data.push({
                        height: Number(p.height),
                        x: Number(p.x),
                        y: Number(p.height),
                        y0: 0
                    });
                });
                
                year_data.year_max_height = year_max_height;
                geo_max_height = Math.max(geo_max_height, year_max_height);

                return year_data;
            })
            .map(data);
        
        data_stick.geo_max_height = geo_max_height;
        
        return data_stick;
    };

    return {
        load: load
    };
};
