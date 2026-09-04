export async function getJson(resp){
    const json = await resp.json();
    
    if(json.errors) return null;
    return json;
}