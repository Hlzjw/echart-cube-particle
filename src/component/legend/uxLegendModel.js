import { __extends } from "tslib";
import LegendModel from "echarts/lib/component/legend/LegendModel";

const uxLegendModel = (function (_super) {
    __extends(uxLegendModel, _super);

    function uxLegendModel() {
        const _this = (_super !== null && _super.apply(this, arguments)) || this;
        return _this;
    }

    uxLegendModel.defaultOption = {
        ..._super.defaultOption,
        rowNum: 2,
        rowGap: 10,
        colGap: 10
    }

    return uxLegendModel;
})(LegendModel);

export default uxLegendModel;
