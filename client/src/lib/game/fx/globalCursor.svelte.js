// this is NOT a mouse cursor file
// but rather a fx of the brush/line/other tool that should render it's borders

import { tick } from 'svelte';
import { player } from '../player.svelte.js';
import { boardToScreenSpace } from '../utils/camera.js';

export function initGlobalCursor(core) {
    const cursorShader = `#version 300 es
    precision mediump float;
    out vec4 fragColor;

    uniform sampler2D u_image;
    uniform vec2 u_texSize;  // brush imData size
    uniform int u_mode;      // 0 - Alpha, 1 - Color
    
    in vec2 v_texCoord;

    bool isSameColor(vec4 c1, vec4 c2) {
        const float epsilon = 0.005;
        if (c1.a < 0.1 && c2.a < 0.1) return true;
        if (abs(c1.a - c2.a) > epsilon) return false;
        return all(lessThan(abs(c1.rgb - c2.rgb), vec3(epsilon)));
    }

    vec4 sampleTexture(vec2 uv) {
        vec4 color = texture(u_image, uv);
        
        vec2 insideBottomLeft = step(vec2(0.0), uv);
        vec2 insideTopRight   = step(uv, vec2(1.0));
        float inside = insideBottomLeft.x * insideBottomLeft.y * insideTopRight.x * insideTopRight.y;
        
        return color * inside; 
    }

    void main() {
        vec4 currentQuad = texture(u_image, v_texCoord);
        
        vec2 offset = vec2(0.13) / u_texSize;

        vec4 left        = sampleTexture(v_texCoord + vec2(-offset.x, 0.0));
        vec4 right       = sampleTexture(v_texCoord + vec2(offset.x, 0.0));
        vec4 up          = sampleTexture(v_texCoord + vec2(0.0, -offset.y));
        vec4 down        = sampleTexture(v_texCoord + vec2(0.0, offset.y));
        vec4 lefttop     = sampleTexture(v_texCoord + vec2(-offset.x, -offset.y));
        vec4 righttop    = sampleTexture(v_texCoord + vec2(offset.x, -offset.y));
        vec4 leftbottom  = sampleTexture(v_texCoord + vec2(-offset.x, offset.y));
        vec4 rightbottom = sampleTexture(v_texCoord + vec2(offset.x, offset.y));

        if (currentQuad.a < 0.1 && left.a < 0.1 && right.a < 0.1 && up.a < 0.1 && down.a < 0.1 && 
            lefttop.a < 0.1 && righttop.a < 0.1 && leftbottom.a < 0.1 && rightbottom.a < 0.1) {
            discard; 
        }

        if (u_mode == 0) {
            // MODE 0: ALPHA
            bool isInside = currentQuad.a > 0.1;
            bool hasEmptyNeighbor = left.a < 0.1 || right.a < 0.1 || up.a < 0.1 || down.a < 0.1 || lefttop.a < 0.1 || righttop.a < 0.1 || leftbottom.a < 0.1 || rightbottom.a < 0.1;

            if (isInside && !hasEmptyNeighbor) {
                fragColor = vec4(0.0); 
            } else {
                fragColor = currentQuad;
            }
        } else {
            // MODE 1: COLOR
            bool matchLeft  = isSameColor(currentQuad, left);
            bool matchRight = isSameColor(currentQuad, right);
            bool matchUp    = isSameColor(currentQuad, up);
            bool matchDown  = isSameColor(currentQuad, down);

            if (currentQuad.a > 0.1 && matchLeft && matchRight && matchUp && matchDown) {
                fragColor = vec4(0.0);
            } else {
                fragColor = currentQuad;
            }
        }
    }
    `;

    const brushTex = core.gl.createTexture();
    const brushRect = [0, 0, 1, 1];

    const canvasSizes = [window.innerWidth, window.innerHeight];

    const fx = core.gl.addEffect('global-cursor', 2, cursorShader, {
        u_image: brushTex,
        u_texSize: [1, 1],
        u_mode: 0,
        u_rect: brushRect,
        u_resolution: canvasSizes
    });

    if (!fx) return;

    function updateBrushSize() {
        if (!core.brush.imData || !core.camera) return;
        brushRect[2] = core.brush.imData.width * core.camera.currentZoom;
        brushRect[3] = core.brush.imData.height * core.camera.currentZoom;

        fx.params.u_rect = [...brushRect];
    }

    $effect(() => {
        if (core.brush.changed) {
            core.brush.changed = false;
            if(!core.brush.imData) return;

            core.gl.updateTexture(brushTex, core.brush.imData);
            console.log(core.brush.imData);
            
            fx.params.u_texSize = [core.brush.imData.width, core.brush.imData.height];
            updateBrushSize();
        }
    });

    $effect(() => {
        fx.params.u_mode = core.brush.renderMode === 1 ? 1 : 0;
    });

    $effect(() => {
        if (!core.camera) return;
        core.camera.currentZoom;
        updateBrushSize();
    });

    $effect(() => {
        if (!core.brush.imData || !core.camera) return;

        const [screenCenterX, screenCenterY] = boardToScreenSpace(
            Math.floor(core.camera.pivotWorldX),
            Math.floor(core.camera.pivotWorldY),
            true
        );

        const offsetX = (core.brush.offsetX || 0) * core.camera.currentZoom;
        const offsetY = (core.brush.offsetY || 0) * core.camera.currentZoom;

        brushRect[0] = screenCenterX - offsetX;
        brushRect[1] = screenCenterY - offsetY;

        fx.params.u_rect = [...brushRect];
    });
}