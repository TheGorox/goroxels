export function processApiErrors(errors) {
    if (!errors) return;
    if (Array.isArray(errors)) {
        return errors.map(processApiErrors);
    }

    const error = errors;
    let msg;
    if (typeof error === 'object') {
        msg = `[${error.path}] ${error.msg}`;
    } else {
        msg = error;
    }

    toastr.error(msg, undefined, {
        preventDuplicates: true
    });
}
export async function apiRequest(path, config = {}) {
    // handle json body of request
    if (config.body && typeof config.body === 'object') {
        if (!config.headers) config.headers = {};

        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(config.body);
    }
    const response = await fetch('/api' + path, config);

    if (response.headers.get('Content-Type') && response.headers.get('Content-Type').includes('application/json')) {
        try {
            const json = await response.json()

            if (json.errors) {
                processApiErrors(json.errors);
            }

            response.json = () => json;
        } catch (e) { }
    }

    return response
}

export async function fetchCaptcha() {
    const resp = await apiRequest('/captcha/get');
    return await resp.text()
}

export async function solveCaptcha(answer) {
    const resp = await apiRequest('/captcha/solve', {
        method: 'POST',
        body: { answer }
    });

    const json = await resp.json();

    if (json.success !== undefined)
        return json.success;

    return false
}

