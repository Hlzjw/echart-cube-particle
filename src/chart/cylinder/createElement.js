import { Group } from 'echarts/lib/util/graphic';
import { Cylinder, Mask, OutLine } from './graphic';
import getBarLayout from '../helper/getBarLayout';

export default function (
    layout,
    isHorizontal,
    itemModel,
    animationModel
) {
    const group = new Group();

    const cylinder = new Cylinder({
        shape: {
            ...layout,
            horizontal: isHorizontal
        },
        z2: 1
    });

    const maskLayout = getBarLayout(layout, itemModel);
    const mask = new Mask({
        silent: true,
        shape: {
            ...maskLayout,
            horizontal: isHorizontal
        },
        z2: 1
    });

    if (animationModel) {
        const animateProperty = isHorizontal ? 'height' : 'width';
        cylinder.shape[animateProperty] = 0;
        mask.shape[animateProperty] = 0;
    }

    group.add(cylinder);
    group.add(mask);

    group.useStyle = function (style) {
        const el1 = this.childAt(0);
        const el2 = this.childAt(1);

        el1.useStyle({
            lineJoin: 'round',
            ...style
        });

        el2.useStyle({
            fill: '#000',
            opacity: 0.3
        });
    };

    // 创建剪裁路径
    group.__createClipPath = (shape) =>
    // if (clip) clip(rowLayout);
        new OutLine({
            shape: {
                ...shape,
                height: Math.abs(layout.height),
                width: Math.abs(layout.width),
                horizontal: isHorizontal
            }
        });
    return group;
}
