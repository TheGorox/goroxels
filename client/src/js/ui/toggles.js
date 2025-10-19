import { fixChatPosition } from "../Chat";
import { getLS } from "../utils/localStorage";
import { topMenu } from "./elements";

export function toggleTopMenu() {
    if (topMenu.css('display') === 'none') {
        topMenu.show();
        topMenu.css('margin-top', '');
    } else {
        topMenu.css('margin-top', -topMenu.height() - 30);
        setTimeout(() => topMenu.hide(), 500);
    }
}

export function toggleEverything() {
    // $('#ui>div>div').each((_, el) => {
    //     if(el.style.getPropertyPriority('display') == 'important')
    //         return;

    //     if (el.style.display === 'none') {
    //         $(el).css('display', '')
    //     } else {
    //         $(el).css('display', 'none')
    //     }
    // })
    $('#ui').fadeToggle(100);
    fixChatPosition();
}

export function initMobileMenuToggler() {
    $('.showMenu,.hideMenu').on('click', toggleTopMenu)
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
        }, 500)
    })

    resizer.on('mouseout', () => {
        if (resizeLock) return;

        fade();
    })

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

        $(document).on('mousemove', onmousemove)
        $(document).one('mouseup', oncemouseup)
    }
    resizer.on('mousedown', onmousedown);
}