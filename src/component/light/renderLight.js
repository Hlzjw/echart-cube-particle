import * as graphic from 'echarts/lib/util/graphic';
import createLight from './createLight';
import elementRendered from '../../util/elementRendered';
import cloneGraphic from '../../util/cloneGraphic';
import animator from './animator';

function clamp(min, max, value) {
    return Math.min(Math.max(min, value || 0), max);
}

/**
 * 渲染光效
 * @param {*} group
 * @param {*} serieModel
 * @param {*} lightModel
 * @param {*} dataIndex
 * @param {*} el
 * @param {*} symbol
 * @param {*} isHorizontal
 */
export default function renderLight(
    group,
    serieModel,
    lightModel,
    dataIndex,
    el,
    symbol,
    isHorizontal
) {
    const lightGroup = new graphic.Group();
    const data = serieModel.getData();
    const layout = data.getItemLayout(dataIndex);

    if (!layout) {
        return;
    }

    const offset = lightModel.get('offset');
    const light = createLight(layout, symbol, offset, isHorizontal);
    const animeType = lightModel.get('animeType'); // 动画类型
    const times = lightModel.get('time');
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    // 最终速率是最大值减最小值差值随机值+最小值
    const distTime = maxTime - minTime;
    const timeRatio = 500 / clamp(1, 100, minTime + distTime * Math.random());

    // 横向时需要旋转图片
    light.rotation = isHorizontal ? 0 : -Math.PI / 2;

    lightGroup.add(light);

    elementRendered(el).then(() => {
        const shape = el.getBoundingRect();
        let clip;

        if (el.__createClipPath) {
            clip = el.__createClipPath({
                ...shape,
                x: 0,
                y: 0
            }, layout);
        }
        else if (el.__pictorialMainPath) {
            clip = cloneGraphic(el.__pictorialMainPath);
        }
        else {
            clip = new graphic.Rect({
                shape: {
                    ...shape,
                    x: 0,
                    y: isHorizontal ? -shape.height : 0
                }
            });
        }

        animator(lightGroup, light, el, clip, animeType, timeRatio, isHorizontal);

        group.add(lightGroup);
    });
}
