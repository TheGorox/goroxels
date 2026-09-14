import { emitter } from './events.js';
import { persistent, persistentPerCanvas } from './stores/persistent.svelte.js';
import Bucket from './utils/Bucket.js';

class Player {
    palette = null;

    maxPlaced = persistent('maxPlaced', 5000);
    maxActions = persistent('maxActions', 5);
    
    primaryCol = null;
    seconaryCol = null;
    brushSize = null;

    nickname = $state('');
    socketId = $state(-1);
    isGuest = $state(true);

    x = $state(0);
    y = $state(0);
    suspendedClrs = $state(null);     
    placed = $state([]);             
    bucket = $state(null);         

    init() {
        // this.primaryCol = persistentPerCanvas('color1', -1);
        this.primaryCol = persistentPerCanvas('color1', 0);
        this.seconaryCol = persistentPerCanvas('color2', -1);
        this.brushSize = persistentPerCanvas('brushSize', 1);

        emitter.on('sock.me', user => {
            this.socketId = user.id;
            this.nickname = user.nick ?? null;
            this.isGuest = !(user.registered ?? false);
        });
    }

    switchColor(id) {
        if (!this.primaryCol || !this.seconaryCol) return;

        if (this.seconaryCol.v === id && id !== -1) this.switchSecondColor(-1);
        if (this.primaryCol.v === id) id = -1;
        this.primaryCol.v = id;

        const core = useGameCore();
        core.requestRender?.();
    }

    getColorByCoord(x, y){
        let col1 = player.primaryCol?.v ?? -1;
        let col2 = player.seconaryCol?.v ?? -1;

        if (col1 === -1 && col2 !== -1) {
            col1 = col2;
        } else if (col2 === -1 && col1 !== -1) {
            col2 = col1;
        } else if (col1 === -1 && col2 === -1) {
            return -1;
        }

        return ((x + y) % 2) === 0 ? col1 : col2;
    }

    switchSecondColor(id) {
        if (!this.primaryCol || !this.seconaryCol) return;

        if (this.primaryCol.v === id && id !== -1) this.switchColor(-1);
        if (this.seconaryCol.v === id) id = -1;
        this.seconaryCol.v = id;
    }

    swapColors() {
        if (!this.primaryCol || !this.seconaryCol) return;

        const temp = this.primaryCol.v;
        this.switchColor(this.seconaryCol.v);
        this.switchSecondColor(temp);
    }

    suspendColors() {
        if (!this.primaryCol || !this.seconaryCol) return;

        this.suspendedClrs = [this.primaryCol.v, this.seconaryCol.v];
        this.primaryCol.v = -1;
        this.seconaryCol.v = -1;
    }

    restoreColors() {
        if (!this.suspendedClrs) return;
        
        this.switchColor(this.suspendedClrs[0]);
        this.switchSecondColor(this.suspendedClrs[1]);
        this.suspendedClrs = null;
    }

    updateBucket(delay, max) {
        this.bucket = new Bucket(delay, max);
    }
}

export const player = new Player();