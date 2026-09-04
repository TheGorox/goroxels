<script>
    import { untrack } from 'svelte';
    let {
        children,
        sides=$bindable([]),
        radius = '10px',
        topColor = 'var(--bg-light)',
        bottomColor = 'var(--bg-mid-dark)',
        leftColor = 'var(--bg-mid-dark)',
        rightColor = 'var(--bg-light)',
        magnetSides = [],
        disable = false,
        distance = '2px',
        style = ''
    } = $props();
    $effect(() => {
        if (sides === 'both') {
            untrack(() => {
                [topColor, bottomColor] = [bottomColor, topColor];
            });
        }
    });
    const isTopMagnet = $derived(magnetSides.includes('top'));
    const isRightMagnet = $derived(magnetSides.includes('right'));
    const isBottomMagnet = $derived(magnetSides.includes('bottom'));
    const isLeftMagnet = $derived(magnetSides.includes('left'));

</script>
<div
    class="shadowContainer"
    style:--topleft-radius={isLeftMagnet || isTopMagnet ? 0 : radius}
    style:--topright-radius={isRightMagnet || isTopMagnet ? 0 : radius}
    style:--bottomleft-radius={isLeftMagnet || isBottomMagnet ? 0 : radius}
    style:--bottomright-radius={isRightMagnet || isBottomMagnet ? 0 : radius}
    style:--left-padding={sides.includes('left') ? '4px' : '0px'}
    style:--distance={distance}
    {style}
>
    {#if !disable}
        {#if sides.includes('top')}
            <div class="topShadow" style="--top-color: {topColor}"></div>
        {/if}
        {#if sides.includes('left')}
            <div class="leftShadow" style="--left-color: {leftColor}"></div>
        {/if}
        {#if sides.includes('right')}
            <div class="rightShadow" style="--right-color: {rightColor}"></div>
        {/if}
        {#if sides.includes('bottom')}
            <div class="bottomShadow" style="--bottom-color: {bottomColor}"></div>
        {/if}
    {/if}
    {@render children()}
</div>
<style>
    .topShadow,
    .bottomShadow,
    .leftShadow,
    .rightShadow {
        position: absolute;
    }
    .topShadow,
    .bottomShadow {
        width: calc(100% + var(--left-padding));
		left: calc(var(--left-padding) * -1);
        height: 50%;
        border-radius: var(--topleft-radius) var(--topright-radius) var(--bottomright-radius)
            var(--bottomleft-radius);
    }
    .leftShadow,
    .rightShadow {
        width: 50%;
        height: 100%;
        border-radius: var(--topleft-radius) var(--topright-radius) var(--bottomright-radius)
            var(--bottomleft-radius);
    }
    .topShadow {
        z-index: -2;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background-color: var(--top-color);
        transform: translateY(calc(var(--distance) * -1));
    }
    .leftShadow {
        z-index: -1;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-color: var(--left-color);
        transform: translateX(calc(var(--distance) * -1));
    }
    .rightShadow {
        z-index: -3;
        right: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background-color: var(--right-color);
        transform: translateX(var(--distance));
    }
    .bottomShadow {
        z-index: -4;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        background-color: var(--bottom-color);
        transform: translateY(var(--distance));
        top: 50%;
    }
    .shadowContainer {
        width: fit-content;

        position: relative;
        z-index: 0;
    }
</style>