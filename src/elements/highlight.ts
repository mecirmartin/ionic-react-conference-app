import { areaStyle, xStyle, yStyle, getOffset } from "../util/higlight";


export function highlight(element: EventTarget) {
    const dom = {
        area: document.createElement("div"),
        x: document.createElement("div"),
        y: document.createElement("div"),
    };
    Object.assign(dom.area.style, areaStyle);

    Object.assign(dom.x.style, xStyle);

    Object.assign(dom.y.style, yStyle);
    if (!element) {
        dom.area.remove();
        dom.x.remove();
        dom.y.remove();
        return;
    }

    const box = getOffset(element);
    Object.assign(dom.area.style, {
        top: box.top + "px",
        left: box.left + "px",
        width: box.width + "px",
        height: box.height + "px",
    });
    document.body.append(dom.area);

    Object.assign(dom.x.style, {
        top: box.top + "px",
        height: box.height + "px",
    });
    document.body.append(dom.x);

    Object.assign(dom.y.style, {
        left: box.left + "px",
        width: box.width + "px",
    });
    document.body.append(dom.y);
}