import * as zrUtil from 'zrender/lib/core/util';
import ComponentView from 'echarts/lib/view/Component';
import { Group } from 'echarts/lib/util/graphic';

export default ComponentView.extend({
    type: 'light',

    render(lightModel, ecModel, api) {
        this.dispose();

        ecModel.eachSeries((serieModel) => {
            const model = serieModel.getModel('light');

            if (model.get('show')) {
                model.mergeOption(
                    zrUtil.merge(lightModel.option, model.option, true)
                );
                serieModel.__lightModel = model;
                serieModel.__lightGroup = new Group();
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
