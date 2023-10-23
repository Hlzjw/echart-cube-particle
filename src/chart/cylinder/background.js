import createElement from './createElement';

export function getBackgroundLayout(coord, layout, horizontal) {
    const rectShape = layout;
    const coordLayout = coord.getArea();

    const height = horizontal
        ? rectShape.height <= 0
            ? rectShape.y - coordLayout.y
            : coordLayout.height - rectShape.y + coordLayout.y
        : rectShape.height;

    return {
        x: rectShape.x,
        y: horizontal
            ? rectShape.height <= 0
                ? coordLayout.y
                : rectShape.y
            : rectShape.y,
        width: horizontal
            ? rectShape.width
            : rectShape.width < 0
                ? coordLayout.x - rectShape.x
                : coordLayout.width - rectShape.x + coordLayout.x,
        height
    };
}

export function createBackground(
    coord,
    data,
    dataIndex,
    backgroundModel,
    horizontal,
    clip
) {
    const layout = data.getItemLayout(dataIndex);

    if (clip) {
        clip(layout);
    }

    const backgroundLayout = getBackgroundLayout(coord, layout, horizontal);
    const itemModel = backgroundModel.getModel(['itemStyle']);
    const style = itemModel.getItemStyle();

    const bgEl = createElement(
        backgroundLayout,
        horizontal,
        backgroundModel
    );

    bgEl.useStyle(style);

    const cylinder = bgEl.childAt(0);
    const mask = bgEl.childAt(1);

    cylinder.z2 = 0;
    cylinder.silent = true;
    mask.z2 = 0;
    mask.silent = true;

    return bgEl;
}
