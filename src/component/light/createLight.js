import * as graphic from 'echarts/lib/util/graphic';
import { parsePercent } from 'echarts/lib/util/number';
import cloneGraphic from '../../util/cloneGraphic';

/**
 * 创建光效效果，根据光效图片组成可视区域粒子
 * 1、区分横向纵向
 *     横向纵向决定光效图片是否旋转90
 * 2、区分正向还是负向
 *     光效运行启起点不一样
 * @param {*} layout
 * @param {*} symbol
 * @param {*} offset
 * @param {*} isHorizontal
 */
export default function createLight(layout, symbol, offset, isHorizontal) {
    const group = new graphic.Group();
    const newSymbol = cloneGraphic(symbol);
    const realWidth = isHorizontal
        ? Math.abs(layout.width)
        : Math.abs(layout.height); // 光效实际宽度
    const { width, height } = symbol.style;
    const scale = realWidth / width; // 光效图片缩放比例
    const offsetX = parsePercent(offset[0], width) * scale;
    const offsetY = parsePercent(offset[1], height) * scale;


    newSymbol.attr('x', isHorizontal ? offsetX : offsetY);
    newSymbol.scaleX = scale;
    newSymbol.scaleY = scale;

    group.add(newSymbol);

    return group;
}
