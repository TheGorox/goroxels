export let initiated = false;
export let database = null;

let deferredCallbacks = [];

export function init() {
    let openRequest = indexedDB.open("db", 1);

    function onDone(){
        initiated = true;
        execCallbacks();
    }

    openRequest.onupgradeneeded = function () {
        database = openRequest.result;
        if (!database.objectStoreNames.contains('chunkPlaceholders')) {
            database.createObjectStore('chunkPlaceholders', { keyPath: 'chunk_key' });
        }

        onDone();
    };

    openRequest.onsuccess = () => {
        database = openRequest.result;
        onDone();
    };
}

function execCallbacks(){
    deferredCallbacks.forEach(cb => {
        try {
            cb(database);   
        } catch (error) {
            console.error(error);
        }
    })
    deferredCallbacks.length = 0;
}

export function addInitCallback(cb) {
    if (initiated) {
        cb(database);
        return;
    }

    deferredCallbacks.push(cb);
}