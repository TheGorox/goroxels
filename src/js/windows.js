import toastr from 'toastr';

import chat, { fixChatPosition, toggleEmojis, updateEmojis } from './Chat';
import { game, showProtected } from './config';
import { ROLE, ROLE_I } from './constants';
import { urlInput } from './ui/elements';
import globals from './globals';
import { showHistoryCanvas, unloadHistoryCanvas, wipes } from './history';
import me from './me';
import player, { togglePlaced, updateBrush, updateMe } from './player';
import tools from './tools';
import { translate as t, translate as tr } from './translate';
import User from './user';
import Window, { ConfirmModal } from './Window';
import { getLS, getOrDefault, setLS } from './utils/localStorage';
import { capitalize } from './utils/strings';
import { decodeKey, getEventKeyCode, htmlspecialchars, makeScreenshot, reverseFade, stringifyKeyEvent } from './utils/misc';

import arrowSvg from '../img/arrow.svg';
import desktopIcon from '../img/icon-desktop.svg';
import mobileIcon from '../img/icon-phone.svg';
import userImg from '../img/user2.png';
import dsLogo from '../img/discord-logo-circle.svg';
import ggLogo from '../img/gg-logo.svg';
import vkLogo from '../img/vk-logo.svg';

import lmbIcon from '../img/mouse/mouse-lmb.png';
import rmbIcon from '../img/mouse/mouse-rmb.png';
import mmbIcon from '../img/mouse/mouse-mmb.png';
import mb4Icon from '../img/mouse/mouse-4mb.png';
import mb5Icon from '../img/mouse/mouse-5mb.png';
import { apiRequest, fetchCaptcha, solveCaptcha } from './utils/api';
import { shareTemplate, showTemplates, updateTemplate } from './template';
import { setPaletteColorsSize, showPatternsOnPalette, unloadPalettePatterns } from './ui/config';


const mouseKeys = {
    'LMB': lmbIcon,
    'RMB': rmbIcon,
    'MMB': mmbIcon,
    '4MB': mb4Icon,
    '5MB': mb5Icon,
}

export function initButtons() {
    $('#accountSettings').on('click', accountSettings);
    $('#toolBinds').on('click', keyBinds);
    $('#uiSettings').on('click', uiSettings);
    $('#canvasSettings').on('click', gameSettings);
    $('#toolsB').on('click', toolsWindow);
    $('.authBtn').on('click', authWindow);
    $('#showTemplates').on('click', showTemplates);
    $('#shareTemplate').on('click', shareTemplate);
}

export function initHelpButton() {
    $('.helpBtn').on('click', () => {
        help();
    })
}

export function showHelpIfFirstTime() {
    const shownAlready = getLS('helpShown');
    if (!shownAlready) {
        setLS('helpShown', '1');
        help();
    }
}



export function initOnlineViewer() {
    $('#onlineColumn .columnHeader').on('click', async () => {
        let json;
        try {
            const resp = await fetch('/api/online');
            json = await resp.json();
        } catch (e) {
            toastr.error(e);
            return
        }

        onlineViewWindow(json);
    });
}


function createCollapsibleBlock(title, bodyHtml, collapsed = true) {
    const head = $('<div>');
    head[0].style.cssText =
        `width: 100%;
    height: 30px;
    background-color: #5f5f5f;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer`

    head.append(`<div style="font-size:20px;text-transform:uppercase;">${title}</div>`)

    const arrow = $('<div>');
    arrow[0].style.cssText =
        `position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 5px;
    background-image: url(${arrowSvg});
    background-size: 100%;
    background-repeat: no-repeat;
    transition: transform .2s ease-in-out;
    width: 20px;
    height: 20px;`

    head.append(arrow);

    const body = $('<div>');
    body[0].style.cssText =
        `max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s linear;
    font-size: 20px;`

    const innerBody = $('<div>');
    innerBody[0].style.cssText =
        `padding:8px`
    innerBody.html(bodyHtml);

    body.append(innerBody);

    const headBodyContainer = $('<div>');
    headBodyContainer[0].style.cssText =
        `margin-bottom: 1px;`
    headBodyContainer.append(head, body)

    let state = 0; // 0 - closed, 1 - opened
    let reCheckHeightIntervalId = null;
    function toggle() {
        clearTimeout(reCheckHeightIntervalId);
        if (state) {
            arrow.css('transform', 'translate(0px, -50%) rotate(0deg)');
            body.css('max-height', 0);
        } else {
            arrow.css('transform', 'translate(0px, -50%) rotate(180deg)');

            requestAnimationFrame(() => {
                // force layout calc reflow
                // otherwise scrollHeight may be not updated
                body[0].offsetHeight;

                body.css('max-height', body[0].scrollHeight);

                reCheckHeightIntervalId = setTimeout(() => {
                    body.css('max-height', body[0].scrollHeight);
                }, 300);
            });
        }
        state = !state;
    }
    if (!collapsed) setTimeout(toggle);

    head.on('click', toggle);

    return headBodyContainer
}

