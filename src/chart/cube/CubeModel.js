import SeriesModel from 'echarts/lib/model/Series';
import createSeriesData from 'echarts/lib/chart/helper/createSeriesData';
import { setDefaultStateProxy } from 'echarts/lib/util/states.js';
import { Group, Rect } from 'echarts/lib/util/graphic';
import { Cube, Mask } from './graphic';

export default SeriesModel.extend({
    type: 'series.cube',

    dependencies: ['grid'],

    getInitialData() {
        return createSeriesData(null, this, {
            useEncodeDefaulter: true
        });
    },

    getMarkerPosition(value) {
        const coordSys = this.coordinateSystem;
        if (coordSys) {
            const pt = coordSys.dataToPoint(value, true);
            const data = this.getData();
            const offset = data.getLayout('offset');
            const size = data.getLayout('size');
            const offsetIndex = coordSys.getBaseAxis().isHorizontal() ? 0 : 1;
            pt[offsetIndex] += offset + size / 2;
            return pt;
        }
        return [NaN, NaN];
    },

    getLegendIcon(opt) {
        const angle = this.get('angle') || 0;
        var group = new Group();
        const cube = new Cube({
            shape: {
                ...{
                    x: 0,
                    y: opt.itemHeight / 4,
                    height: opt.itemHeight,
                    width: opt.itemWidth
                },
                angle,
                horizontal: true
            },
            z2: 1
        });

        setDefaultStateProxy(cube);

        const mask = new Mask({
            silent: true,
            shape: {
                x: 0,
                y: opt.itemHeight / 4,
                height: opt.itemHeight,
                width: opt.itemWidth,
                lineWidth: 0,
                angle,
                horizontal: true
            },
            z2: 1
        });

        cube.setStyle({
            ...opt.itemStyle,
            lineJoin: 'round'
        });

        mask.setStyle({
            fill: 'rgba(0,0,0,1)',
            opacity: 0.1
        });

        const rect = new Rect({
            shape: {
            }
        });

        rect.useStyle({
            ...opt.itemStyle,
            lineWidth: 0
        });

        rect.__getBoundingRect = rect.getBoundingRect;

        rect.getBoundingRect = function () {
            const result = this.__getBoundingRect();

            result.width = opt.itemWidth;
            result.height = opt.itemHeight;

            return result;
        };

        group.add(cube);
        group.add(mask);
        group.add(rect);

        return group;
    },

    defaultOption: {
        coordinateSystem: 'cartesian2d',

        clip: true,

        zlevel: 0,

        z: 2,
        legendHoverLink: true,

        itemStyle: {
        },

        emphasis: {
        }
    }
});
