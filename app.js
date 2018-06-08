(function (w, d) {
    "use strict";

    var _evListen = w.addEventListener;
    var _evDispatch = w.dispatchEvent;
    var app = app || {
        on: _evListen.bind(w),
        trigger: _evDispatch.bind(w),
        context: function() {
            return this.gl;
        },
        canvas: {},
        gl: {}
    };

    //
    // Checks for a canvas element, then initializes WebGL, and finally, dispatches a custom init event
    //     Throws if:
    //      - no canvas element exists on HTML page
    //      - webgl is not supported by the browser
    //
    const init = ev => {
        //remove event listener to prevent this from running multiple times
        w.removeEventListener(ev.type, init, false);

        //locate canvas element
        var canvas = d.querySelector('canvas');
        if (!canvas) throw 'no canvas element was detected';

        //initialize web gl
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) throw 'webgl is not supported';

        app.canvas = canvas;
        app.gl = gl;

        //create & trigger event
        var ev = new CustomEvent('initgl');
        app.trigger(ev);
    };

    app.on('load', init, false);
    w.app = app;
})(window, document);
