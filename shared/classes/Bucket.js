class Bucket{
    constructor(delay, max, filledInitially = false){
        this._allowance = filledInitially ? max : 0;

        this.delay = delay;
        // "lost pixel" workaround
        this.max = max+1;

        this.lastCheck = Date.now();
    }

    get allowance () {
        if(this.delay === 0) return Infinity;

        const now = Date.now();
        
        this._allowance += (now - this.lastCheck) / this.delay;

        this.lastCheck = now;

        if(this._allowance > this.max) this._allowance = this.max;

        return this._allowance
    }

    set allowance(c){
        this._allowance = c;
    }

    spend(count){
        if(this.delay === 0) return true;

        let allow = this.allowance;

        if(allow < count) return false;

        this.allowance  = allow - count;

        return true
    }
}

export default Bucket;