import lightModel from './LightModel';
import lightView from './LightView';
import renderLight from './renderLight';
import checkPropertiesNotValid from '../../util/checkPropertiesNotValid';
import { createSymbol } from './symbol';

function checkLayoutNotValid(layout) {
    return checkPropertiesNotValid(layout, ['x', 'y', 'width', 'height']);
}
export function install(registers) {
    registers.registerComponentModel(lightModel);

    registers.registerComponentView(lightView);

    registers.registerUpdateLifecycle(
        'series:afterupdate',
        (ecModel, api) => {
            var lightDataModel = ecModel.getComponent('light');

            if (!lightDataModel) {
                return;
            }

            var lightComponent = api.getViewOfComponentModel(lightDataModel);
            var { group } = lightComponent;

            ecModel.eachSeries((serieModel) => {
                if (serieModel.__lightModel && serieModel.__lightGroup) {
                    var model = serieModel.__lightModel;
                    var data = serieModel.getData();
                    var coord = serieModel.coordinateSystem;
                    var baseAxis = coord.getBaseAxis();
                    var isHorizontal = baseAxis.isHorizontal(); // 横向还是纵向
                    var lGroup = serieModel.__lightGroup;
                    lGroup.removeAll();

                    createSymbol(model).then((symbol) => {
                        data.eachItemGraphicEl((el, dataIndex) => {
                            const layout = data.getItemLayout(dataIndex);

                            if (checkLayoutNotValid(layout)) {
                                return;
                            }

                            // 允许图表组件自定义粒子渲染
                            if (typeof serieModel.renderLight === 'function') {
                                serieModel.renderLight(
                                    lGroup,
                                    serieModel,
                                    model,
                                    dataIndex,
                                    el,
                                    symbol,
                                    isHorizontal
                                );
                            }
                            else {
                                renderLight(
                                    lGroup,
                                    serieModel,
                                    model,
                                    dataIndex,
                                    el,
                                    symbol,
                                    isHorizontal
                                );
                            }
                        });
                    });

                    group.add(lGroup);
                }
            });
        }
    );
}
