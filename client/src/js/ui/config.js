import { fixChatPosition, toggleEmojis, updateEmojis } from "../Chat";
import globals from "../globals";
import { togglePlaced, updatePlaced } from "../player";
import { getLS, getOrDefault, setLS } from "../utils/localStorage";
import { getRecommendedColorSize } from "../utils/misc";
import { chatInput, coords } from "./elements";
import { showPatternsOnPalette } from "./palette";

export function initUISettings() {
    toggleEmojis(getLS('hideEmojis') != 1);
    updateEmojis(getOrDefault('emojis', '🙁 🤔 😀 😄 💚 😡 👋 👍 😐').split(' '));
    togglePlaced(!+getOrDefault('hidePlaced', 1))
    updatePlaced(getLS('placedCount', true));
    
    if (getLS('swapToolsPos') == 1) {
        swapToolsPos(getLS('swapToolsPos'));
    }
}

export function initCoordsClick() {
    coords.on('click', function () {
        globals.toolManager.tools.cordAdd.emit('up');
    })
}

export function fixColorsWidth() {
    const savedWidth = getLS('colorSize', true);
    const calculated = getRecommendedColorSize();

    const colSize = +savedWidth || calculated
    setPaletteColorsSize(colSize);
    fixChatPosition();
}

// an old analog for setPaletteColorsSize
export function setPaletteRows(rows) {
    let width = (window.innerWidth / 100) * rows;

    $('#palette').css('max-width', width);
}


export function setPaletteColorsSize(size) {
    if (size === undefined) {
        size = getRecommendedColorSize();
    }
    $('.paletteColor').css('width', size).css('height', size);
}

export function swapToolsPos(state){
    const qs = $('#tools,.showMenu,.showChat')
    if(state == 1){
        qs.addClass('right');
    }else{
        qs.removeClass('right');
    }
}

export function unloadPalettePatterns() {
    $('.paletteColor>img').remove();
    $('.paletteColor').removeClass('patternColor');
}
export function initMenuResizer() {
    const resizer = $('#menuResizer');
    const resizerStripes = $('#resizingStripes');

    let curHeight = +getLS('columnHeight');
    if (isNaN(curHeight) || curHeight == 0) {
        curHeight = 123;
    } else if (curHeight < 0) {
        curHeight = 0;
    } else if (curHeight >= (window.screen.height - 250)) {
        curHeight = window.screen.height - 250;
    }
    $('.columnContent').css('height', curHeight);

    let resizeTimeout;
    let resizeLock = false;

    function unfade() {
        resizer.css('height', '7px');
        resizer.css('background-color', '#4c4c4c');
        resizerStripes.css('opacity', '1');
    }

    function fade() {
        clearTimeout(resizeTimeout);
        resizer.css('height', '');
        resizer.css('background-color', '');
        resizerStripes.css('opacity', '');
    }

    resizer.on('mouseover', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            unfade();
        }, 500);
    });

    resizer.on('mouseout', () => {
        if (resizeLock) return;

        fade();
    });

    function onmousedown() {
        resizeLock = true;
        unfade();

        function onmousemove(e) {
            curHeight += e.originalEvent.movementY;
            $('.columnContent').css('height', curHeight);
            setLS('columnHeight', curHeight);
        }
        function oncemouseup() {
            $(document).off('mousemove', onmousemove);
            resizeLock = false;
            fade();
        }

        $(document).on('mousemove', onmousemove);
        $(document).one('mouseup', oncemouseup);
    }
    resizer.on('mousedown', onmousedown);
}
