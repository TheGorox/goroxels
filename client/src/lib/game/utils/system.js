export function isMobile() {
    const mobRegEx = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return navigator.userAgentData?.mobile ||
        mobRegEx.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth <= 1024);
}

export function getPathsafeDate() {
    const date = new Date;

    const day = date.getDate().toString().padStart(2, '0'); // convert "1"s to "01"s
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const today = `${day}.${month}.${year}`;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const time = `${hours}-${minutes}-${seconds}`;

    return `${today} - ${time}`
}