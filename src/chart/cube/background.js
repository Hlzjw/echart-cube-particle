import createElement from './createElement';

export function getBackgroundLayout(coord, layout, horizontal) {
    const rectShape = layout;
    const coordLayout = coord.getArea();

    const height = horizontal ? rectShape.height <= 0
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
    angle,
    backgroundModel,
    horizontal,
    clip
) {
    const layout = data.getItemLayout(dataIndex);

    if (clip) {
        clip(layout);
    }

    const backgroundLayout = getBackgroundLayout(coord, layout, horizontal);

    const style = backgroundModel.getItemStyle();

    const bgEl = createElement(
        backgroundLayout,
        backgroundModel,
        angle,
        horizontal
    );

    bgEl.useStyle = (sty) => {
        const cube = bgEl.childAt(0);
        const leftFace = bgEl.childAt(1);
        const rect = bgEl.childAt(2);

        cube.z2 = 0;
        cube.silent = false;
        leftFace.z2 = 0;
        leftFace.silent = false;

        cube.useStyle({
            ...sty,
            lineJoin: 'round'
        });

        leftFace.useStyle({
            fill: 'rgba(0,0,0,1)',
            opacity: 0.1
        });

        rect.useStyle({
            fill: 'rgba(0,0,0,0)',
            opacity: 0
        });
    };

    bgEl.useStyle(style);

    return bgEl;
}
