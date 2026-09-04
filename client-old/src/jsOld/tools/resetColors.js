import player from '../player';
import Tool from '../Tool';


const resetColors = new Tool('reset colors', 'RMB');
resetColors.on('up', () => {
    player.resetColors();
});
export default resetColors;