import emojiOrdered from 'unicode-emoji-json/data-by-group.json';
import { isEmojiSupported } from '../game/utils/emoji';

let emojiLoaded = null;
export function getEmoji(){
    if(!emojiLoaded) loadEmoji();

    return emojiLoaded;
}

function loadEmoji(){
    const allEmoji = emojiOrdered;
    emojiLoaded = emojiOrdered.map(group => filterEmoji(group.emojis.map(e => e.emoji)));
}

function filterEmoji(list){
    return list.filter(e => isEmojiSupported(e));
}