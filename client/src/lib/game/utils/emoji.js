let canvas;
let ctx;
let refEmojiWidth;
let refBrokenWidth;

export function isEmojiSupported(emoji) {
    if (!canvas) {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        ctx.font = '32px sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"';
        refEmojiWidth = ctx.measureText('😀').width;
        refBrokenWidth = ctx.measureText('\uFFFF').width;
    }

    const emojiWidth = ctx.measureText(emoji).width;

    return emojiWidth !== refBrokenWidth && emojiWidth / refEmojiWidth < 1.5;
}

export function animateEmoji(emojiContainer, timeSeconds=1, withCross=false) {
    const floatingBlock = document.createElement('div');
    floatingBlock.style = 'position: absolute; pointer-events: none; z-index: 999999999999; margin: 0; padding: 0; background: none; border: none';
    floatingBlock.innerText = emojiContainer.innerText;
    floatingBlock.popover = 'manual';

    if (withCross) {
        floatingBlock.style.background = `
            linear-gradient(to top right, transparent calc(50% - 1px), red 50%, transparent calc(50% + 1px)),
            linear-gradient(to bottom right, transparent calc(50% - 1px), red 50%, transparent calc(50% + 1px))
        `;
    }

    floatingBlock.style.fontSize = window.getComputedStyle(emojiContainer).fontSize;
    document.body.appendChild(floatingBlock);
    floatingBlock.showPopover();

    const bb = emojiContainer.getBoundingClientRect();

    let progress = 0;
    const progressFactor = 1 / (timeSeconds*1000);
    const movingFactor = 0.1;

    let x = bb.x;
    let y = bb.y;

    let ts = Date.now();
    function render(){
        const now = Date.now();
        const ela = now - ts;
        ts = now;

        progress += ela * progressFactor;
        floatingBlock.style.opacity = 1 - progress;

        y -= ela * movingFactor;

        console.log({x, y, progress})

        floatingBlock.style.top = y + 'px';
        floatingBlock.style.left = x + 'px';

        if(progress < 1){
            requestAnimationFrame(render);
        }else{
            floatingBlock.hidePopover();
            floatingBlock.remove();
        }
    }
    render();
}