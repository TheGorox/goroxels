export function createWebGLProgram(canvas, vertexSrc, fragmentSrc) {
    let gl;
    if(canvas instanceof WebGLRenderingContext){
        gl = canvas;
    }else{
        gl = canvas.getContext('webgl');
        if (!gl) throw new Error("WebGL is not supported");
    }

    function compileShader(type, src) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            throw new Error("Shader compilation error");
        }
        return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vertexSrc);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        throw new Error("GL linking error");
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    return { gl, program };
}

export function createTexture(gl, sourceCanvas) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                  gl.UNSIGNED_BYTE, sourceCanvas);

    return texture;
}
const defaultVertexShader = `
        attribute vec2 a_position;
        varying vec2 v_texCoord;
        void main() {
            v_texCoord = (a_position + 1.0) * 0.5;
            // for some reason Y is inverted by default
            v_texCoord.y = 1.0 - v_texCoord.y;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
        `
export function generateShader(canvas, fragmentShader, needCreateTexture=true) {
    const { gl, program } = createWebGLProgram(canvas, defaultVertexShader, fragmentShader);

    let texture;
    if(needCreateTexture){
        texture = createTexture(gl, canvas);
    }

    gl.useProgram(program);

    return { gl, program, texture };
}