export function generateTable(arr = []) {
    const table = $('<table class="columnTable"></table>');
    arr.forEach(([title, content]) => {
        let tableBlock = $(`
                <tr>
                    ${content === void 0 ?
                `<td colspan="2">${title}</td>` :
                `<td>${title}</td>
                        <td>${content}</td>`
            }
                </tr>`);
        table.append(tableBlock)
    });

    return table
}

export function accountSettings() {
    const settingsWin = new Window({
        title: capitalize(t('account settings')),
        center: true
    });
    if (!settingsWin.created) return;

    let html = generateTable([
        [tr('role'), ROLE_I[me.role].toUpperCase()],
        [
            tr('change name'),
            `<input type="text" id="name" style="width:50%"><button id="changeName">yes</button>`
        ],
        [
            `<button id="logout">${tr('logout')}</button>`
        ],
        // [
        //     `<button id="deleteAccount">${tr('delete_account')}</button>`
        // ]

    ]);

    $(settingsWin.body).append(html);

    $('#name').val(me.name)
    $('#changeName').on('click', () => {
        const newName = $('#name').val();

        if (!me.registered) {
            return toastr.error('Hey wtf', '0_o');
        }
        if (newName.length < 0 || newName.length > 32) {
            return toastr.error('Name length is not 0 < length < 32', 'Name change')
        }
        if (me.name === newName) {
            return toastr.error('Name is the same as was', 'Name change')
        }

        fetch('/api/changename', {
            method: 'POST',
            body: JSON.stringify({
                name: newName
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async r => {
            const result = await r.json();
            if (!result.errors.length) {
                globals.socket.close();
                toastr.success('Name successfully changed');
                updateMe();
            } else {
                result.errors.map(e => {
                    toastr.error(e, 'Name change error')
                })
            }
        })
    })

    $('#logout').on('click', async () => {
        if (me.registered) {
            const req = await apiRequest('/auth/logout');
            const success = await req.json();
            if (success) {
                location.pathname = '/';
            } else {
                toastr.error('Can\'t log out');
            }
        }
    })
}

export function keyBinds() {
    const keysWin = new Window({
        title: capitalize(t('toolbinds settings')),
        center: true
    });
    if (!keysWin.created) return;

    let table = generateTable();



    for (const tool of Object.values(tools)) {
        if (!tool.key) continue;
        if (tool.requiredRole > me.role) continue;

        const tableRow = $(
            `<tr>
            <td>${t('toolName.' + tool.name)}</td>
            <td>
                <div class="toolKeys" id="KEYS-${tool.name}">
                </div>
                <button class="resetKeyBtn" id="RESET-${tool.name}">🔄</button>
                <button class="changeKeyBtn" "id="CHANGE-${tool.name}">🔧</button>
            </td>
        </tr>`);

        table.append(tableRow);

        const keysContainer = $('.toolKeys', tableRow);
        const changeBtn = $('.changeKeyBtn', tableRow);
        const resetBtn = $('.resetKeyBtn', tableRow);

        changeBtn.on('click', () => {
            if (globals.lockInputs) return;
            globals.lockInputs = true;

            keysContainer.html('<span>...</span>');

            let clearFade = reverseFade(tableRow[0]);
            const onkeydown = e => {
                e.preventDefault();
                e.stopPropagation();

                redrawToolKeys(e);

                const code = getEventKeyCode(e);
                if (isNormalKey(code) || isMouseKey(code)) {
                    globals.toolManager.changeKey(tool, stringifyKeyEvent(e));
                }
            }
            document.addEventListener('keydown', onkeydown);
            document.addEventListener('pointerdown', onkeydown);

            const onkeyup = e => {
                const isMouse = isMouseKey(getEventKeyCode(e));
                if (!isMouse && !e.code || e.code === 'ControlLeft' || e.code === 'AltLeft') return;

                e.preventDefault();
                e.stopPropagation();

                cleanup();

                globals.toolManager.saveBinds();
            }

            document.addEventListener('keyup', onkeyup);
            document.addEventListener('pointerup', onkeyup);

            function cleanup() {
                clearFade?.call();
                document.removeEventListener('keydown', onkeydown);
                document.removeEventListener('pointerdown', onkeydown);
                document.removeEventListener('keyup', onkeyup);
                document.removeEventListener('pointerup', onkeyup);

                globals.lockInputs = false;
            }
        });

        resetBtn.on('click', () => {
            if (globals.lockInputs) return;

            redrawToolKeys(decodeKey(tool.defaultKey));

            globals.toolManager.changeKey(tool, tool.defaultKey);
            globals.toolManager.saveBinds();
        })

        function redrawToolKeys(key) {
            const alt = key.alt ?? key.altKey;
            const ctrl = key.ctrl ?? key.ctrlKey;

            const keyCode = getEventKeyCode(key);

            keysContainer.html('');

            if (alt) {
                keysContainer.append('<kbd>ALT</kbd> + ');
            }
            if (ctrl) {
                keysContainer.append('<kbd>CTRL</kbd> + ');
            }

            if (isNormalKey(keyCode)) {
                keysContainer.append(`<kbd>${keyCode}</kbd>`);
            } else if (isMouseKey(keyCode)) {
                const img = `<img src="${mouseKeys[keyCode]}"/>`
                keysContainer.append(`<kbd>${img}</kbd>`);
            }
        }

        function isNormalKey(code) {
            return code && !code.startsWith('Control') && !code.startsWith('Alt') && !isMouseKey(code)
        }

        function isMouseKey(code) {
            return Object.keys(mouseKeys).includes(code);
        }

        const parsed = decodeKey(tool.key);

        redrawToolKeys(parsed);
    }

    $(keysWin.body).append(table);
}

export function uiSettings() {
    const setWin = new Window({
        title: capitalize(t('ui settings')),
        center: true
    });
    if (!setWin.created) return;

    const table = generateTable([
        [t('colors size'), '<input type="range" min="16", max="64" step="1" id="colSize"><div style="width:50px;"><div>'],
        [t('hide emojis'), '<input type="checkbox" id="toggleEmojis">'],
        [t('emoji list'), '<input type="text" id="emojiList">'],
        [`<button id="moreEmojis">${t('super secret button')}</button>`],
        [t('show placed pixels'), '<input type="checkbox" id="togglePlaced">'],
        [t('show patterns over the palette'), '<input type="checkbox" id="showPatterns">']
    ]);
    $(setWin.body).append(table);

    function colorSizeChanged() {
        const val = $('#colSize').val();
        setPaletteColorsSize(val);
        $('#colSize').next().text(val + 'px');
        setLS('colorSize', val, true);
        fixChatPosition();
    }

    const colSizeVal = getOrDefault('colorSize', 24, true);
    $('#colSize').next().text(colSizeVal);
    $('#colSize').val(colSizeVal)
    $('#colSize').on('input', colorSizeChanged);

    $('#toggleEmojis')[0].checked = getLS('hideEmojis') == 1;
    $('#toggleEmojis').on('click', e => {
        const state = !e.target.checked;
        setLS('hideEmojis', state ? 0 : 1);
        toggleEmojis(state);
    });

    $('#emojiList').val(getOrDefault('emojis', '🙁 🤔 😀 😄 💚 😡 👋 👍 😐'));
    $('#emojiList').on('change', e => {
        setLS('emojis', e.target.value);
        updateEmojis(e.target.value.split(' '));
    })

    $('#moreEmojis').on('click', () => {
        const w = new Window(t('more emojis!'));
        if (!w.created) return;

        w.body.innerHTML = '😁😂😃😄😅😆😉😊😋😌😍😏😒😓😔😖😘😚😜😝😞😠😡😢😣😤😥😨😩😪😫😭😰😱😲😳😵😷😸😹😺😻😼😽😾😿🙀🙅🙆🙇🙈🙉🙊🙋🙌🙍🙎🙏✂✅✈✉✊✋✌✏✒✔✖✨✳✴❄❇❌❎❓❔❕❗❤➕➖➗➡➰🚀🚃🚄🚅🚇🚉🚌🚏🚑🚒🚓🚕🚗🚙🚚🚢🚤🚥🚧🚨🚩🚪🚫🚬🚭🚲🚶🚹🚺🚻🚼🚽🚾🛀Ⓜ🅰🅱🅾🅿🆎🆑🆒🆓🆔🆕🆖🆗🆘🆙🆚🈁🈂🈚🈯🈲🈳🈴🈵🈶🈷🈸🈹🈺🉐🉑©®‼⁉™ℹ↔↕↖↗↘↙↩↪⌚⌛⏩⏪⏫⏬⏰⏳▪▫▶◀◻◼◽◾☀☁☎☑☔☕☝☺♈♉♊♋♌♍♎♏♐♑♒♓♠♣♥♦♨♻♿⚓⚠⚡⚪⚫⚽⚾⛄⛅⛎⛔⛪⛲⛳⛵⛺⛽⤴⤵⬅⬆⬇⬛⬜⭐⭕〰〽㊗㊙🀄🃏🌀🌁🌂🌃🌄🌅🌆🌇🌈🌉🌊🌋🌌🌏🌑🌓🌔🌕🌙🌛🌟🌠🌰🌱🌴🌵🌷🌸🌹🌺🌻🌼🌽🌾🌿🍀🍁🍂🍃🍄🍅🍆🍇🍈🍉🍊🍌🍍🍎🍏🍑🍒🍓🍔🍕🍖🍗🍘🍙🍚🍛🍜🍝🍞🍟🍠🍡🍢🍣🍤🍥🍦🍧🍨🍩🍪🍫🍬🍭🍮🍯🍰🍱🍲🍳🍴🍵🍶🍷🍸🍹🍺🍻🎀🎁🎂🎃🎄🎅🎆🎇🎈🎉🎊🎋🎌🎍🎎🎏🎐🎑🎒🎓🎠🎡🎢🎣🎤🎥🎦🎧🎨🎩🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏆🏈🏊🏠🏡🏢🏣🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🐌🐍🐎🐑🐒🐔🐗🐘🐙🐚🐛🐜🐝🐞🐟🐠🐡🐢🐣🐤🐥🐦🐧🐨🐩🐫🐬🐭🐮🐯🐰🐱🐲🐳🐴🐵🐶🐷🐸🐹🐺🐻🐼🐽🐾👀👂👃👄👅👆👇👈👉👊👋👌👍👎👏👐👑👒👓👔👕👖👗👘👙👚👛👜👝👞👟👠👡👢👣👤👦👧👨👩👪👫👮👯👰👱👲👳👴👵👶👷👸👹👺👻👼👽👾👿💀💁💂💃💄💅💆💇💈💉💊💋💌💍💎💏💐💑💒💓💔💕💖💗💘💙💚💛💜💝💞💟💠💡💢💣💤💥💦💧💨💩💪💫💬💮💯💰💱💲💳💴💵💸💹💺💻💼💽💾💿📀📁📂📃📄📅📆📇📈📉📊📋📌📍📎📏📐📑📒📓📔📕📖📗📘📙📚📛📜📝📞📟📠📡📢📣📤📥📦📧📨📩📪📫📮📰📱📲📳📴📶📷📹📺📻📼🔃🔊🔋🔌🔍🔎🔏🔐🔑🔒🔓🔔🔖🔗🔘🔙🔚🔛🔜🔝🔞🔟🔠🔡🔢🔣🔤🔥🔦🔧🔨🔩🔪🔫🔮🔯🔰🔱🔲🔳🔴🔵🔶🔷🔸🔹🔺🔻🔼🔽🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🗻🗼🗽🗾🗿😀😇😈😎😐😑😕😗😙😛😟😦😧😬😮😯😴😶🚁🚂🚆🚈🚊🚍🚎🚐🚔🚖🚘🚛🚜🚝🚞🚟🚠🚡🚣🚦🚮🚯🚰🚱🚳🚴🚵🚷🚸🚿🛁🛂🛃🛄🛅🌍🌎🌐🌒🌖🌗🌘🌚🌜🌝🌞🌲🌳🍋🍐🍼🏇🏉🏤🐀🐁🐂🐃🐄🐅🐆🐇🐈🐉🐊🐋🐏🐐🐓🐕🐖🐪👥👬👭💭💶💷📬📭📯📵🔀🔁🔂🔄🔅🔆🔇🔉🔕🔬🔭🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧'
        w.body.style.userSelect = 'text';
    });
    $('#togglePlaced')[0].checked = getOrDefault('hidePlaced', 1) == 0;
    $('#togglePlaced').on('click', e => {
        const show = e.target.checked;
        setLS('hidePlaced', show ? 0 : 1);
        togglePlaced(show);
    });

    $('#showPatterns')[0].checked = globals.showPatterns;
    $('#showPatterns').on('click', e => {
        const show = e.target.checked;
        globals.showPatterns = show;
        setLS('showPalettePatterns', show ? '1' : '0');
        show ? showPatternsOnPalette() : unloadPalettePatterns();
    });
}

export function gameSettings() {
    const win = new Window({
        title: capitalize(t('game settings')),
        center: true
    });
    if (!win.created) return;

    // 1 for guests (packets disabled by server), 20 for admins, and 10 for others 
    let maxBrushSize = (me.role === ROLE.ADMIN ? 20 : (me.role < ROLE.USER ? 1 : 10))

    const table = generateTable([
        [
            t('show protected'),
            `<input type="checkbox" id="showProtected" ${game.showProtected ? 'checked' : ''}>`
        ],
        [
            t('brush size'),
            `<input type="checkbox" id="customBrushSize" ${player.brushSize > 1 ? 'checked' : ''}>
            <input id="brushSize" type="range" value="${player.brushSize}" ` +
            `${player.brushSize == 1 ? 'disabled' : ''} min="2" ` +
            `max="${maxBrushSize}" step="2">` +
            `<span id="brushSizeCounter">${player.brushSize - 1}<span>`
        ],
        [
            t('max saved pixels'),
            `<input id="savePixelsInp" type="number" min="0" value="${player.maxPlaced}" style="width:4rem">`
        ],
        [
            t('disable chat colors'),
            `<input type="checkbox" id="disableChatColors" ${chat.colorsEnabled ? '' : 'checked'}>`
        ],
        [
            t('chat messages limit'),
            `<input type="number" id="chatLimit" value="${game.chatLimit}" title="maximum messages in chat">`
        ],
        [
            t('enable grid'),
            `<input type="checkbox" id="enableGridCB" ${tools.grid.state == 1 ? 'checked' : ''}>`
        ],
        [
            t('draw line length'),
            `<input type="checkbox" id="drawLineLenCB" ${tools.line.drawLength ? 'checked' : ''} title="draw line length near it">`
        ],
    ]);

    $(win.body).append(table);

    $('#showProtected').on('change', e => {
        const show = e.target.checked;
        game.showProtected = show;
        showProtected(show);
    });

    $('#customBrushSize').on('change', e => {
        const use = e.target.checked;

        if (use) {
            $('#brushSize').removeAttr('disabled');
            updateBrush($('#brushSize').val());
        } else {
            $('#brushSize').attr('disabled');
            updateBrush(1);
        }
    });

    $('#brushSize').on('input', e => {
        updateBrush(e.target.value);
    });

    $('#savePixelsInp').on('change', e => {
        e = e.target;
        if (+e.value < 0) e.value = 0;

        player.maxPlaced = +e.value;
        setLS('maxPlaced', player.maxPlaced)
    });

    $('#disableChatColors').on('change', e => {
        const checked = e.target.checked

        setLS('disableColors', checked.toString());

        chat.setColors(!checked)
    });

    $('#chatLimit').on('change', e => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) return;

        setLS('chatLimit', value.toString());

        game.chatLimit = value;
    });

    $('#enableGridCB').on('change', e => {
        const checked = e.target.checked;

        setLS('enableGrid', checked.toString());

        if (checked) tools.grid.show();
        else tools.grid.hide();
    });

    $('#drawLineLenCB').on('change', e => {
        const checked = e.target.checked;

        setLS('drawLineLen', checked.toString());

        tools.line.drawLength = checked;
    });
}

export async function captchaModal() {
    let win = new Window({
        title: t('Captcha'),
        center: true,
        closeable: false
    });

    if (win.created) {
        const [help, cont, inp] = $(
            `<div>${t('Case insensitive, 0/o i/l are same')}. <a href="#">${t('Can\'t recognize?')}</a></div>` +
            '<div class="captchaContainer"></div>' +
            '<input class="fullWidthInput" type="text"></input>'
        );

        help.children[0].onclick = captchaModal;

        const [line] = $(`<div style="display:flex;justify-content:center">${t('Captcha').toUpperCase()}:&nbsp;&nbsp;</div>`);
        line.appendChild(inp);

        win.body.appendChild(help)
        win.body.appendChild(cont);
        win.body.appendChild(line);

        inp.addEventListener('keydown', async e => {
            if (e.key === 'Enter') {
                if (inp.value.length == 0) return;
                let val = inp.value;
                inp.value = '';

                const success = await solveCaptcha(val);

                if (success) {
                    win.close();
                } else {
                    captchaModal();
                }
            }
        })
    } else win = win.oldWindow;

    let svg;
    try {
        svg = await fetchCaptcha();
    } catch (e) {
        console.error('error downloading captcha image: ' + e);

        globals.socket.close();
        return win.close();
    }

    // according to default dark theme
    svg = svg.replace('stroke="black"', 'stroke="white"');

    $('.captchaContainer', win.body).html(svg);

    win.moveToCenter();
    $('input', win.body).trigger('focus');
}

export function toolsWindow() {
    const toolWin = new Window({
        title: capitalize(t('tools')),
        center: true
    });
    if (!toolWin.created) return;

    const tableArr = [
        [`<a href="/convert" target="_blank">${t('convert image into palette')}</a>`],
        [`<button id="screenshot">${t('save canvas')}</button>`],
        [`<button id="showPrevWipes">${t('tools.showPrevWipesBtn')}</button>`]
    ]

    if (me.role >= ROLE.MOD) {
        tableArr.unshift([`<button id="searchUsersB">${t('search users')}</button>`])
    }

    const table = generateTable(tableArr);
    $(toolWin.body).append(table);

    $('#searchUsersB', table).on('click', () => {
        const win = new Window({
            title: capitalize(t('search users')),
            center: true
        });
        if (!win.created) return;

        const table = generateTable([
            [`<input type="text" placeholder="nickname" id="userSearchText" max="32" style="width:250px"> ${t('OR')} ` +
                '<input type="text" placeholder="id" id="userSearchId" max="32" style="width:50px">' +
                `<input type="checkbox" id="searchIsBanned"><label for="searchIsBanned">${t('banned?')}</label>`],
            ['<div id="searchUsersBody">']
        ]);

        $(win.body).append(table);

        const input = $('#userSearchText');

        $('#userSearchId').on('input', async e => {
            let num = e.target.value.trim();
            num = +num;

            if (isNaN(num) || num < 1 || num > Number.MAX_SAFE_INTEGER) {
                return
            }

            const isBanned = $('#searchIsBanned')[0].checked;

            const searchResp = await search(null, num, isBanned);
            afterSearch(searchResp);
        })

        $('#userSearchText').on('input', async _ => {
            let text = input.val().trim();
            text = text.slice(0, 32);

            const isBanned = $('#searchIsBanned')[0].checked;

            const searchResp = await search(text, null, isBanned);
            afterSearch(searchResp);
        });

        function afterSearch(resp) {
            if (!resp || !resp.length) {
                // clean up if nothing found
                $('#searchUsersBody').html('');
                return
            };

            let table = document.createElement('table');
            table.className = 'innerTable';
            table.innerHTML += '<tr><th>NICK</th><th>ID</th><th>ROLE</th><th>&nbsp;</th></tr>'

            for (let user of resp) {
                const safeNick = htmlspecialchars(user.name);

                // little workaround with click listener,
                // this might be shorter
                const uinfoButton = document.createElement('button');
                uinfoButton.className = 'userInfoBtn';
                uinfoButton.innerHTML = `<img src="${userImg}">`;
                uinfoButton.addEventListener('click', async () => {
                    const req = await apiRequest(`/userInfo?id=${user.id}`);
                    const info = await req.json();
                    await User.CreateWindow(info);
                })

                const row = $(
                    `<tr>
                        <td>${safeNick}</td><td>${user.id}</td>` +
                    `<td>${user.role}</td>` +
                    `<td></td>
                    </tr>`
                );

                row[0].lastElementChild.appendChild(uinfoButton);
                table.appendChild(row[0]);
            }

            $('#searchUsersBody').html(table);
        }

        async function search(term, id, isBanned) {
            if (!isBanned) {
                if (!term && !id) return;
            }
            if (term && id) return;

            if (term) {
                term = encodeURIComponent(term);
            }
            const req = await apiRequest(`/admin/users/search?isBanned=${isBanned ? 1 : 0}&${id ? `id=${id}` : `t=${term}`}`)

            const json = await req.json();
            return json
        }
    });

    $('#screenshot').on('click', makeScreenshot);

    $('#showPrevWipes').on('click', () => {
        const wipesWin = new Window({
            title: capitalize(t('prevWipesWinTitle'))
        });
        if (!wipesWin.created) return;

        wipesWin.body.style.maxHeight = '200px';

        if (!globals.mobile) {
            wipesWin.moveTo(
                toolWin.right + 5,
                toolWin.top
            );
        } else {
            wipesWin.moveToCenter();
        }

        const createWipeRow = function (wipeName) {
            return [`<button data-name="${wipeName}" class="showWipeBtn">${wipeName}</button>`];
        }
        const table = generateTable(Object.keys(wipes).map(createWipeRow));
        $(wipesWin.body).append(table);

        $('.showWipeBtn', wipesWin.body).on('click', el => {
            const name = el.target.dataset.name;
            showHistoryCanvas(name);
        });

        const oldCloseFunc = wipesWin.close;
        wipesWin.close = (...args) => {
            unloadHistoryCanvas();

            oldCloseFunc.call(wipesWin, ...args);
        }
    })
}

export function authWindow() {
    const win = new Window({
        title: capitalize(t('LOG IN')),
        center: true
    });
    if (!win.created) return;

    const tableArr = [
        [`<a href="/api/auth/vk"><img src="${vkLogo}" class="authLogo">VK</a>`],
        [`<a href="/api/auth/discord"><img src="${dsLogo}" class="authLogo">DISCORD</a>`],
        [`<a href="/api/auth/google"><img src="${ggLogo}" class="authLogo">GOOGLE</a>`]
    ]

    const table = generateTable(tableArr);

    $('td', table).css('text-align', 'left');
    $('a', table).css('margin-left', '15px');

    $(win.body).append(table);
}


export function help() {
    const helpWin = new Window({
        title: t('help'),
        center: true
    });
    if (!helpWin.created) return;

    helpWin.body.style.maxWidth = '800px';
    helpWin.body.style.width = '90vw';
    helpWin.body.style.height = '90vh';

    const desktopIconMacro = `<img class="smallSvgIcon" src="${desktopIcon}">`;
    const mobileIconMacro = `<img class="smallSvgIcon" src="${mobileIcon}">`;

    // TODO move this to translations
    const intro = createCollapsibleBlock(t('intro.introHeader'),
        `<div style="width:100%;text-align:center;"><img src="./img/goroxels.png" style="vertical-align: middle;">${t('intro.desc')}</div><br><br>
    ${t('intro.desc2')}`, false);

    const howto = createCollapsibleBlock(t('how to play?'),
        `<div style="display:inline-flex">
            <div>${t('intro.howToPlayDecs')}</div>
            <div style="padding-left: 10px;">
                <div class="desktop">
                <video autoplay loop muted style="height:196px"><source src="./video/clickerMouse.webm" type="video/webm"></video>
                </div>
                <div class="mobile">
                <video autoplay loop muted style="height:196px"><source src="./video/phoneDrawing.mp4" type="video/mp4"></video>
                </div>
            </div>
        </div>`);

    const tools = createCollapsibleBlock(t('tools'),
        `${t('intro.toolsDecs')}<br><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${mobileIconMacro}${t('intro.toolsClicker')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/clicker.webm" type="video/webm"></video>
        </div>
    </div><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${t('intro.toolsAS')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/as.webm" type="video/webm"></video>
        </div>
    </div><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${t('intro.toolC')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/toolC.webm" type="video/webm"></video>
        </div>
    </div><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${mobileIconMacro}${t('intro.brush')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/brush2.webm" type="video/webm"></video>
        </div>
    </div><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${mobileIconMacro}${t('intro.line')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/line.webm" type="video/webm"></video>
        </div>
    </div><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${mobileIconMacro}${t('intro.flood')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/flood.webm" type="video/webm"></video>
        </div>
    </div><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${mobileIconMacro}${t('intro.grid')}<br><br></div>
        <div class="desktop">
            <img src="./img/unavailable.png" style="height:196px">
        </div>
    </div><br>
    <div class="helpWithVideoCont">
        <div>${desktopIconMacro}${mobileIconMacro}${t('intro.ctrlZ')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/ctrlZ.webm" type="video/webm"></video>
        </div>
    </div><br>
    ${desktopIconMacro}${mobileIconMacro}${t('intro.resetColors')}<br>`);

    const tools2 = createCollapsibleBlock(t('intro.tools2header'),
        `<div style="width:100%;text-align:center;"><b>${t('intro.tools2desc')}</b></div><br><br>
    ${desktopIconMacro}${t('intro.toolsHiders')}<br><br>
    ${desktopIconMacro}${mobileIconMacro}${t('intro.multicol')}<br>
    ${t('intro.multicol2')}<br>
    ${t('intro.multicol3')}<br><br>
    ${desktopIconMacro}${t('intro.sendCoords')}<br><br>
    ${desktopIconMacro}${t('intro.templateTools')}<br>`);

    const template = createCollapsibleBlock(t('template'),
        `<div style="width:100%;text-align:center;"><b>${t('intro.templateIntro')}</b></div><br><br>
    ${t('intro.templateDesc')}<br><br>
    ${t('intro.templateDescConvert')}<br><br>
    <div class="helpWithVideoCont mobile">
        <video autoplay loop muted style="height:196px"><source src="./video/patternDemo.webm" type="video/webm"></video>
    </div>
    <div class="helpWithVideoCont">
        <div>${t('intro.templateDescReminder')}<br><br></div>
        <div class="desktop">
            <video autoplay loop muted style="height:196px"><source src="./video/patternDemo.webm" type="video/webm"></video>
        </div>
    </div><br>`);

    const author = createCollapsibleBlock(t('intro.authorHeader'),
        `${t('intro.authorText')}<br>
        ${t('intro.authorContacts')}<br>
        ${t('intro.telegram_channel')}: <a href="https://t.me/goroxels">t.me/goroxels</a><br>
        ${t('intro.my_boosty')} <a href="https://boosty.to/gorox">https://boosty.to/gorox</a>
        <div style="text-align:center"><img src="./img/3rdcf.png" title="ТРЕТЬЯ КОНФА"></div>`);


    $(helpWin.body).append(intro, howto, tools, tools2, template, author);
}

export function onlineViewWindow(json) {
    let win = new Window({
        title: capitalize(t('online')),
        center: true,
        closeable: true
    });

    if (!win.created) {
        win = win.oldWindow;
    }

    win.body.style.width = '325px';
    win.moveToCenter();

    const tableArr = [];
    Object.keys(json).forEach(key => {
        if (key === 'TOTAL') {
            win.updateTitle(t('online') + ` (${json[key]})`, true);
            return;
        }

        const firstEl = `<a href="/${key}" target="_shagorox"><h3>${key}<h3></a>`;
        const secondEl = `<h2>${json[key]}</h2>`;

        tableArr.push([firstEl, secondEl]);
    })

    const table = generateTable(tableArr);

    $('*', win.body).remove();
    $(win.body).append(table);
}

export function templatesWindow(templatesJson) {
    let win = new Window({
        title: capitalize(t('templates_title')),
        center: true,
        closeable: true
    });

    if (!win.created) {
        return;
    }

    win.body.classList.add('templatesBody');
    win.body.style.maxWidth = 'min(495px, 90vw)'; // 5 items
    if (globals.mobile) {
        win.body.style.justifyContent = 'space-evenly';
    }

    const templatesJsonSorted = templatesJson
        .slice()
        .sort((a, b) => {
            const aIsMine = me.id === a.userId;
            const bIsMine = me.id === b.userId;

            if (aIsMine !== bIsMine) {
                return aIsMine ? 1 : -1;
            }

            return new Date(a.createdAt) - new Date(b.createdAt);
        });

    const meAdmin = me.role === ROLE.ADMIN;
    for (const tempJson of templatesJsonSorted) {
        const meOwner = me.id === tempJson.userId;
        const canDelete = meOwner || meAdmin;

        const templateThumbLink = `api/template/img?t=thumb&f=${tempJson.thumb}`;

        const templateEl = $(
            `<div class="templateItem ${meOwner ? 'myTemplateItem' : ''}">
                <button class="templateBtn ${canDelete ? 'deleteBtn' : ''}"></button>
                <button class="templateBtn infoBtn">i</button>
                <img src="${templateThumbLink}" alt="thumbnail">
                <div class="templateName">${tempJson.name}</div>
            </div>`
        );

        $(win.body).prepend(templateEl);

        templateEl.find('.deleteBtn').on('click', async e => {
            e.stopPropagation();

            new ConfirmModal(t('confirm_template_deletion'), async (confirmed) => {
                if (!confirmed) return;
                const resp = await apiRequest(`/template/del?name=${encodeURIComponent(tempJson.name)}`, { method: 'POST' });
                const data = await resp.json();
                if (data.success) {
                    templateEl.remove();
                }
            })
        });

        templateEl.find('.infoBtn').on('click', async e => {
            e.stopPropagation();

            let ownerName = '???';
            try {
                const resp = await apiRequest(`/userInfo?id=${tempJson.userId}`);
                const data = await resp.json();
                if (data && data.name) {
                    ownerName = htmlspecialchars(data.name);
                }
            } catch (e) {
                console.error('Ошибка получения userInfo', e);
            }

            const isMine = me.id === tempJson.userId;
            const createdDate = new Date(tempJson.createdAt).toLocaleString();

            const infoWin = new Window({
                title: capitalize(t('template_info')),
                center: true,
                closeable: true
            });

            if (!infoWin.created) return;

            infoWin.body.style.width = '280px';
            infoWin.body.innerHTML = `
                <ul class="templateInfoList">
                    <li><b>${t('name')}:</b> ${tempJson.name}</li>
                    <li><b>${t('createdAt')}:</b> ${createdDate}</li>
                    <li><b>${t('owner')}:</b> ${ownerName}</li>
                    <li><b>${t('isMine')}:</b> ${isMine ? t('yes') : t('no')}</li>
                    <li><b>${t('public')}:</b> ${tempJson.public ? t('yes') : t('no')}</li>
                </ul>
            `;
        });


        templateEl.on('click', () => {
            let imgLink = `GRX/f=${tempJson.file}`;
            if (tempJson.origWidth) {
                imgLink += `&w=${tempJson.origWidth}`;
            }

            urlInput.val(imgLink);
            updateTemplate();
        })
    }
}

