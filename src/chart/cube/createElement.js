import { Group, Rect } from 'echarts/lib/util/graphic';
import { Cube, Mask, OutLine } from './graphic';
import { getLineWidth } from '../helper/getBarLayout';
import { getLabelLayout } from './layout';

/**
 * 创建元素
 */
export default function createElement(
    layout,
    itemModel,
    angle = 0,
    isHorizontal,
    animationModel
) {
    const group = new Group();

    const cube = new Cube({
        shape: {
            ...layout,
            angle,
            horizontal: isHorizontal
        },
        z2: 1
    });

    const mask = new Mask({
        silent: true,
        shape: {
            ...layout,
            lineWidth: getLineWidth(itemModel),
            angle,
            horizontal: isHorizontal
        },
        z2: 1
    });

    const rect = new Rect({
        silent: true,
        style: {
            fill: 'transparent',
            opacity: 0
        },
        shape: {
            ...getLabelLayout({
                ...layout,
                angle,
                horizontal: isHorizontal
            })
        },
        z2: 1
    });

    if (animationModel) {
        const animateProperty = isHorizontal ? 'height' : 'width';
        cube.shape[animateProperty] = 0;
        mask.shape[animateProperty] = 0;
        rect.shape[animateProperty] = 0;
    }

    group.__createClipPath = (shape) => new OutLine({
        shape: {
            ...shape,
            height: Math.abs(layout.height),
            width: Math.abs(layout.width),
            angle,
            horizontal: isHorizontal
        }
    });

    group.add(cube);
    group.add(mask);
    group.add(rect);

    return group;
}
