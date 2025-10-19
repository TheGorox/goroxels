export function watchInput(inputElement, callback) {
    inputElement.addEventListener('input', (event) => {
        callback(event.target.value);
    });  
    
    return new Proxy(inputElement, {
        set(target, property, value) {
            if (property === 'value') {
                const oldValue = target.value;
                target[property] = value;
                if (oldValue !== value) {
                    callback(value);
                }
                return true;
            }
            target[property] = value;
            return true;
        },
        get(target, property) {
            if (property === 'value') {
                return target.value;
            }
            return target[property];
        }
    });
}

export function linkNumberRangeInputs(numberInp, rangeInp) {
    numberInp.addEventListener('input', e => rangeInp.value = e.target.value);
    rangeInp.addEventListener('input', e => numberInp.value = e.target.value);
}
