import * as zrUtil from 'zrender/lib/core/util';
import ComponentView from 'echarts/lib/view/Component';
import { Group } from 'echarts/lib/util/graphic';

export default ComponentView.extend({
    type: 'particle',

    render(particleModel, ecModel, api) {
        this.dispose();

        ecModel.eachSeries((serieModel) => {
            const model = serieModel.getModel('particle');

            if (model.get('show')) {
                model.mergeOption(
                    zrUtil.merge(particleModel.option, model.option, true)
                );
                serieModel.__particleModel = model;
                serieModel.__particleGroup = new Group();
            }
        });
    },

    dispose() {
        this.group.traverse((item) => {
            item.stopAnimation();
        });

        this.group.removeAll();
    }
});
