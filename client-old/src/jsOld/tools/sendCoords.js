import { mobile } from "./toolUtils";
import chat from '../Chat';
import Tool from '../Tool';
import { chatInput } from '../ui/elements';


const cordAdd = new Tool('coords to chat', 'KeyU');
cordAdd.on('up', function () {
    const cords = $('#coords').text();
    if (!cords.length) return;
    chatInput[0].value += cords + ' ';
    if (mobile) {
        chat.mobileShow();
    }
    chatInput.trigger('focus');
});
export default cordAdd;