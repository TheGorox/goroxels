import { tools, defaultTool } from './index.js';
import { useGameCore } from '../core.svelte.js';
import { emitter } from '../events.js';
import { tick } from 'svelte';

export function createToolManager() {

    const core = useGameCore();

    let currentTool = $state(defaultTool);

    let activeTools = [];

    function selectTool(tool) {
        currentTool.onDeselected?.();
        console.log(`currentTool=`, tool);
        currentTool = tool;
        tool.onSelected?.();
    }

    function onInputEvent(eventName, e) {
        if (anyInputFocused()) return;

        const activeTool = currentTool;
        // console.log(eventName);

        if (!activeTool) return;

        let isConsumed = false;

        if (eventName === 'pointerdown') {
            isConsumed = activeTool.onDown?.(e) ?? false;
        } else if (eventName === 'pointerup') {
            isConsumed = activeTool.onUp?.(e) ?? false;
        } else {
            isConsumed = activeTool[`on${eventName}`]?.(e) ?? false;
        }


        // there are two modes for events: background and not
        // the first one passes all events as well to every other tool
        // non-backgrould active ones greedly taking all events to themselves
        // why? to allow Mover tool use keybinds to draw lines, squares and so on
        // in the process of moving. that removes stuttering and inconsistency between using tools
        if (activeTool.isBackground) {
            for (const tool of Object.values(tools)) {
                if (tool.name === activeTool.name) continue;

                const isKeydown = eventName === 'keydown';
                const isKeyup = eventName === 'keyup';

                if (isKeydown || isKeyup) {
                    const eventString = stringifyEvent(e);
                    if (!tool.keybind || !compareEventsStrings(tool.keybind, eventString, isKeydown)) {
                        continue;
                    }
                    if (eventName === 'keydown') tool.onDown?.();
                    else tool.onUp?.();
                } else {
                    tool[`on${eventName}`]?.(e);
                }
            }
        } else {
            // ignore the keybinds - toggle the tool by pointer inputs

            for (const tool of Object.values(tools)) {
                if (tool.isBackground) {
                    if (!isConsumed) {
                        if (eventName === 'pointerdown') tool.onDown?.(e);
                        else if (eventName === 'pointerup') tool.onUp?.(e);
                        else tool[`on${eventName}`]?.(e);

                    // some VERY BACKGROUND events that should be fired no matter what, like
                    // mouse pos update
                    } else if (tool?.backgroundToolProps?.nonIntrusiveListeners?.includes(eventName)) {
                        // tool[`on${eventName}`]?.(e, true);
                    }
                }
            }
        }
    }

    const trackedEvents = [
        'pointerdown',
        'pointermove',
        'pointerup',
        'wheel',
        'pointerdrag',
        'pointerpinch',
        'keydown',
        'keyup'
    ];
    trackedEvents.forEach((evName) => {
        emitter.on(evName, (e) => onInputEvent(evName, e));
    });

    for (const tool of Object.values(tools)) {
        tool.core = core;
        tool.init?.();
    }
    tick().then(() => {
        Object.values(tools).forEach(tool => tool.postInit?.());
    })


    // utils
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        return a.every((val, i) => val === b[i]);
    }

    function anyInputFocused() {
        return document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA'
    }

    function getEventKeyCode(ev) {
        let code;
        if (ev instanceof PointerEvent || ev instanceof MouseEvent) {
            const buttonNames = ['LMB', 'MMB', 'RMB', '4MB', '5MB'];
            code = buttonNames[ev.button];
        } else {
            code = ev.code;
        }
        return code;
    }

    function stringifyEvent(e) {
        let code = getEventKeyCode(e);

        let mods = '';
        if (e.ctrlKey) {
            mods += 'CTRL+';
        }
        if (e.altKey) {
            mods += 'ALT+';
        }
        return mods + code;
    }

    // strict mode (more correctly, lack of it) is needed
    // to compare just the keycode. could be hard to disable tool otherwise
    // (you need to hold all mod keys and always release the primary key first)
    function compareEventsStrings(str1, str2, strict = true) {
        if (strict) return str1 === str2;

        const ev1 = parseEvent(str1);
        const ev2 = parseEvent(str2);

        return ev1.code === ev2.code;
    }

    function parseEvent(evStr) {

        const event = {
            alt: false,
            ctrl: false,
            code: null
        }

        evStr.split('+').forEach(param => {
            if (param === 'CTRL') {
                event.ctrl = true;
            } else if (param === 'ALT') {
                event.alt = true;
            } else {
                event.code = param;
            }
        })

        return event
    }

    function* getActiveTools() {
        for (const tool of Object.values(tools)) {
            if (tool.isActive) yield tool;
        }
    }

    function* getRenderingQueue() {
        for (const tool of Object.values(tools)) {
            if (tool.needRender) yield tool;
        }
    }


    return {
        tools,
        get currentTool() { return currentTool },
        getActiveTools,
        getRenderingQueue,
        selectTool
    }
}