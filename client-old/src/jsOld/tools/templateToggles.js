import template, { updateTemplate } from '../template';
import Tool from '../Tool';


let tempOpacity = template.opacity;
export const templateOp1 = new Tool('template 0/N opaq', 'KeyO');
templateOp1.on('down', () => {
    if (template.opacity == 0) {
        template.opacity = tempOpacity;
    } else {
        tempOpacity = template.opacity;
        template.opacity = 0;
    }
    updateTemplate();
});
export const templateOp2 = new Tool('template 1/N opaq', 'KeyP');
templateOp2.on('down', () => {
    if (template.opacity == 1) {
        template.opacity = tempOpacity;
    } else {
        tempOpacity = template.opacity;
        template.opacity = 1;
    }
    updateTemplate();
});
