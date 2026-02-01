import player from '../player';
import Tool from '../Tool';

export const colorSwap = new Tool('swap colors', 'KeyX');
colorSwap.on('up', player.swapColors.bind(player));

export default colorSwap;