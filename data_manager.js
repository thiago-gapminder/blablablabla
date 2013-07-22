var data_manager = function() {
    "use strict";
    
    var income_mountain = {};
    
    income_mountain.data = {};
    
    income_mountain.year = 1820;    // Starting year
    
    income_mountain.load_geo = function(geo_id) {
        d3.csv("data/incMountain/" + geo_id + ".csv", function(response) {
            
        });
    };
    
    income_mountain.update = function(year, geo_list) {
        var active_data = [];
        
        for (var i = 0; i < geo_list.length; i++) {
            if (!income_mountain.data.hasOwnProperty(geo_list[i])) {
                income_mountain.data[geo_list[i]] = { ready: false };
                income_mountain.load_geo(geo_list[i]);
            }
            
            active_data.push(income_mountain.data[geo_list[i]]);
        }
        
        return active_data;
    };
    
    return {
        income_mountain: {
            load_geo: income_mountain.load_geo,
            update: income_mountain.update
        }
    };
};
