const LAYER = 3;

export const PROTECTION_FS = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D u_mask;
uniform vec2      u_resolution;
uniform vec2      u_camPos;
uniform float     u_zoom;
uniform float     u_level;
uniform float     u_intensity;
uniform float     u_atlasSize;
uniform float     u_borderPx;
uniform float     u_time;

out vec4 fragColor;

float fetch(ivec2 t) {
    int m = int(u_atlasSize) - 1;
    return texelFetch(u_mask, t & ivec2(m), 0).r;
}

void main() {
    vec2 screen = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    vec2 world  = u_camPos + screen / u_zoom;
    float scale = exp2(u_level);
    vec2 tex    = world / scale;
    ivec2 ti    = ivec2(floor(tex));

    if (fetch(ti) < 0.5) {
        fragColor = vec4(0.0);
        return;
    }

    vec2 f = fract(tex);
    float s = u_zoom * scale;
    float invS = 1.0 / s;
    float b = u_borderPx * invS;

    float dL = f.x;
    float dR = 1.0 - f.x;
    float dT = f.y;
    float dB = 1.0 - f.y;

    bool eL = fetch(ti + ivec2(-1,  0)) < 0.5;
    bool eR = fetch(ti + ivec2( 1,  0)) < 0.5;
    bool eT = fetch(ti + ivec2( 0, -1)) < 0.5;
    bool eB = fetch(ti + ivec2( 0,  1)) < 0.5;

    bool eTL = fetch(ti + ivec2(-1, -1)) < 0.5;
    bool eTR = fetch(ti + ivec2( 1, -1)) < 0.5;
    bool eBL = fetch(ti + ivec2(-1,  1)) < 0.5;
    bool eBR = fetch(ti + ivec2( 1,  1)) < 0.5;

    float dist = 1e6;

    if (eL) dist = min(dist, dL);
    if (eR) dist = min(dist, dR);
    if (eT) dist = min(dist, dT);
    if (eB) dist = min(dist, dB);

    if (eTL) dist = min(dist, length(vec2(dL, dT)));
    if (eTR) dist = min(dist, length(vec2(dR, dT)));
    if (eBL) dist = min(dist, length(vec2(dL, dB)));
    if (eBR) dist = min(dist, length(vec2(dR, dB)));

    bool edge = dist < b;

    float period = 12.0;
    float stripe = step(0.5, fract((screen.x + screen.y) / period - u_time * 0.5));
    vec3 col = vec3(1.0, 0.25, 0.25);
    float alpha = edge ? 0.8 : stripe * 0.15;

    fragColor = vec4(col, alpha * u_intensity);
}`;

export class ProtectionAtlas {
    constructor(gl, chunkSize, atlasSize = 4096) {
        this.gl = gl;
        this.cs = chunkSize;
        this.size = atlasSize;
        this.level = -1;
        this.slots = null;
        this.vers = null;

        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R8, atlasSize, atlasSize);

        const z = new Uint8Array(atlasSize * atlasSize);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, atlasSize, atlasSize, gl.RED, gl.UNSIGNED_BYTE, z);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    pickLevel(zoom, screenPx) {
        const safeZoom = Math.max(zoom, 1e-6);
        const maxBase = Math.max(0, Math.floor(Math.log2(this.cs)) - 3);
        const minLevel = this.cs > this.size ? Math.ceil(Math.log2(this.cs / this.size)) : 0;
        const maxLevel = Math.max(maxBase, minLevel);

        let L = Math.max(minLevel, Math.max(0, Math.ceil(-Math.log2(safeZoom))));
        if (L > maxLevel) L = maxLevel;

        while (L < maxLevel) {
            const scale = 1 << L;
            const need = Math.ceil(screenPx / (safeZoom * scale));
            const margin = Math.max(1, this.cs >> L);
            if (need + margin <= this.size) break;
            L++;
        }

        return L;
    }

    update(cam, zoom, screenW, screenH, getChunk) {
        const gl = this.gl;
        const L = this.pickLevel(zoom, Math.max(screenW, screenH));
        const slotPx = Math.max(1, this.cs >> L);
        const S = Math.max(1, Math.floor(this.size / slotPx));

        if (L !== this.level || !this.slots || this.slots.length !== S * S) {
            this.level = L;
            this.slots = new Array(S * S).fill(null);
            this.vers = new Int32Array(S * S).fill(-1);
        }

        const safeZoom = Math.max(zoom, 1e-6);
        const worldW = screenW / safeZoom;
        const worldH = screenH / safeZoom;

        let cx0 = Math.floor(cam.x / this.cs) - 1;
        let cy0 = Math.floor(cam.y / this.cs) - 1;
        let cx1 = Math.floor((cam.x + worldW) / this.cs) + 1;
        let cy1 = Math.floor((cam.y + worldH) / this.cs) + 1;

        if (cx1 - cx0 + 1 > S || cy1 - cy0 + 1 > S) {
            console.warn(`[fx] атлас переполнен: ${cx1 - cx0 + 1}x${cy1 - cy0 + 1} > ${S}x${S} слотов`);
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        for (let cy = cy0; cy <= cy1; cy++) {
            const sy = ((cy % S) + S) % S;

            for (let cx = cx0; cx <= cx1; cx++) {
                const sx = ((cx % S) + S) % S;
                const si = sy * S + sx;
                const key = cx + ',' + cy;
                const ch = getChunk(cx, cy);

                if (!ch) {
                    if (this.slots[si] === '@empty') continue;

                    gl.texSubImage2D(
                        gl.TEXTURE_2D,
                        0,
                        sx * slotPx,
                        sy * slotPx,
                        slotPx,
                        slotPx,
                        gl.RED,
                        gl.UNSIGNED_BYTE,
                        ProtectionAtlas.zeros(slotPx)
                    );

                    this.slots[si] = '@empty';
                    this.vers[si] = 0;
                    continue;
                }

                const ver = ch.pVersion | 0;
                const data = typeof ch.getMaskLevel === 'function' ? ch.getMaskLevel(L) : null;

                if (data) {
                    if (this.slots[si] === key && this.vers[si] === ver) continue;

                    gl.texSubImage2D(
                        gl.TEXTURE_2D,
                        0,
                        sx * slotPx,
                        sy * slotPx,
                        slotPx,
                        slotPx,
                        gl.RED,
                        gl.UNSIGNED_BYTE,
                        data
                    );

                    this.slots[si] = key;
                    this.vers[si] = ver;
                } else {
                    if (this.slots[si] === key && this.vers[si] === -2) continue;

                    gl.texSubImage2D(
                        gl.TEXTURE_2D,
                        0,
                        sx * slotPx,
                        sy * slotPx,
                        slotPx,
                        slotPx,
                        gl.RED,
                        gl.UNSIGNED_BYTE,
                        ProtectionAtlas.zeros(slotPx)
                    );

                    this.slots[si] = key;
                    this.vers[si] = -2;
                }
            }
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        return { L, slotPx };
    }

    static #zeroCache = {};

    static zeros(n) {
        return (this.#zeroCache[n] ??= new Uint8Array(n * n));
    }
}

function createEmptyMaskTexture(gl) {
    const texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R8, 1, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 1, 1, gl.RED, gl.UNSIGNED_BYTE, ProtectionAtlas.zeros(1));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}

export function attachProtectionFx(core, opts = {}) {
    const renderer = core.gl;
    const { atlasSize = 4096, borderPx = 2 } = opts;

    const atlas = new ProtectionAtlas(renderer.gl, core.config.chunkSize, atlasSize);
    const emptyMask = createEmptyMaskTexture(renderer.gl);

    let intensity = 1;

    const fx = renderer.addEffect('protection', LAYER, PROTECTION_FS, {
        u_mask: atlas.texture,
        u_resolution: [1, 1],
        u_camPos: [0, 0],
        u_zoom: 1,
        u_level: 0,
        u_intensity: 1,
        u_atlasSize: atlas.size,
        u_borderPx: borderPx,
        u_time: 0,
    });

    let hidden = false;
    let lastPerf = performance.now();
    let blinking = false;

    // called every frame
    fx.update = () => {
        const visible = !!core.ui?.showProtection?.v || blinking;

        if (!visible) {
            if (!hidden) {
                hidden = true;

                const gl = renderer.gl;
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, atlas.texture);
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
                gl.texSubImage2D(
                    gl.TEXTURE_2D,
                    0,
                    0,
                    0,
                    1,
                    1,
                    gl.RED,
                    gl.UNSIGNED_BYTE,
                    ProtectionAtlas.zeros(1)
                );
                gl.bindTexture(gl.TEXTURE_2D, null);
                
                atlas.level = -1;
            }
            
            fx.params.u_mask = emptyMask;
            fx.params.u_atlasSize = 1;
            lastPerf = performance.now();
            return;
        }
        
        if (hidden) {
            hidden = false;
            atlas.level = -1;
        }
        
        const w = renderer.canvas.width;
        const h = renderer.canvas.height;
        
        if (!w || !h || !core.camera) return;
        
        fx.params.u_resolution[0] = w;
        fx.params.u_resolution[1] = h;
        
        const cam = core.camera;
        const dpr = typeof devicePixelRatio === 'number' ? devicePixelRatio : 1;
        const zoom = Math.max(1e-6, (cam.currentZoom ?? cam.zoom ?? 1) * dpr);
        
        const camX = (cam.x ?? 0) - w / (2 * zoom);
        const camY = (cam.y ?? 0) - h / (2 * zoom);
        
        const { L } = atlas.update(
            { x: camX, y: camY },
            zoom,
            w,
            h,
            (cx, cy) => core.chunkManager?.getChunk?.(cx, cy) ?? null
        );
        
        const now = performance.now();
        
        fx.params.u_mask = atlas.texture;
        fx.params.u_camPos[0] = camX;
        fx.params.u_camPos[1] = camY;
        fx.params.u_zoom = zoom;
        fx.params.u_level = L;
        fx.params.u_intensity = intensity;
        fx.params.u_atlasSize = atlas.size;
        fx.params.u_borderPx = Math.max(core.camera.currentZoom / 3, 1);
        fx.params.u_time = (now * 0.001) % 1000000;
        
        const minIntensity = blinking ? 0 : 1;
        if(intensity > minIntensity){
            const delta = now - lastPerf;
            intensity -= delta * 0.002;
        }else{
            if(blinking) blinking = false;
            intensity = 1;
        }
        lastPerf = now;
    };
    
    core.atlas = atlas;
    core.proFx = fx;
    
    return {
        fx,
        atlas,
        
        setIntensity: (power) => {
            intensity = power;
            
            // blink with hidden protection
            if(power > 1 && !core?.ui.showProtection?.v){
                blinking = true;
            }
        },
        
        detach: () => {
            renderer.removeEffect('protection');
            core.atlas = null;
            core.proFx = null;
        },
    };
}