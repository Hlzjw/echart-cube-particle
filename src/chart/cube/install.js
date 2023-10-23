import * as zrUtil from 'zrender/lib/core/util';
import { layout, createProgressiveLayout } from 'echarts/lib/layout/barGrid';
import dataSample from 'echarts/lib/processor/dataSample';
import CubeModel from './CubeModel';
import CubeView from './CubeView';

export function install(registers) {
    registers.registerChartView(CubeView);

    registers.registerSeriesModel(CubeModel);

    registers.registerVisual({
        seriesType: 'cube',
        reset(seriesModel) {
            seriesModel.getData().setVisual('legendSymbol', 'roundRect');
        }
    });
    registers.registerLayout(registers.PRIORITY.VISUAL.LAYOUT, zrUtil.curry(layout, 'cube'));
    registers.registerLayout(registers.PRIORITY.VISUAL.PROGRESSIVE_LAYOUT, createProgressiveLayout('cube'));

    registers.registerProcessor(registers.PRIORITY.PROCESSOR.STATISTIC, dataSample('cube'));
}
