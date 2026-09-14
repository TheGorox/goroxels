<script>
    import { onMount } from 'svelte';
	import { player } from '../../game/player.svelte';

    let fps = $state(0);
    let frameTime = $state(0);
    let memory = $state({ used: 0, total: 0 });
    let lastTime = performance.now();
    let frames = 0;
    
    let statedBucketAllowance = $state(0);
    function updateMetrics() {
        const now = performance.now();
        frames++;

        if (now >= lastTime + 1000) {
            fps = Math.round((frames * 1000) / (now - lastTime));
            frameTime = (1000 / fps).toFixed(2);
            frames = 0;
            lastTime = now;

            if (performance.memory) {
                memory = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                    total: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
                };
            }
        }

        statedBucketAllowance = player.bucket?._allowance.toFixed(0) ?? '??';

        requestAnimationFrame(updateMetrics);
    }


    onMount(() => {
        const handle = requestAnimationFrame(updateMetrics);

        const bucketUpdateInterval = setInterval(() => {
            player.bucket?.allowance;
        }, 300);
        return () => {
            cancelAnimationFrame(handle);
            clearInterval(bucketUpdateInterval);
        }
    });
</script>

<div class="metrics-panel">
    <div class="metric">
        <span class="label">FPS:</span>
        <span class="value" class:low={fps < 30} class:mid={fps >= 30 && fps < 55}>{fps}</span>
    </div>
    <div class="metric">
        <span class="label">Frame:</span>
        <span class="value">{frameTime}ms</span>
    </div>
    {#if memory.total > 0}
        <div class="metric">
            <span class="label">RAM:</span>
            <span class="value">{memory.used} / {memory.total} MB</span>
        </div>
    {/if}
    <hr>
    <div class="metric">
        <span class="label">Bucket:</span>
        <span class="value">{statedBucketAllowance}</span>
    </div>
</div>

<style>
    .metrics-panel {
        position: fixed;
        top: 10px;
        left: 108px;
        background: rgba(0, 0, 0, 0.7);
        color: #00ff00;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        z-index: 9999;
        pointer-events: none;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .metric {
        display: flex;
        justify-content: space-between;
        gap: 15px;
    }

    .label {
        color: #aaa;
    }

    .value.low { color: #ff4444; }
    .value.mid { color: #ffbb33; }
</style>