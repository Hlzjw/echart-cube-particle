export default function animator(
    group,
    light,
    el,
    clip,
    animeType,
    timeRatio,
    isHorizontal
) {
    const rect = light.getBoundingRect();
    const shape = el.getBoundingRect();

    switch (animeType) {
    // 向上再向下
    case 'updown': {
        const { x } = shape;
        const y = shape.y + (isHorizontal ? shape.height : 0);

        group.x = x;
        group.y = y;

        group.setClipPath(clip);

        const distance = isHorizontal
            ? rect.height + shape.height
            : rect.height + shape.width;
        const time = timeRatio * Math.abs(distance);
        const positionX = isHorizontal ? 0 : distance;
        const positionY = isHorizontal ? -distance : 0;

        light
            .animate('position', true)
            .when(time, [positionX, positionY])
            .when(2 * time, [0, 0])
            .start();

        break;
    }

    // 向下再向上
    case 'downup': {
        const x = shape.x + (isHorizontal ? 0 : rect.height + shape.width);
        const y = shape.y + (isHorizontal ? -rect.height : 0);

        group.x = x;
        group.y = y;

        clip.x = isHorizontal ? 0 : -(rect.height + shape.width);
        clip.y = isHorizontal ? rect.height + shape.height : 0;

        group.setClipPath(clip);

        const distance = isHorizontal
            ? rect.height + shape.height
            : rect.height + shape.width;
        const time = timeRatio * Math.abs(distance);
        const positionX = isHorizontal ? 0 : -distance;
        const positionY = isHorizontal ? distance : 0;

        light
            .animate('position', true)
            .when(time, [positionX, positionY])
            .when(2 * time, [0, 0])
            .start();
        break;
    }

    case 'down': {
        const x = shape.x + (isHorizontal ? 0 : rect.height + shape.width);
        const y = shape.y + (isHorizontal ? -rect.height : 0);

        group.x = x;
        group.y = y;

        clip.x = isHorizontal ? 0 : -(rect.height + shape.width);
        clip.y = isHorizontal ? rect.height + shape.height : 0;

        group.setClipPath(clip);

        const distance = isHorizontal
            ? rect.height + shape.height
            : rect.height + shape.width;
        const time = timeRatio * Math.abs(distance);
        const positionX = isHorizontal ? 0 : -distance;
        const positionY = isHorizontal ? distance : 0;

        light
            .animate('position', true)
            .when(time, [positionX, positionY])
            .start();

        break;
    }

    default: {
        const { x } = shape;
        const y = shape.y + (isHorizontal ? shape.height : 0);

        group.x = x;
        group.y = y;

        group.setClipPath(clip);

        const distance = isHorizontal
            ? rect.height + shape.height
            : rect.height + shape.width;
        const time = timeRatio * Math.abs(distance);
        const positionX = isHorizontal ? 0 : distance;
        const positionY = isHorizontal ? -distance : 0;

        light
            .animate('position', true)
            .when(time, [positionX, positionY])
            .start();
    }
    }
}
