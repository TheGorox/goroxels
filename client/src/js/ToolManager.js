import EventEmitter from 'events';
import globals from './globals';
import tools from './tools';
import camera from './camera';
import player from './player';
import {
    screenToBoardSpace
} from './utils/conversions';
import {
    insanelyLongMobileBrowserCheck,
    stringifyKeyEvent,
    decodeKey
} from './utils/misc';
import { getLS, setLS } from './utils/localStorage';
import me from './me';
import { coords as coordsEl } from './ui/elements';

import downArrow from '../img/arrow.svg';

const coords = coordsEl[0];

function updatePlayerCoords(clientX, clientY) {
    let [newX, newY] = screenToBoardSpace(clientX, clientY);

    if (newX === player.x && newY === player.y) {
        return
    }

    player.x = newX;
    player.y = newY;

    coords.innerText = `(${player.x}, ${player.y})`

    if (player.color != -1 && camera.zoom > 1)
        globals.renderer.needRender = true;
}

const isMobile = insanelyLongMobileBrowserCheck();

export default class ToolManager extends EventEmitter {
    constructor() {
        super();

        this.tools = tools;
        this.tool = tools.mover;

        this._keyBinds = {};
        this._colorBinds = {};
        this.activeTools = {};

        this.addTools();
        this.loadBinds();
        this.initEvents();

        this.ctrlDown = false;
        this.altDown = false;

        this.toolChangeBlocked = false;

        me.callOnLoaded(this.filterTools.bind(this));
    }

    filterTools() {
        Object.keys(this.tools).forEach(name => {
            if (this.tools[name].requiredRole > me.role) {
                delete this._keyBinds[this.tools[name].key];

                if (isMobile) {
                    $(`#tool_${name}`).remove();
                }
            }
        })
    }

    addTools() {
        const toolsEl = document.getElementById('tools');
        let hiddenToolsEl = null;

        Object.keys(this.tools).forEach(name => {
            const tool = this.tools[name];

            if (isMobile) {
                if (!tool.icon) return;

                let el = document.createElement('div');
                el.classList = 'toolContainer';
                el.id = `tool_${name}`;
                let img = document.createElement('img');
                img.className = 'toolIcon';
                img.src = tool.icon;

                el.appendChild(img);

                if(toolsEl.childElementCount >= 5){
                    if(!hiddenToolsEl){
                        hiddenToolsEl = document.createElement('div');
                        hiddenToolsEl.style.display = 'none';

                        const showAllButton = document.createElement('div');
                        showAllButton.className = 'showAllToolsButton';
                        const showAllImg = document.createElement('img');
                        showAllImg.src = downArrow;

                        showAllButton.append(showAllImg);

                        showAllButton.addEventListener('click', e => {
                            const state = parseInt(showAllButton.dataset.state ?? 0);
                            hiddenToolsEl.style.display = state ? 'none' : '';
                            showAllImg.style.transform = state ? '' : 'rotate(180deg)';
                            showAllButton.dataset.state = state ? '0' : '1';
                        });

                        toolsEl.append(hiddenToolsEl, showAllButton);
                    }

                    hiddenToolsEl.append(el);
                }else{
                    toolsEl.appendChild(el);
                }

                el.addEventListener('pointerdown', this.selectTool.bind(this, tool));

                if (tool.name === 'mover')
                    this.selectTool(tool);
            } else {
                if (player)
                    this._keyBinds[tool.key] = tool;
            }
        })
    }

    getToolKey(tool) {
        for (const [key, value] of Object.entries(this.tools)) {
            if (tool === value) return key;
        }

        return null;
    }

    selectTool(tool) {
        if (this.toolChangeBlocked) return;

        let oldToolEl = document.getElementsByClassName('toolContainer selected')[0]
        if (oldToolEl)
            oldToolEl.className = 'toolContainer';

        const toolKey = this.getToolKey(tool);
        const curToolEl = document.getElementById(`tool_${toolKey}`);
        curToolEl.classList = ['toolContainer selected'];

        this.tool.emit('deselected');
        this.tool = tool;
        this.tool.emit('selected');
    }

    blockToolChange() {
        this.toolChangeBlocked = true;
    }

    unblockToolChange() {
        this.toolChangeBlocked = false;
    }

