import { apiPost } from "./core";

// check whick chunks was changed from the last time
export async function changeName(newName) {
    const resp = await apiPost(`/changename`, {
        name: newName
    });

    const respData = await resp.json();
    if (respData.errors) return false;

    return true
}