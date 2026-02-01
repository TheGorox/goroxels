import { fixChatPosition } from "../Chat";
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

