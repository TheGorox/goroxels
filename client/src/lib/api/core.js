import { t } from "../i18n/translate.svelte";
import { notify } from "../toast";

export async function apiGet(path, config={}) {
    return await apiRequest(path, config);
}

export async function apiPost(path, body, config = {}) {
    config.method = 'POST';
    
    if (typeof body === 'object' && body !== null) {
        if (!config.headers) config.headers = {};

        if (config.isForm) {
            const formData = new FormData();
            
            for (const [key, value] of Object.entries(body)) {
                    formData.append(key, value);
            }
            
            config.body = formData;
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        }
    } else if (typeof body === 'string') {
        config.body = body;
    } else {
        throw new Error(`unexpected body: ${body}(${typeof body})`);
    }

    return await apiRequest(path, config);
}

async function apiRequest(path, config) {
    if(config.noCache === true){
        delete config.noCache;

        // completely disable cache if requested
        Object.assign(config, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    }
    
    try {
        const response = await fetch('/api' + path, config);

        if (response.headers.get('Content-Type') && response.headers.get('Content-Type').includes('application/json')) {
            const json = await response.json()
            
            if (json.errors) {
                processApiErrors(json.errors);
            }

            response.json = () => json;
        }

        return response;
    } catch (error) {
        notify.apiError(t(error.message));
        throw error;
    }
}

function processApiErrors(errors){
    for(const error of errors){
        notify.apiError(t(`${error?.msg || error}`));
    }
}