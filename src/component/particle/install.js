import { Group } from 'echarts/lib/util/graphic';
import { createSymbol } from './symbol';
import renderParticle from './renderParticle';
import particleModel from './ParticleModel';
import particleView from './ParticleView';

export function install(registers) {
    registers.registerComponentModel(particleModel);

    registers.registerComponentView(particleView);

    registers.registerUpdateLifecycle(
        'series:afterupdate',
        (ecModel, api) => {
            var particleDataModel = ecModel.getComponent('particle');

            if (!particleDataModel) {
                return;
            }

            var particleComponent = api.getViewOfComponentModel(particleDataModel);
            var { group } = particleComponent;

            ecModel.eachSeries((serieModel) => {
                if (serieModel.__particleModel) {
                    var model = serieModel.__particleModel;
                    var data = serieModel.getData();
                    var coord = serieModel.coordinateSystem;
                    var baseAxis = coord.getBaseAxis();
                    var isHorizontal = baseAxis.isHorizontal(); // 横向还是纵向
                    var pGroup = serieModel.__particleGroup;

                    pGroup.removeAll();

                    createSymbol(model).then((symbol) => {
                        data.eachItemGraphicEl((el, dataIndex) => {
                            // 允许图表组件自定义粒子渲染
                            if (
                                typeof serieModel.renderParticle === 'function'
                            ) {
                                serieModel.renderParticle(
                                    pGroup,
                                    serieModel,
                                    model,
                                    dataIndex,
                                    el,
                                    symbol,
                                    isHorizontal
                                );
                            }
                            else {
                                renderParticle(
                                    pGroup,
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
                    group.add(pGroup);
                }
            });
        }
    );
}
