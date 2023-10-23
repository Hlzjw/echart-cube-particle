const DEFAULT_ANGLE = 30; // 默认角度
const DEFAULT_RADIO = 0.66; // 默认占比

/**
 * 获取竖向立方体绘制点位
 * @param {*} layout
 * @param {*} isHorizontal
 */
export function getHCubeLayout(layout) {
    const points = [];
    const { x, y, width, height, angle = 0 } = layout;
    const d = height / Math.abs(height) > 0 ? 0 : 1;
    const a = (angle * Math.PI) / 180;
    const a2 = ((angle || DEFAULT_ANGLE) * Math.PI) / 180;
    const radio = angle ? 0.5 : DEFAULT_RADIO;
    const x1 = x + width * radio;
    const lh = width * (1 - radio) * Math.tan(a);
    const rh = width * (1 - radio) * Math.tan(a2);

    const cf = [];
    cf.push([x1, y]);
    cf.push([x, y - lh]);
    cf.push([x, y + height - lh]);
    cf.push([x1, y + height]);
    cf.push([x1, y]);
    cf.push([x, y - lh]);

    points.push(cf);

    const lf = [];
    lf.push([x1, y]);
    lf.push([x + width, y - rh]);
    lf.push([x + width, y + height - rh]);
    lf.push([x1, y + height]);

    points.push(lf);

    const tf = [];
    tf.push([x1, y + height * d]);
    tf.push([x, y + height * d - lh]);
    tf.push([x + width * (1 - radio), y + height * d - lh - rh]);
    tf.push([x + width, y + height * d - rh]);

    points.push(tf);

    return points;
}

export function getVCubeLayout(layout) {
    const { x, y, width, height, angle = 0 } = layout;
    const points = [];
    const d = width / Math.abs(width) > 0 ? 1 : 0;
    const a = (angle * Math.PI) / 180;
    const a2 = ((angle || DEFAULT_ANGLE) * Math.PI) / 180;
    const radio = angle ? 0.5 : DEFAULT_RADIO;
    const x1 = x;
    const y1 = y + height * radio;
    const lh = height * (1 - radio) * Math.tan(a);
    const rh = height * (1 - radio) * Math.tan(a2);

    const cf = [];
    cf.push([x1, y1]);
    cf.push([x1 + lh, y]);
    cf.push([x1 + width + lh, y]);
    cf.push([x1 + width, y1]);
    cf.push([x1, y1]);
    cf.push([x1 + lh, y]);

    points.push(cf);

    const lf = [];
    lf.push([x1, y1]);
    lf.push([x1 + rh, y + height]);
    lf.push([x1 + width + rh, y + height]);
    lf.push([x1 + width, y1]);

    points.push(lf);

    const tf = [];
    tf.push([x1 + width * d, y1]);
    tf.push([x1 + width * d + rh, y + height]);
    tf.push([x1 + width * d + lh + rh, y + height * (1 - radio)]);
    tf.push([x1 + width * d + lh, y]);

    points.push(tf);

    return points;
}

/**
 * 获取标签显示正面图形layout
 * @param {*} layout
 */
export function getLabelLayout(layout) {
    const { x, y, width, height, angle = 0, horizontal = true } = layout;
    const radio = angle ? 0.5 : DEFAULT_RADIO;

    if (angle) {
        return {
            x,
            y,
            width,
            height
        };
    }

    if (horizontal) {
        const x1 = x + width * radio;

        return {
            x,
            y,
            width: x1 - x,
            height
        };
    }

    const y1 = y + height * radio;

    return {
        x,
        y,
        width,
        height: y1 - y
    };
}

/**
 * 获取横向阴影面绘制点
 * @param {*} layout
 * @returns
 */
export function getHMaskLayout(layout) {
    const { x, y, width, height, angle = 0, lineWidth = 0 } = layout;
    const signX = width > 0 ? 1 : -1;
    const signY = height > 0 ? 1 : -1;
    const a2 = ((angle || DEFAULT_ANGLE) * Math.PI) / 180;
    const radio = angle ? 0.5 : DEFAULT_RADIO;
    const l2 = lineWidth / 2;
    const x1 = x + width * radio + l2;
    const y1 = y - l2 * Math.tan(a2) + l2 * signY;
    const w = Math.abs(width) > lineWidth ? width - signX * lineWidth : 0;
    const h = Math.abs(height) > lineWidth ? height - signY * lineWidth : 0;
    const rh = w * (1 - radio) * Math.tan(a2);

    const lf = [];
    lf.push([x1, y1]);
    lf.push([x + w + l2, y - rh + l2 * signY]);
    lf.push([x + w + l2, y + h - rh + l2 * signY]);
    lf.push([x1, y1 + h]);

    return lf;
}

export function getVMaskLayout(layout) {
    const { x, y, width, height, angle = 0, lineWidth = 0 } = layout;
    const signX = width > 0 ? 1 : -1;
    const signY = height > 0 ? 1 : -1;
    const l2 = lineWidth / 2;
    const a2 = ((angle || DEFAULT_ANGLE) * Math.PI) / 180;
    const radio = angle ? 0.5 : DEFAULT_RADIO;
    const x1 = x + l2 * Math.tan(a2) + l2 * signX;
    const y1 = y + height * radio;
    const w = Math.abs(width) > lineWidth ? width - signX * lineWidth : 0;
    const h = Math.abs(height) > lineWidth ? height - signY * lineWidth : 0;
    const rh = (h * (1 - radio) - lineWidth / 2) * Math.tan(a2);

    const lf = [];
    lf.push([x1, y1 + l2]);
    lf.push([x1 + rh, y + h + l2]);
    lf.push([x1 + w + rh, y + h + l2]);
    lf.push([x1 + w, y1 + l2]);

    return lf;
}

/**
 * 获取裁剪形状
 */
export function getOutLineLayout(layout) {
    const { x, y, width, height, angle = 0, horizontal } = layout;
    const a = (angle * Math.PI) / 180;
    const a2 = ((angle || DEFAULT_ANGLE) * Math.PI) / 180;
    const radio = angle ? 0.5 : DEFAULT_RADIO;
    const d = horizontal ? width : height;
    const x1 = horizontal ? x + width * radio : x;
    const y1 = horizontal ? y : y + height * radio;
    const lh = d * (1 - radio) * Math.tan(a);
    const rh = d * (1 - radio) * Math.tan(a2);

    const ponints = [];

    if (horizontal) {
        ponints.push([x, y - height - lh]);
        ponints.push([x1, y - height]);
        ponints.push([x + width, y - height - rh]);
        ponints.push([x + width, y - rh]);
        ponints.push([x1, y]);
        ponints.push([x, y - lh]);
    }
    else {
        ponints.push([x + width + lh, y]);
        ponints.push([x + width, y1]);
        ponints.push([x + width + rh, y + height]);
        ponints.push([x + rh, y + height]);
        ponints.push([x, y1]);
        ponints.push([x + lh, y]);
    }

    return ponints;
}

export function getBackgroundClipLayout(layout, backgroundLayout) {
    return {
        ...layout,
        height: -backgroundLayout.height
    };
}
