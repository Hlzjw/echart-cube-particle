import LegendModel from './uxLegendModel';
import LegendView from './uxLegendView';
import legendFilter from 'echarts/lib/component/legend/legendFilter';
import { installLegendAction } from 'echarts/lib/component/legend/legendAction';

export function install(registers) {
  registers.registerComponentModel(LegendModel);
  registers.registerComponentView(LegendView);
  registers.registerProcessor(registers.PRIORITY.PROCESSOR.SERIES_FILTER, legendFilter);
  registers.registerSubTypeDefaulter('legend', function () {
    return 'plain';
  });
  installLegendAction(registers);
}
