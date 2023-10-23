import * as zrUtil from 'zrender/lib/core/util';
import { layout, createProgressiveLayout } from 'echarts/lib/layout/barGrid';
import dataSample from 'echarts/lib/processor/dataSample';
import CylinderModel from './CylinderModel';
import CylinderView from './CylinderView';

export function install(registers) {
    registers.registerChartView(CylinderView);
    registers.registerSeriesModel(CylinderModel);
    registers.registerVisual({
        seriesType: 'cylinder',
        reset(seriesModel) {
            seriesModel.getData().setVisual('legendSymbol', 'roundRect');
        }
    });
    registers.registerLayout(registers.PRIORITY.VISUAL.LAYOUT, zrUtil.curry(layout, 'cylinder'));
    registers.registerLayout(registers.PRIORITY.VISUAL.PROGRESSIVE_LAYOUT, createProgressiveLayout('cylinder'));
    registers.registerProcessor(registers.PRIORITY.PROCESSOR.STATISTIC, dataSample('cylinder'));
}
