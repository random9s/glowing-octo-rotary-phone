var vertexShaderSrcCode = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main()',
    '{',
    ' fragColor = vertColor;',
    ' gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
].join('\n');

var fragmentShaderSrcCode = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    ' gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');

const addVertexShader = (gl, program, src) => {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    compileShader(gl, vertexShader, src);
    attachShader(gl, program, vertexShader);
    return vertexShader;
};

const addFragmentShader = (gl, program, src) => {
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    compileShader(gl, fragmentShader, src);
    attachShader(gl, program, fragmentShader);
    return fragmentShader;
};

const compileShader = (gl, shader, src) => {
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('could not compile shader: ', gl.getShaderInfoLog(shader));
        return
    }
};

const attachShader = (gl, program, shader) => {
    gl.attachShader(program, shader);
};

const linkProgram = (gl, program) => {
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('could not link program: ', gl.getProgramInfoLog(program));
        return;
    }
};

var InitDemo = function() {

    //initialize gl
    var canvas = document.getElementById('gl-surface');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log ('webgl is not supported, falling back to experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) throw 'your browser does not support web gl';

    //Set background color
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    // CREATE PROGRAM
    //
    var program = gl.createProgram();
    addVertexShader(gl, program, vertexShaderSrcCode);
    addFragmentShader(gl, program, fragmentShaderSrcCode);
    linkProgram(gl, program);

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('could not validate program', gl.getProgramInfoLog(program));
        return;
    }

    //
    // CREATE BUFFER
    //
    var triangleVertices = [
        //X , Y,       R , G , B
        0.0, 0.5,      1.0, 1.0, 0.0,
        -0.5, -0.5,    0.7, 0.0, 1.0,
        0.5, -0.5,     0.1, 1.0, 0.6
    ];

    var triangleVertexBufferObj = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObj);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // number of elements per attribute
        gl.FLOAT, // element type
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
        0 // offset from beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // number of elements per attribute
        gl.FLOAT, // element type
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // offset from beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    // MAIN RENDER LOOP
    //
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
