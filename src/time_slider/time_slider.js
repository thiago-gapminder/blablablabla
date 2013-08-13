gapminder.tools.time_slider = function time_slider(properties) {
    "use strict";
    
    var settings = {
        height: 80,
        width: 270,
        play_interval: 10,
        time_slash: 0.1,
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

        // Get buttons and time information from the time_slider
        buttons = time_slider_viz.buttons;
        time = time_slider_viz.time;
        
        // Mouse bindings
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
        var timeline_movement = d3.scale.linear()
            .range([0, 190])
            .domain([60, 250])
            .clamp(true);
        
        var timeline_year_reference = d3.scale.linear()
            .range([time.start, time.end])
            .domain([60, 250])
            .clamp(true);

        buttons.moveable_button.attr("transform", "translate(" + (-12 + time_slider_viz.timeline_x(new Date(time.current, 0))) + ", 25)");
    };
    
    // FIX PRECISION TO ALLOW *ANY* NUMBER
    var set_time_slash = function set_time_slash(new_time_slash) {
        settings.time_slash = +new_time_slash;

        // only positive accepted right now...
        if (settings.time_slash < 1) {
            settings.time_precision = 4 + (settings.time_slash % 1).toString().length - 2; // have to remove 0 and .
        } else {
            settings.time_precision = 4 + (settings.time_slash % 1) === 0 ? + settings.time_slash.toString().length : settings.time_slash.toString().length - 1; // only remove dot when there is decimals!
        }
    };
    
    // Allow decreasing time soon!
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
        var timeline_movement = d3.scale.linear()
            .range([0, 190])
            .domain([60, 250])
            .clamp(true);
        
        var timeline_year_reference = d3.scale.linear()
            .range([time.start, time.end])
            .domain([60, 250])
            .clamp(true);

        // Bind clicks locally
        buttons.moveable_button.on("mousedown", function() { settings.sliding = true; });
        
        // Binds the mouse movement and release globally
        window.addEventListener("mousemove", function() {
            if (settings.sliding) { 
                if (settings.playing) {
                    settings.playing = false;
                }

                buttons.moveable_button.attr("transform", "translate(" + (48 + timeline_movement(event.pageX)) + ", 25)");
                time.current = time_slider_viz.timeline_x.invert(60 + timeline_movement(event.pageX)).getFullYear();
                console.log(buttons.moveable_button.clientLeft);
                time_slider_viz.update();
                //console.log(timeline_year_reference((60 + timeline_movement(event.pageX))).toPrecision(time_precision));
                
                if (typeof callback === "function") {
                    callback(time.current);
                }
            }
        });

        window.addEventListener("mouseup", function() { settings.sliding = false; });  
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

// A function to move everything with transform? (with all transforms that is)
