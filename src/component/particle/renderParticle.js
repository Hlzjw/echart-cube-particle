import * as graphic from 'echarts/lib/util/graphic';
import createParticle from './createParticle';
import cloneGraphic from '../../util/cloneGraphic';
import elementRendered from '../../util/elementRendered';

function clamp(min, max, value) {
    return Math.min(Math.max(min, value || 0), max);
}

/**
 * 渲染粒子效果
 * @param {*} group
 * @param {*} serieModel
 * @param {*} particleModel
 * @param {*} dataIndex
 * @param {*} el
 * @param {*} symbol
 * @param {*} isHorizontal
 */
export default function renderParticle(group, serieModel, particleModel, dataIndex, el, symbol, isHorizontal) {
    const particleGroup = new graphic.Group();
    const data = serieModel.getData();
    const layout = data.getItemLayout(dataIndex);
    const particle = createParticle(layout, symbol, isHorizontal);

    if (!particle || !layout) {
        return;
    }

    // 粒子方向， 在坐标轴两边粒子方向不同
    const direction = isHorizontal ? (layout.height < 0 ? 1 : -1) : layout.width > 0 ? 1 : -1;

    const rect = particle.getBoundingRect();
    const times = particleModel.get('time');
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    // 最终速率是最大值减最小值差值随机值+最小值
    const distTime = maxTime - minTime;
    const timeRatio = 1000 / clamp(1, 100, minTime + distTime * Math.random());
    const distance = rect.height * (isHorizontal ? -2 : 2);
    const time = timeRatio * Math.abs(distance);

    // 横向时需要旋转图片
    particle.rotation = isHorizontal ? 0 : -Math.PI / 2;
    // 复制第二屏粒子效果
    const particleCopy = cloneGraphic(particle);

    particleGroup.add(particle);
    particleGroup.add(particleCopy);

    elementRendered(el).then(() => {
        const shape = el.getBoundingRect();

        /**
         * 考虑横向纵向和坐标轴正负情况
         */
        const { x } = shape;
        const y = shape.y + (isHorizontal ? shape.height : 0);

        particleGroup.x = x;
        particleGroup.y = y;

        if (el.__createClipPath) {
            particleGroup.setClipPath(
                el.__createClipPath(
                    {
                        ...shape,
                        x: 0,
                        y: 0,
                    },
                    layout,
                ),
            );
        } else if (el.__pictorialMainPath) {
            const path = cloneGraphic(el.__pictorialMainPath);
            particleGroup.setClipPath(path);
        } else {
            particleGroup.setClipPath(
                new graphic.Rect({
                    shape: {
                        ...shape,
                        x: shape.x - x,
                        y: shape.y - y,
                    },
                }),
            );
        }

        // 开始位置
        const startX = direction > 0 ? 0 : isHorizontal ? 0 : shape.width + rect.height;
        const startY = direction > 0 ? 0 : isHorizontal ? -shape.height - rect.height : 0;

        // 偏移位置
        const tx = isHorizontal ? 0 : direction > 0 ? distance : startX + distance * direction;
        const ty = isHorizontal ? (direction > 0 ? distance : startY + distance * direction) : 0;

        particle.x = startX;
        particle.y = startY;
        particleCopy.x = startX;
        particleCopy.y = startY;

        particle.animate('position', true).when(time, [tx, ty]).start();

        particleCopy
            .animate('position', true)
            .when(time, [tx, ty])
            .delay(time / 2)
            .start();

        group.add(particleGroup);
    });
}
