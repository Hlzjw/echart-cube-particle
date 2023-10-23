import * as graphic from 'echarts/lib/util/graphic';

export const Cylinder = graphic.extendShape({
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        horizontal: true
    },
    buildPath(ctx, shape) {
        const k = 0.5522848;
        const { x, y, width, height, horizontal } = shape;

        if (horizontal) {
            const w = horizontal ? width : height;
            const rx = w / 2;
            const ry = w / 8;
            const cx = x + rx;
            const cy = y - ry;
            const cy1 = height < 0 ? cy + height : cy;
            const cy2 = cy + height;
            const ox = rx * k; // 水平控制点偏移量
            const oy = ry * k; // 垂直控制点偏移量

            ctx.moveTo(cx - rx, cy1);
            ctx.bezierCurveTo(cx - rx, cy1 - oy, cx - ox, cy1 - ry, cx, cy1 - ry);
            ctx.bezierCurveTo(cx + ox, cy1 - ry, cx + rx, cy1 - oy, cx + rx, cy1);
            ctx.bezierCurveTo(cx + rx, cy1 + oy, cx + ox, cy1 + ry, cx, cy1 + ry);
            ctx.bezierCurveTo(cx - ox, cy1 + ry, cx - rx, cy1 + oy, cx - rx, cy1);

            ctx.moveTo(cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy + oy, cx - ox, cy + ry, cx, cy + ry);
            ctx.bezierCurveTo(cx + ox, cy + ry, cx + rx, cy + oy, cx + rx, cy);
            ctx.lineTo(cx + rx, cy2);
            ctx.bezierCurveTo(cx + rx, cy2 + oy, cx + ox, cy2 + ry, cx, cy2 + ry);
            ctx.bezierCurveTo(cx - ox, cy2 + ry, cx - rx, cy2 + oy, cx - rx, cy2);
        }
        else {
            const w = horizontal ? width : height;
            const rx = w / 8;
            const ry = w / 2;
            const cx = x + rx;
            const cy = y + ry;
            const cx1 = cx + width;
            const cx2 = width > 0 ? cx + width : cx;
            const ox = rx * k; // 水平控制点偏移量
            const oy = ry * k; // 垂直控制点偏移量

            ctx.moveTo(cx, cy - ry);
            ctx.bezierCurveTo(cx - ox, cy - ry, cx - rx, cy - oy, cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy + oy, cx - ox, cy + ry, cx, cy + ry);
            ctx.lineTo(cx1, cy + ry);
            ctx.bezierCurveTo(cx1 - ox, cy + ry, cx1 - rx, cy + oy, cx1 - rx, cy);
            ctx.bezierCurveTo(cx1 - rx, cy - oy, cx1 - ox, cy - ry, cx1, cy - ry);
            ctx.lineTo(cx, cy - ry);

            ctx.moveTo(cx2, cy - ry);
            ctx.bezierCurveTo(cx2 - ox, cy - ry, cx2 - rx, cy - oy, cx2 - rx, cy);
            ctx.bezierCurveTo(cx2 - rx, cy + oy, cx2 - ox, cy + ry, cx2, cy + ry);
            ctx.bezierCurveTo(cx2 + ox, cy + ry, cx2 + rx, cy + oy, cx2 + rx, cy);
            ctx.bezierCurveTo(cx2 + rx, cy - oy, cx2 + ox, cy - ry, cx2, cy - ry);
        }

        ctx.closePath();
    }
});

export const Mask = graphic.extendShape({
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        horizontal: true // 是否竖向
    },

    buildPath(ctx, shape) {
        const k = 0.5522848;
        const { x, y, width, height, horizontal } = shape;

        if (horizontal) {
            const w = horizontal ? width : height;
            const rx = w / 2;
            const ry = w / 8;
            const cx = x + rx;
            const cy = y - ry;
            const cy2 = cy + height;
            const ox = rx * k; // 水平控制点偏移量
            const oy = ry * k; // 垂直控制点偏移量

            ctx.moveTo(cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy + oy, cx - ox, cy + ry, cx, cy + ry);
            ctx.bezierCurveTo(cx + ox, cy + ry, cx + rx, cy + oy, cx + rx, cy);
            ctx.lineTo(cx + rx, cy2);
            ctx.bezierCurveTo(cx + rx, cy2 + oy, cx + ox, cy2 + ry, cx, cy2 + ry);
            ctx.bezierCurveTo(cx - ox, cy2 + ry, cx - rx, cy2 + oy, cx - rx, cy2);
        }
        else {
            const w = horizontal ? width : height;
            const rx = w / 8;
            const ry = w / 2;
            const cx = x + rx;
            const cy = y + ry;
            const cx1 = cx + width;
            const ox = rx * k; // 水平控制点偏移量
            const oy = ry * k; // 垂直控制点偏移量

            ctx.moveTo(cx, cy - ry);
            ctx.bezierCurveTo(cx - ox, cy - ry, cx - rx, cy - oy, cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy + oy, cx - ox, cy + ry, cx, cy + ry);
            ctx.lineTo(cx1, cy + ry);
            ctx.bezierCurveTo(cx1 - ox, cy + ry, cx1 - rx, cy + oy, cx1 - rx, cy);
            ctx.bezierCurveTo(cx1 - rx, cy - oy, cx1 - ox, cy - ry, cx1, cy - ry);
            ctx.lineTo(cx, cy - ry);
        }

        ctx.closePath();
    }
});

export const OutLine = graphic.extendShape({
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        horizontal: true // 是否竖向
    },

    buildPath(ctx, shape) {
        const k = 0.5522848;
        const { x, y, width, height, horizontal } = shape;

        if (horizontal) {
            const w = width;
            const rx = w / 2;
            const ry = w / 8;
            const cx = x + rx;
            const cy = y - ry;
            const cy2 = cy - height;
            const ox = rx * k; // 水平控制点偏移量
            const oy = ry * k; // 垂直控制点偏移量

            ctx.moveTo(cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy + oy, cx - ox, cy + ry, cx, cy + ry);
            ctx.bezierCurveTo(cx + ox, cy + ry, cx + rx, cy + oy, cx + rx, cy);
            ctx.lineTo(cx + rx, cy2);
            ctx.bezierCurveTo(cx + rx, cy2 + oy, cx + ox, cy2 + ry, cx, cy2 + ry);
            ctx.bezierCurveTo(cx - ox, cy2 + ry, cx - rx, cy2 + oy, cx - rx, cy2);
        }
        else {
            const w = height;
            const rx = w / 8;
            const ry = w / 2;
            const cx = x + rx;
            const cy = y + ry;
            const cx1 = cx + width;
            const ox = rx * k; // 水平控制点偏移量
            const oy = ry * k; // 垂直控制点偏移量

            ctx.moveTo(cx, cy - ry);
            ctx.bezierCurveTo(cx - ox, cy - ry, cx - rx, cy - oy, cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy + oy, cx - ox, cy + ry, cx, cy + ry);
            ctx.lineTo(cx1, cy + ry);
            ctx.bezierCurveTo(cx1 - ox, cy + ry, cx1 - rx, cy + oy, cx1 - rx, cy);
            ctx.bezierCurveTo(cx1 - rx, cy - oy, cx1 - ox, cy - ry, cx1, cy - ry);
            ctx.lineTo(cx, cy - ry);
        }
    }
});