    initEvents() {
        let em = globals.eventManager;

        if (isMobile) {
            em.on('zoom', zoom => {
                camera.zoom *= zoom + 1;
                camera.checkZoom();
                globals.renderer.needRender = true;
                globals.fxRenderer.needRender = true;
            });

            em.on('mousedown', e => {
                updatePlayerCoords(e.clientX, e.clientY);
            });

            em.on('mousemove', e => {
                updatePlayerCoords(e.clientX, e.clientY);
            });

            let events = [
                ['mousedown', 'down'],
                ['mousemove', 'move'],
                ['mouseup', 'up']
            ];

            events.forEach(event => {
                const [realEvent, myEvent] = event;
                em.on(realEvent, e => {
                    let tool = this.tool;
                    if (e && e.gesture) {
                        this.tool.emit('_gesture');
                        tool = this.tools.mover;
                    }
                    if (!tool) return

                    // emit to selected tool
                    tool.emit(myEvent, e);
                    // emit to other subscribers
                    this.emit(myEvent, e);
                });
            });
        } else {
            em.on('mouseup', e => {
                // if (e.button === 2) {
                //     player.switchColor(-1);
                //     player.switchSecondColor(-1);
                // }
            });
            em.on('mousemove', e => {
                updatePlayerCoords(e.clientX, e.clientY);
                this.tool.emit('move', e);
                this.emit('move', e);
                
            });

            const keydown = (e) => {
                if(globals.lockInputs) return;

                let str = stringifyKeyEvent(e);
                if (!str) return;

                const tool = this._keyBinds[str];

                if (tool) {
                    // TODO
                    this.tool = tool; // костыль, переделать
                    // Как? подписываться на mousemove при down
                    // и отписываться при up
                    tool.emit('down', e);
                }
            }
            em.on('keydown', keydown);
            em.on('mousedown', keydown);


            const keyup = (e) => {
                if(globals.lockInputs) return;

                let strEvKey = stringifyKeyEvent(e);
                if (!strEvKey) return;

                const tool = this._keyBinds[strEvKey];

                for (let name of Object.keys(this.tools)) {
                    const tool2 = this.tools[name];

                    if (!tool2.key || tool2 === tool)
                        continue;

                    const tool2keyDecoded = decodeKey(tool2.key);

                    if (strEvKey === tool2.key || 
                        // make up event on single Alt, because after that keyup on the 
                        // primary key will no longer match the tool key string (i.e. up="V" vs key="ALT+V")
                        
                        (strEvKey.startsWith('Alt') && tool2keyDecoded.alt) || 
                        (strEvKey.startsWith('Ctrl') && tool2keyDecoded.ctrl)) {
                            tool2.emit('up', e)
                        }
                }

                if (tool) {
                    e.preventDefault();
                    e.stopPropagation();

                    tool.emit('up', e);
                }
            }
            em.on('keyup', keyup);
            em.on('mouseup', keyup);

            em.on('wheel', e => {
                const oldZoom = camera.zoom;
                camera.zoomTo(e.deltaY);

                const dx = e.clientX - window.innerWidth / 2;
                const dy = e.clientY - window.innerHeight / 2;

                camera.moveBy((dx / oldZoom), (dy / oldZoom));
                camera.moveBy(-(dx / camera.zoom), -(dy / camera.zoom));

                if (localStorage.getItem('iHaveProblems') === 'yes') {
                    camera.x = Math.round(camera.x); camera.y = Math.round(camera.y);
                    globals.renderer.needRender = true;
                }
            });
        }

        function specKeysHandlers(e) {
            this.ctrlDown = e.ctrlKey;
            this.altDown = e.altKey;
        }

        em.on('keydown', specKeysHandlers.bind(this));
        em.on('keyup', specKeysHandlers.bind(this));

        // TODO: add listener directly to ToolManager, istead of tool itself, avoiding cyclic check
        em.on('tick', e => {
            Object.keys(this.tools).forEach(name => {
                const tool = this.tools[name];
                if (tool.listenerCount('tick') > 0) {
                    tool.emit('tick', e);
                }
            });
        });
    }

    changeKey(tool, key, deleteOld=true) {
        if(deleteOld){
            const oldKey = tool.key;
            delete this._keyBinds[oldKey];
        }

        tool.key = key;
        this._keyBinds[key] = tool
    }

    loadBinds() {
        const str = getLS('keyBinds');
        let newBinds;
        try {
            newBinds = JSON.parse(str);
            if (!newBinds)
                return;
        } catch {
            toastr.error('Error on parsing key binds from local storage');
            localStorage.removeItem('keyBinds');
            return
        }

        // clearing keybinds ahead of time
        // it's not safe to delete them in for loop
        this._keyBinds = {};
        let toolname;
        for (let key of Object.keys(newBinds)) {
            if (toolname = this.findByName(key)){
                this.changeKey(this.tools[toolname], newBinds[key], false);                
            }
        }
    }

    saveBinds() {
        let toSave = {};

        for (const tool of Object.values(tools)) {
            if (!tool.key) continue;

            toSave[tool.name] = tool.key;
        }

        setLS('keyBinds', JSON.stringify(toSave));
    }

    findByName(name) {
        const keys = Object.keys(this.tools);
        return keys.find(key => this.tools[key].name === name)
    }

    initColorBinds() {

    }

    loadColorBinds() {

    }
}