import * as graphic from 'echarts/lib/util/graphic';
import {
    getHCubeLayout,
    getVCubeLayout,
    getHMaskLayout,
    getVMaskLayout,
    getOutLineLayout
} from './layout';

export const Cube = graphic.Path.extend({

    shape: {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        angle: 0,
        horizontal: true
    },

    buildPath(ctx, shape) {
        const { horizontal } = shape;
        const points = horizontal ? getHCubeLayout(shape) : getVCubeLayout(shape);

        for (let i = 0, len = points.length; i < len; i++) {
            const item = points[i];

            ctx.moveTo(...item[0]);
            for (let n = 1, lt = item.length; n < lt; n++) {
                ctx.lineTo(...item[n]);
            }
        }
    }
});

Cube.prototype.type = 'cube';

export const Mask = graphic.extendShape({
    type: 'mask',

    shape: {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        angle: 0,
        horizontal: true
    },

    buildPath(ctx, shape) {
        const { horizontal } = shape;
        const points = horizontal ? getHMaskLayout(shape) : getVMaskLayout(shape);

        ctx.moveTo(...points[0]);
        for (let n = 1, len = points.length; n < len; n++) {
            ctx.lineTo(...points[n]);
        }
        ctx.closePath();
    }
});

export const OutLine = graphic.extendShape({
    shape: {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        angle: 0,
        horizontal: true
    },

    buildPath(ctx, shape) {
        const points = getOutLineLayout(shape);
        ctx.moveTo(...points[0]);

        for (let n = 1, len = points.length; n < len; n++) {
            ctx.lineTo(...points[n]);
        }

        ctx.closePath();
    }
});
