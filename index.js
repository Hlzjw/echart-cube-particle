import * as echarts from 'echarts/core';
import * as charts from 'echarts/charts';
import * as components from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import * as customCharts from './src/export/charts';
import * as customComponents from './src/export/components';



Object.keys(customCharts).forEach((item) => {
    echarts.use(customCharts[item]);
});

Object.keys(customComponents).forEach((item) => {
    echarts.use(customComponents[item]);
});

Object.keys(charts).forEach((item) => {
    if (!customCharts[item]) {
        echarts.use(charts[item]);
    }
});

Object.keys(components).forEach((item) => {
    if (!customComponents[item]) {
        echarts.use(components[item]);
    }
});

echarts.use([CanvasRenderer, SVGRenderer]);

export default echarts;
