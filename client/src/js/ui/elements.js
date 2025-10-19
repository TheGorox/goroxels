export const urlInput = $('#templateURL'),
    xInput = $('#templateX'),
    yInput = $('#templateY'),
    opacInput = $('#templateOpacity'),

    ui = $('#ui'),
    chat = $('#chat'),
    chatInput = $('#chatInput'),
    template = $('#template'),
    topMenu = $('#topMenu'),

    mainCanvas = $('#board'),
    fxCanvas = $('#fx'),
    palette = $('#palette'),
    online = $('#onlineCounter'),
    coords = $('#coords'),
    topMenuContent = $('#topMenu>.content');

// you can't just change css se..
export function changeSelector(selector, obj) {
    let el;
    if (!(el = document.getElementById('REPLACE-' + selector))) {
        el = document.createElement('style');
        el.id = 'REPLACE-' + selector;
    }

    let styleArr = Object.keys(obj).map(prop => prop + ':' + obj[prop]);
    el.innerText = `${selector}{${styleArr.join(';')}}`;

    document.head.appendChild(el);
}