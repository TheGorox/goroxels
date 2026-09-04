const MAX_LAYER = 4;

const DEFAULT_VS = `#version 300 es
    in vec2 a_position;
    
    uniform vec4 u_rect;
    uniform vec2 u_resolution;
    
    out vec2 v_texCoord;
    
    void main() {
        v_texCoord = (a_position + 1.0) * 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y;

        if (u_rect.z == 0.0 || u_rect.w == 0.0) {
            gl_Position = vec4(a_position, 0.0, 1.0);
        } else {
            vec2 zeroToOne = (a_position + 1.0) * 0.5;
            zeroToOne.y = 1.0 - zeroToOne.y;

            vec2 pixelPos = zeroToOne * u_rect.zw;
            pixelPos += u_rect.xy;

            vec2 clipSpace = (pixelPos / u_resolution) * 2.0 - 1.0;
            clipSpace.y = -clipSpace.y; 

            gl_Position = vec4(clipSpace, 0.0, 1.0);
        }
    }
`;

export class WebGLShaderEffect {
    id;
    program;
    gl;
    vao;
    #uniformsCache = new Map();

    params = $state({});

    constructor(gl, id, fragmentSrc, quadBuffer, initialParams = {}) {
        this.gl = gl;
        this.id = id;
        this.params = initialParams;

        this.#compile(fragmentSrc, quadBuffer);
        this.#cacheUniforms();
    }

    #compile(fragmentSrc, quadBuffer) {
        const gl = this.gl;

        let finalFs = fragmentSrc;

        if (!fragmentSrc.includes('#version')) {
            console.error('You\'re using old (WebGL1) shader code! It will not compile correctly.');
            throw new Error('WebGLShaderEffect requires WebGL2 shader code with #version 300 es');
        }

        const vs = this.#compileShader(gl.VERTEX_SHADER, DEFAULT_VS);
        const fs = this.#compileShader(gl.FRAGMENT_SHADER, finalFs);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error(`[WebGLFX] Link error (${this.id}): ${gl.getProgramInfoLog(this.program)}`);
        }

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        const posLoc = gl.getAttribLocation(this.program, "a_position");
        if (posLoc !== -1) {
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        }

        gl.bindVertexArray(null);
    }

    #compileShader(type, src) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`[WebGLFX] Compile error (${this.id}): ${gl.getShaderInfoLog(shader)}`);
        }
        return shader;
    }

    #cacheUniforms() {
        const gl = this.gl;
        const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const info = gl.getActiveUniform(this.program, i);
            const loc = gl.getUniformLocation(this.program, info.name);
            this.#uniformsCache.set(info.name, { loc, type: info.type });
        }
    }

    applyUniforms() {
        const gl = this.gl;
        let textureUnit = 0;

        for (const [name, info] of this.#uniformsCache.entries()) {
            const value = this.params[name];
            if (value === undefined) continue;

            const loc = info.loc;

            if (info.type === gl.FLOAT) {
                gl.uniform1f(loc, value);
            } else if (info.type === gl.FLOAT_VEC2) {
                gl.uniform2f(loc, value[0], value[1]);
            } else if (info.type === gl.FLOAT_VEC3) {
                gl.uniform3f(loc, value[0], value[1], value[2]);
            } else if (info.type === gl.FLOAT_VEC4) {
                gl.uniform4f(loc, value[0], value[1], value[2], value[3]);
            } else if (info.type === gl.SAMPLER_2D) {
                gl.activeTexture(gl.TEXTURE0 + textureUnit);
                gl.bindTexture(gl.TEXTURE_2D, value);
                gl.uniform1i(loc, textureUnit);
                textureUnit++;
            }
        }
    }
}

export class WebGLFxRenderer {
    #canvas;
    #gl;
    #core;
    #layers = $state(Array.from({ length: MAX_LAYER + 1 }, () => []));
    #quadBuffer;
    #rafId = null;
    #isRunning = false;
    #needRender = true;

    constructor(canvas, core) {
        this.#canvas = canvas;
        this.#core = core;

        this.#gl = canvas.getContext('webgl2', {
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            premultipliedAlpha: true
        });

        if (!this.#gl) throw new Error("WebGL2 not supported");

        this.#initGL();
        this.#setupWatchers();
    }

    #initGL() {
        const gl = this.#gl;

        this.#quadBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    #setupWatchers() {
        $effect(() => {
            if (this.#core?.camera) {
                this.#core.camera.x;
                this.#core.camera.y;
                this.#core.camera.currentZoom;
            }

            for (const layer of this.#layers) {
                for (const fx of layer) {
                    for (const key in fx.params) {
                        fx.params[key];
                    }
                }
            }

            this.#needRender = true;
        });
    }

    addEffect(id, layerIndex, fragmentSrc, initialParams = {}) {
        if (layerIndex < 0 || layerIndex > MAX_LAYER) return null;

        this.removeEffect(id);
        const fx = new WebGLShaderEffect(this.#gl, id, fragmentSrc, this.#quadBuffer, initialParams);
        this.#layers[layerIndex].push(fx);
        this.#needRender = true;
        return fx;
    }

    removeEffect(id) {
        for (const layer of this.#layers) {
            const index = layer.findIndex(fx => fx.id === id);
            if (index !== -1) {
                layer.splice(index, 1);
                this.#needRender = true;
                return;
            }
        }
    }

    #render = () => {
        this.#rafId = requestAnimationFrame(this.#render);

        if (!this.#isRunning || !this.#needRender) return;
        this.#needRender = false;

        const gl = this.#gl;

        const w = this.#canvas.width;
        const h = this.#canvas.height;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, w, h);

        for (const layer of this.#layers) {
            for (const fx of layer) {
                gl.useProgram(fx.program);
                gl.bindVertexArray(fx.vao);

                fx.params.u_resolution = [w, h];

                fx.applyUniforms();
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }

        gl.bindVertexArray(null);
    };

    createTexture(sourceElement = null, pixelated = true) {
        const gl = this.#gl;
        const filterMode = pixelated ? gl.NEAREST : gl.LINEAR;

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);

        if (sourceElement) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceElement);
        }
        return texture;
    }

    updateTexture(texture, sourceElement) {
        const gl = this.#gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const currentWidth = sourceElement.width || sourceElement.videoWidth || 0;
        const currentHeight = sourceElement.height || sourceElement.videoHeight || 0;

        if (texture.glWidth !== currentWidth || texture.glHeight !== currentHeight) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceElement);
            texture.glWidth = currentWidth;
            texture.glHeight = currentHeight;
        } else {
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, sourceElement);
        }

        this.#needRender = true;
    }

    start() {
        if (this.#isRunning) return;
        this.#isRunning = true;
        this.#render();
    }

    stop() {
        this.#isRunning = false;
        if (this.#rafId) cancelAnimationFrame(this.#rafId);
    }

    requestRender() {
        this.#needRender = true;
    }
}