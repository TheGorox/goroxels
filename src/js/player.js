import Bucket from './Bucket';
import { cooldown } from './config';
import { chatInput } from './ui/elements';
import globals from './globals';
import me from './me';
import { getLS, getOrDefault, setLS } from './utils/localStorage';
import { ROLE, ROLE_I } from './constants';
import { translate as t } from './translate';

const player = {
    x: 0,
    y: 0,
    color: -1,
    brushSize: 1,
    secondCol: -1,
    id: -1,
    init(){
        this.loadColors();
        this.switchColor(this.color, true);
        this.switchSecondColor(this.secondCol, true);
    },
    loadColors(){
        this.color = +getOrDefault('color1', -1, true);
        this.secondCol = +getOrDefault('color2', -1, true);
    },
    switchColor(id, initial=false){
        if(this.secondCol === id && id !== -1){
            this.switchSecondColor(-1);
        }
        
        if(this.color === id && !initial)
            id = this.color = -1;
        else
            this.color = id;
        globals.fxRenderer.needRender = true;
        globals.renderer.preRender();

        $('.paletteColor.selected').removeClass('selected');
        if(id !== -1){
            $('#col' + id).addClass('selected');
        }

        setLS('color1', id, true);
    },
    switchSecondColor(id, initial){
        if(this.color === id && id !== -1){
            this.switchColor(-1);
        }
        if(this.secondCol === id && !initial)
            id = this.secondCol = -1;
        else
            this.secondCol = id;
        globals.fxRenderer.needRender = true;
        globals.renderer.preRender();

        $('.paletteColor.selectedSecond').removeClass('selectedSecond');
        if(id !== -1){
            $('#col' + id).addClass('selectedSecond');
        }

        setLS('color2', id, true);
    },
    swapColors(){
        const temp = this.color;
        this.switchColor(this.secondCol);
        this.switchSecondColor(temp);
    },
    resetColors(){
        this.switchColor(-1);
        this.switchSecondColor(-1);
    },
    bucket: null,
    updateBucket([delay, max]) {
        this.bucket = new Bucket(delay, max);
    },
    placed: [],
    maxPlaced: isNaN(+localStorage['maxPlaced']) ? 5000 : +localStorage['maxPlaced'],
    placedCount: +getLS('placedCount', true) || 0
}

export async function updateMe() {
    await me.load();

    player.updateBucket(getMyCooldown());
    if (me.registered) {
        chatInput.removeAttr('disabled');
        chatInput.val('');

        $('#loginButtons,.authBtn').hide();
        $('#chatNick,#chatChannels').show();
        $('#chatNick').text(me.name);
        $('#chatHeader').addClass('logged');
    } else {
        chatInput.attr('disabled');
        chatInput.val(t('login to chat'));

        // $('#chatNick').text('CHAT');
        $('#chatNick,#chatChannels').hide();
        $('#loginButtons,.authBtn').show();
        $('#chatHeader').removeClass('logged');
    }
}

function getMyCooldown() {
    const cooldowns = cooldown;

    if (ROLE_I[me.role] == 'ADMIN') return [0, 32]
    return cooldowns[ROLE_I[me.role]] || cooldown.GUEST;
}

export function placePixels(pixels, store = true) {
    // does not checks pixels

    if (store) {
        pixels.forEach(([x, y]) => {
            player.placed.push([x, y, globals.chunkManager.getChunkPixel(x, y)]);
        })
    }
    globals.socket.sendPixels(pixels, false);
}

export function placePixel(x, y, col, store = true) {
    const oldCol = globals.chunkManager.getChunkPixel(x, y),
        isProtected = globals.chunkManager.getProtect(x, y);

    if (oldCol !== col && (!isProtected || me.role >= ROLE.TRUSTED) && globals.socket.connected) {
        if (store) {
            player.placed.push([x, y, globals.chunkManager.getChunkPixel(x, y)]);

            if (player.placed.length > player.maxPlaced * 2) {
                player.placed = player.placed.slice(-player.maxPlaced);
            }
        }

        globals.chunkManager.setChunkPixel(x, y, col);
        globals.socket.sendPixel(x, y, col);

        globals.socket.pendingPixels[x + ',' + y] = setTimeout(() => {
            globals.chunkManager.setChunkPixel(x, y, oldCol);
            globals.renderer.needRender = true;
        }, 3000)
    } else {
        if (isProtected && me.role < ROLE.TRUSTED) {
            toastr.error(t('error.protected_pixel'), t('Error!'), {
                preventDuplicates: true,
                timeOut: 750
            })
        }
    }
}

export function updateBrush(size) {
    player.brushSize = +size;
    globals.fxRenderer.needRender = true;

    globals.renderer.preRenderBrush();

    $('#brushSizeCounter').text(size - 1);
}

export function togglePlaced(state) {
    state ? $('#placedPixels').show() : $('#placedPixels').hide();
}

export function updatePlaced(count, handCount) {
    // FIXME: move it to interval?
    $('#placedPixels').text(count);
    if (handCount)
        $('#placedPixels').attr('title', handCount);
}

let lastPlaced = player.placedCount;
setInterval(() => {
    if (lastPlaced !== player.placedCount) {
        setLS('placedCount', player.placedCount, true);
        lastPlaced = player.placedCount;
    }
}, 3000);

export default player;