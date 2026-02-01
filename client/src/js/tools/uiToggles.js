import { toggleChat } from '../Chat';
import Tool from '../Tool';
import { toggleEverything, toggleTopMenu } from '../ui/toggles';


export const chatOpac = new Tool('toggle chat', 'KeyK');
chatOpac.on('down', function () {
    toggleChat();
});
export const menuOpac = new Tool('toggle menu', 'KeyL');
menuOpac.on('down', function () {
    toggleTopMenu();
});
export const allOpac = new Tool('toggle everything', 'Semicolon' /* ; */);
allOpac.on('down', function () {
    toggleEverything();
});
