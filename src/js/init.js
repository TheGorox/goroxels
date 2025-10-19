import { initChat, initMobileChatToggle } from "./Chat";
import { initDraggableInputs } from "./draggableInputs";
import globals from "./globals";
import player from "./player";
import { importTemplateFromUrl, initHandlers, initTemplateMobileMove, initTemplateMoveByMouse, loadValues } from "./template";
import { initCoordsClick, initUISettings } from "./ui/config";
import { initMenuResizer, initMobileMenuToggler } from "./ui/toggles";
import { startWinampRadio } from "./winamp/player";
import { initButtons, initHelpButton, initOnlineViewer, showHelpIfFirstTime } from "./windows";

export function initInputs() {
    loadValues();
    initHandlers();
    initButtons();
    initChat();
    initDraggableInputs();
}

export function initOtherCoolFeatures() {
    initTemplateMobileMove();

    importTemplateFromUrl();

    initTemplateMoveByMouse();
    initModMenu();
    initMobileMenuToggler();
    initUISettings();
    initMobileChatToggle();
    initHelpButton();
    player.init();
    initCoordsClick();
    initOnlineViewer();
    initMenuResizer();
    showHelpIfFirstTime();
    startWinampRadio();
}

function initModMenu() {
    initSliding();
    initSendAlerts();

    function initSliding() {
        $('#modMenu .title').on('click', e => {
            const m = $('#modMenu');
            if (m.data('state') === 'open') {
                m.data('state', 'close');
                m.css('right', '');
            } else {
                m.data('state', 'open');
                m.css('right', $('#modMenu .body').css('width'));
            }
        })
    }

    function initSendAlerts() {
        $('#sendAlerts').on('click', () => {
            const val = $('#sendAlertsText').val();
            if (val.length == 0 || val.length > 2000) return;

            $('#sendAlertsText').val('');
            globals.socket.sendAlert('all', val);
        })
    }
}