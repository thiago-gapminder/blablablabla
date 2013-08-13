var gapminder = {
    data_manager: {},
    viz: {},
    tools: {},
    graphics: {}
};

gapminder.debug = false;

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
    var timeline_x = {};
    var init = function init(properties) {
        ts_div = d3.select(properties.div);
        ts_svg = ts_div.append("svg").attr("height", ts_div.attr("height")).attr("width", ts_div.attr("width"));
        time.start = +properties.start || time.start;
        time.end = +properties.end || time.end;
        time.current = +properties.current || time.start;
        timeline_x = d3.time.scale().range([ 60, 250 ]).domain([ new Date(time.start, 0), new Date(time.end, 0) ]).clamp(true);
        timeline();
        play_button();
        pause_button();
        moveable_button();
        year_text();
    };
    var timeline = function timeline() {
        var parse_time = d3.time.format("%Y").parse;
        var time_values = [ new Date(time.start, 0), new Date(time.start + (time.end - time.start) / 2, 0), new Date(time.end, 0) ];
        var xAxis = d3.svg.axis().scale(timeline_x).tickValues(time_values).tickSize(15, 0, 2).tickPadding(11).tickSubdivide(1).tickFormat(function(d) {
            return d.getFullYear();
        });
        ts_svg.append("g").attr("class", "timeline").attr("transform", "translate(0,40)").call(xAxis);
    };
    var play_button = function play_button() {
        var button = ts_svg.append("g").attr("class", "play_button");
        button.append("circle").attr("r", 18.032).attr("cx", 19.032).attr("cy", 19.032);
        button.append("path").attr("d", gapminder.graphics.time_slider.play_triangle);
        button.attr("transform", "translate(0, 18)").attr("visibility", "visible");
        buttons.play_button = button;
    };
    var pause_button = function pause_button() {
        var button = ts_svg.append("g").attr("class", "pause_button");
        button.append("circle").attr("r", 18.032).attr("cx", 19.032).attr("cy", 19.032);
        button.append("path").attr("d", gapminder.graphics.time_slider.pause_bar1);
        button.append("path").attr("d", gapminder.graphics.time_slider.pause_bar2);
        button.attr("transform", "translate(0, 18)").attr("visibility", "hidden");
        buttons.pause_button = button;
    };
    var moveable_button = function moveable_button() {
        var button = ts_svg.append("g").attr("class", "moveable_button");
        button.append("path").attr("stroke-miterlimit", 10).attr("d", gapminder.graphics.time_slider.move_button);
        button.append("rect").attr("x", 8.146993).attr("y", 9.002818).attr("width", 2.985586).attr("height", 12.574781);
        button.append("rect").attr("x", 12.77933).attr("y", 9.002818).attr("width", 2.985586).attr("height", 12.574781);
        button.attr("transform", "translate(48, 25)");
        buttons.moveable_button = button;
    };
    var year_text = function year_text() {
        var text = ts_svg.selectAll(".time_slider_year").data([ time.current ], function(d) {
            return d;
        });
        text.enter().append("text").attr("class", "time_slider_year").attr("x", 155).attr("y", 30).text(function(d) {
            return Math.floor(time.current);
        });
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

gapminder.graphics.time_slider = {
    move_button: "m22.881718,10.764284c-0.475458,-5.471561 -5.19836,-9.764284 -10.792168,-9.764284c-5.605913,0 -10.58994,4.309327 -11.048798,9.799001c-0.040752,0.315464 0.006039,0.636966 0.006039,0.964504l0,8.97638c0,4.928179 5.512316,10.285027 10.857103,14.280397c4.802883,-3.368973 11.000465,-9.352219 11.000465,-14.280397l0,-8.97638c0,-0.338104 0.02264,-0.670172 -0.022642,-0.999221z",
    play_triangle: "m16.104044,9.928802c-0.298447,-0.136328 -0.72585,-0.38319 -1.063597,-0.394244c-0.729534,0.046671 -1.408713,0.637422 -1.408713,1.375551l0,16.248697c0,0.731989 0.670582,1.316599 1.390289,1.36941c0.346345,-0.006142 0.693916,-0.20756 1.007102,-0.40284l13.194235,-8.11084c0.622681,-0.404068 0.655842,-1.509418 0.01351,-1.968756l-13.132826,-8.116979z",
    pause_bar1: "m17.071117,27.009705c0,0.817007 -0.661329,1.479578 -1.47958,1.479578l-1.728666,0c-0.818252,0 -1.479578,-0.662571 -1.479578,-1.479578l0,-15.991412c0,-0.817004 0.661326,-1.479578 1.479578,-1.479578l1.728666,0c0.817009,0 1.47958,0.662574 1.47958,1.479578l0,15.991412z",
    pause_bar2: "m25.644701,27.009705c0,0.817007 -0.662569,1.479578 -1.479576,1.479578l-1.728666,0c-0.818253,0 -1.47958,-0.662571 -1.47958,-1.479578l0,-15.991412c0,-0.817004 0.660082,-1.479578 1.47958,-1.479578l1.728666,0c0.817007,0 1.479576,0.662574 1.479576,1.479578l0,15.991412z"
};

gapminder.tools.time_slider = function time_slider(properties) {
    "use strict";
    var settings = {
        height: 80,
        width: 270,
        play_interval: 10,
        time_slash: .1,
        time_precision: 5,
        playing: false,
        sliding: false
    };
    var interval;
    var time_slider_viz = {};
    var buttons = {};
    var time = {};
    var init = function init(properties) {
        time_slider_viz = gapminder.viz.time_slider(properties);
        buttons = time_slider_viz.buttons;
        time = time_slider_viz.time;
        on_play();
        on_stop();
        on_slide();
    };
    var toggle = function toggle(button) {
        if (button.attr("visibility") === "hidden") {
            button.attr("visibility", "visible");
        } else {
            button.attr("visibility", "hidden");
        }
    };
    var slide_moveable_button = function move_moveable_button() {
        var timeline_movement = d3.scale.linear().range([ 0, 190 ]).domain([ 60, 250 ]).clamp(true);
        var timeline_year_reference = d3.scale.linear().range([ time.start, time.end ]).domain([ 60, 250 ]).clamp(true);
        buttons.moveable_button.attr("transform", "translate(" + (-12 + time_slider_viz.timeline_x(new Date(time.current, 0))) + ", 25)");
    };
    var set_time_slash = function set_time_slash(new_time_slash) {
        settings.time_slash = +new_time_slash;
        if (settings.time_slash < 1) {
            settings.time_precision = 4 + (settings.time_slash % 1).toString().length - 2;
        } else {
            settings.time_precision = 4 + settings.time_slash % 1 === 0 ? +settings.time_slash.toString().length : settings.time_slash.toString().length - 1;
        }
    };
    var play = function play(callback) {
        if (settings.playing) {
            if (time.current + settings.time_slash <= time.end) {
                time.current += settings.time_slash;
                time.current = +time.current.toPrecision(settings.time_precision);
            }
            time_slider_viz.update();
            slide_moveable_button();
        } else {
            toggle(buttons.play_button);
            toggle(buttons.pause_button);
            clearInterval(interval);
        }
        if (typeof callback === "function") {
            callback(time.current);
        }
    };
    var on_play = function on_play(callback) {
        buttons.play_button.on("mouseup", function() {
            settings.playing = true;
            toggle(buttons.play_button);
            toggle(buttons.pause_button);
            interval = setInterval(play, settings.play_interval, callback);
        });
    };
    var on_stop = function on_stop(callback) {
        buttons.pause_button.on("mouseup", function() {
            settings.playing = false;
            toggle(buttons.play_button);
            toggle(buttons.pause_button);
            clearInterval(interval);
            if (typeof callback === "function") {
                callback(time.current);
            }
        });
    };
    var on_slide = function on_slide(callback) {
        var timeline_movement = d3.scale.linear().range([ 0, 190 ]).domain([ 60, 250 ]).clamp(true);
        var timeline_year_reference = d3.scale.linear().range([ time.start, time.end ]).domain([ 60, 250 ]).clamp(true);
        buttons.moveable_button.on("mousedown", function() {
            settings.sliding = true;
        });
        window.addEventListener("mousemove", function() {
            if (settings.sliding) {
                if (settings.playing) {
                    settings.playing = false;
                }
                buttons.moveable_button.attr("transform", "translate(" + (48 + timeline_movement(event.pageX)) + ", 25)");
                time.current = time_slider_viz.timeline_x.invert(60 + timeline_movement(event.pageX)).getFullYear();
                console.log(buttons.moveable_button.clientLeft);
                time_slider_viz.update();
                if (typeof callback === "function") {
                    callback(time.current);
                }
            }
        });
        window.addEventListener("mouseup", function() {
            settings.sliding = false;
        });
    };
    init(properties);
    var debug = function() {
        console.log(settings);
    };
    return {
        time: time,
        set_time_slash: set_time_slash,
        on_play: on_play,
        on_stop: on_stop,
        on_slide: on_slide,
        debug: debug
    };
};

gapminder.data_manager.income_mountain = function dm_income_mountain(properties) {
    "use strict";
    var income_mountain_data = {};
    var path = "data/";
    var extension = ".csv";
    var load_csv = function load_csv(geo, callback) {
        d3.csv(path + geo + extension, function(csv_data) {
            if (typeof callback === "function") {
                callback(csv_data);
            }
        });
    };
    var load = function load(geo_list, callback) {
        var data_box = {};
        for (var i = 0; i < geo_list.length; i++) {
            if (!income_mountain_data[geo_list[i]]) {
                (function(geo) {
                    load_csv(geo, function(csv_data) {
                        income_mountain_data[geo] = nest(csv_data);
                        data_box[geo] = income_mountain_data[geo];
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
    var nest = function nest(data) {
        var geo_max_height = 0;
        var data_stick = d3.nest().key(function(d) {
            return d.year;
        }).rollup(function(d) {
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
        }).map(data);
        data_stick.geo_max_height = geo_max_height;
        return data_stick;
    };
    return {
        load: load
    };
};

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
        if (containing_div.empty()) {
            console.error("You should pass a valid div id!");
            return;
        }
        height = Number(properties.height) || height;
        width = Number(properties.width) || width;
        mountain_svg = containing_div.append("svg").attr("class", "mountains").attr("height", height).attr("width", width);
    };
    var show = function show(mountain_info) {
        if (!mountain_info || !mountain_info.data) {
            return;
        }
        var name = mountain_info.name || (Math.random() * 1e3).toString;
        var color = mountain_info.color || "orange";
        var data = mountain_info.data;
        var shape = mountain_svg.append("g").attr("id", name + "-income-mountain").selectAll("path").data(mountain_info.data);
        shape.enter().append("path").attr("fill", color).attr("d", area);
    };
    var clear = function clear() {
        mountain_svg.selectAll("g").remove();
    };
    var area = function area(points) {
        return d3.svg.area().interpolate("basis").x(function(d) {
            return x_position(Math.exp(d.x));
        }).y0(function(d) {
            return height - d.y0;
        }).y1(function(d) {
            return height - (d.y0 + d.y);
        })(points);
    };
    var x_position = function xpos(value) {
        return d3.scale.log().domain([ 182.5, 152e3 ]).range([ 10, width - 10 ]).clamp(true)(value);
    };
    init(properties);
    return {
        show: show,
        clear: clear
    };
};

gapminder.viz.income_mountain.labels = function labels(properties) {
    "use strict";
    var labels_div = {};
    var geo = [];
    var on_click_callback = function() {};
    var init = function init(properties) {
        labels_div = d3.select(properties.div).append("div").style("width", "200px").style("height", "300px").style("position", "absolute").attr("id", "labels");
        geo = properties.geo;
    };
    var show = function show() {
        var length = geo.length;
        for (var i = 0; i < length; i++) {
            var text = labels_div.append("text").html(geo[i]);
            text.append("div").style("display", "inline-block").style("width", "10px").style("height", "10px").style("background-color", "blue").style("color", "white").style("font-size", "10px").on("click", function() {
                on_click(geo[i]);
            });
            text.append("text").html("<br>");
        }
    };
    var hide = function hide() {};
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

gapminder.income_mountain = function income_mountain(properties) {
    "use strict";
    var that = this;
    var active_data = {};
    var draw_data = [];
    var ready = false;
    var state = {
        command_queue: [],
        maximum_height: 0,
        first_year: 1820,
        final_year: 2010,
        year: 1820,
        active_geo: [],
        height: 500,
        width: 900,
        stacked: false,
        play: false
    };
    var mountain = {};
    var data_manager = {};
    var time_slider = {};
    var labels = {};
    var init = function init(properties) {
        state.first_year = properties.start_year || state.first_year;
        state.final_year = properties.final_year || state.final_year;
        state.year = properties.year || state.year;
        state.width = properties.width || state.width;
        state.height = properties.height || state.height;
        state.stacked = properties.stack || state.stacked;
        if (typeof properties.geo === "object" && properties.geo.length) {
            state.active_geo = properties.geo;
        } else if (typeof properties.geo === "string") {
            state.active_geo = properties.geo.split(",");
        }
        remove_duplicates();
        labels = gapminder.viz.income_mountain.labels({
            div: properties.div,
            geo: state.active_geo
        });
        console.log(labels.on_click);
        labels.set_on_click(function(content) {
            alert(content);
        });
        mountain = gapminder.viz.income_mountain({
            div: properties.div,
            width: state.width,
            height: state.height
        });
        data_manager = gapminder.data_manager.income_mountain();
        var ij = Math.random().toPrecision(3) * 1e3;
        d3.select(properties.div).append("div").attr("id", "time-slider" + ij).style("width", "270px").style("height", "80px");
        time_slider = gapminder.tools.time_slider({
            div: "#time-slider" + ij,
            start: state.first_year,
            end: state.final_year
        });
        time_slider.on_play(function(time_slider_year) {
            state.year = time_slider_year;
            draw();
        });
        time_slider.on_stop(function(time_slider_year) {
            state.year = time_slider_year;
            draw();
        });
        time_slider.on_slide(function(time_slider_year) {
            state.year = time_slider_year;
            draw();
        });
        var geos_to_load = state.active_geo.length;
        active_data = data_manager.load(state.active_geo, function() {
            geos_to_load -= 1;
            if (geos_to_load === 0) {
                ready = true;
                draw();
                dequeue();
            }
        });
    };
    var add_geo = function add_geo(geo_id) {
        if (state.active_geo.indexOf(geo_id) === -1) {
            ready = false;
            state.active_geo.push(geo_id);
            active_data = data_manager.load(state.active_geo, function() {
                ready = true;
                draw();
                labels.update(state.active_geo);
                dequeue();
            });
        }
    };
    var remove_geo = function remove_geo(geo_id, callback) {
        state.active_geo.splice(state.active_geo.indexOf(geo_id), 1);
        if (typeof callback === "function") {
            callback();
        }
    };
    var remove_duplicates = function remove_duplicates() {
        state.active_geo = state.active_geo.filter(function(e, pos, self) {
            return self.indexOf(e) == pos;
        });
    };
    var draw = function draw() {
        if (ready) {
            get_year();
            calculate_max_height();
            mountain.clear();
            for (var i = 0; i < draw_data.length; i++) {
                fix_mountain_height(draw_data[i].data);
                mountain.show({
                    name: draw_data[i].name,
                    data: [ draw_data[i].data ],
                    color: draw_data[i].color
                });
            }
        }
    };
    var stack = function stack() {
        return d3.layout.stack().offset("zero").values(function(d) {
            return d;
        }).x(function(d) {
            return d.x;
        }).y(function(d) {
            return d.y;
        });
    };
    var get_year = function filter_year() {
        var data = [];
        var year = Math.floor(state.year);
        for (var i = 0; i < state.active_geo.length; i++) {
            var geo = state.active_geo[i];
            if (active_data[geo] && active_data[geo][year]) {
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
            data[i].y = state.height / state.maximum_height * data[i].y;
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
    var transition = function transition(geo, current_data) {
        var future_year = Math.ceil(state.year);
        var factor = state.year % 1;
        if (active_data[geo][future_year]) {
            var future_data = active_data[geo][future_year];
            for (var i = 0; i < current_data.length; i++) {
                var difference = future_data[i].height - current_data[i].height;
                current_data[i].y = current_data[i].height + difference * factor;
            }
        }
    };
    var dequeue = function dequeue() {
        for (var i = 0; i < state.command_queue.length; i++) {
            state.command_queue[i]();
            state.command_queue.unshift();
        }
    };
    var update = function update(year, callback) {
        if (!ready) {
            state.command_queue.push(wrap_function(update, this, [ year, callback ]));
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
        };
    };
    init(properties);
    return {
        add: add_geo,
        remove: remove_geo,
        update: update,
        draw: draw
    };
};