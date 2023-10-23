import * as graphic from 'echarts/lib/util/graphic';
import cloneGraphic from '../../util/cloneGraphic';
import checkPropertiesNotValid from '../../util/checkPropertiesNotValid';

function checkLayoutNotValid(layout) {
    return checkPropertiesNotValid(layout, ['x', 'y', 'width', 'height']);
}

/**
 * 创建粒子效果，根据粒子图片组成可视区域粒子
 * 1、区分横向纵向
 *     横向纵向决定粒子图片是否旋转90
 * 2、区分正向还是负向
 *     粒子运行启起点不一样
 * @param {*} layout
 * @param {*} symbol
 * @param {*} isHorizontal
 */
export default function createParticle(layout, symbol, isHorizontal) {
    const group = new graphic.Group();

    // 判断布局是否合法
    if (checkLayoutNotValid(layout)) {
        return;
    }

    const limitHeight = isHorizontal ? Math.abs(layout.height) : Math.abs(layout.width); // 限制高度
    const realWidth = isHorizontal ? Math.abs(layout.width) : Math.abs(layout.height); // 粒子实际宽度

    const { width, height } = symbol.style;
    const scale = realWidth / width; // 粒子图片缩放比例
    const realHeight = height * scale; // 粒子实际高度

    // 判断限制高度需要多少个粒子图片
    for (let i = 0, len = Math.ceil(limitHeight / realHeight); i < len; i++) {
        let newSymbol = cloneGraphic(symbol);

        newSymbol.scaleX = scale;
        newSymbol.scaleY = scale;
        newSymbol.x = 0;
        newSymbol.y = i * realHeight;
        group.add(newSymbol);
    }

    return group;
}
