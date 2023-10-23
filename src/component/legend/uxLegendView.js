import { __extends } from "tslib";
import * as graphic from "echarts/lib/util/graphic";
import { ITEM_STYLE_KEY_MAP } from "echarts/lib/model/mixin/itemStyle";
import { LINE_STYLE_KEY_MAP } from "echarts/lib/model/mixin/lineStyle";
import LegendView from "echarts/lib/component/legend/LegendView";
import { createSymbol } from "echarts/lib/util/symbol";
import { setLabelStyle, createTextStyle } from "echarts/lib/label/labelStyle";
import { enableHoverEmphasis } from "echarts/lib/util/states";
import * as layoutUtil from 'echarts/lib/util/layout';
import multiline from "./multiline";

const Group = graphic.Group;

const uxLegendView = (function (_super) {
    __extends(uxLegendView, _super);

    function uxLegendView() {
        const _this =
            (_super !== null && _super.apply(this, arguments)) || this;
        return _this;
    }

    uxLegendView.prototype._createItem = function (
        seriesModel,
        name,
        dataIndex,
        legendItemModel,
        legendModel,
        itemAlign,
        lineVisualStyle,
        itemVisualStyle,
        legendIcon,
        selectMode
    ) {
        var drawType = seriesModel.visualDrawType;
        var itemWidth = legendModel.get("itemWidth");
        var itemHeight = legendModel.get("itemHeight");
        var isSelected = legendModel.isSelected(name);
        var iconRotate = legendItemModel.get("symbolRotate");
        var legendIconType = legendItemModel.get("icon");
        legendIcon = legendIconType || legendIcon || "roundRect";
        var legendLineStyle = legendModel.getModel("lineStyle");
        var style = getLegendStyle(
            legendIcon,
            legendItemModel,
            legendLineStyle,
            lineVisualStyle,
            itemVisualStyle,
            drawType,
            isSelected
        );
        var itemGroup = new Group();
        var textStyleModel = legendItemModel.getModel("textStyle");

        if (
            typeof seriesModel.getLegendIcon === "function" &&
            (!legendIconType || legendIconType === "inherit")
        ) {
            // Series has specific way to define legend icon
            itemGroup.add(
                seriesModel.getLegendIcon({
                    itemWidth: itemWidth,
                    itemHeight: itemHeight,
                    icon: legendIcon,
                    iconRotate: iconRotate,
                    itemStyle: style.itemStyle,
                    lineStyle: style.lineStyle,
                })
            );
        } else {
            // Use default legend icon policy for most series
            var rotate =
                legendIconType === "inherit" &&
                seriesModel.getData().getVisual("symbol")
                    ? iconRotate === "inherit"
                        ? seriesModel.getData().getVisual("symbolRotate")
                        : iconRotate
                    : 0; // No rotation for no icon

            itemGroup.add(
                getDefaultLegendIcon({
                    itemWidth: itemWidth,
                    itemHeight: itemHeight,
                    icon: legendIcon,
                    iconRotate: rotate,
                    itemStyle: style.itemStyle,
                    lineStyle: style.lineStyle,
                })
            );
        }

        var textX = itemAlign === "left" ? itemWidth + 5 : -5;
        var textAlign = itemAlign;
        var formatter = legendModel.get("formatter");
        var content = name;

        if (typeof formatter === "string" && formatter) {
            content = formatter.replace("{name}", name != null ? name : "");
        } else if (typeof formatter === "function") {
            // 增加formatter的入参方便组件自定义去实现显示
            content = formatter(name, seriesModel, legendModel);

            if (typeof content === "object") {
                name =
                    content.fullValue !== undefined ? content.fullValue : name;
                content = content.value !== undefined ? content.value : name;
            }
        }

        var inactiveColor = legendItemModel.get("inactiveColor");

        itemGroup.add(
            new graphic.Text({
                style: createTextStyle(textStyleModel, {
                    text: content,
                    x: textX,
                    y: itemHeight / 2,
                    fill: isSelected
                        ? textStyleModel.getTextColor()
                        : inactiveColor,
                    align: textAlign,
                    verticalAlign: "middle",
                }),
            })
        ); // Add a invisible rect to increase the area of mouse hover

        var hitRect = new graphic.Rect({
            shape: itemGroup.getBoundingRect(),
            invisible: true,
        });
        // var tooltipModel = legendItemModel.getModel("tooltip");
        var textNumber = textStyleModel.get('textNumber');

        // if (tooltipModel.get("show")) {
        if (textNumber && textNumber !== 'auto') {
            graphic.setTooltipConfig({
                el: hitRect,
                componentModel: legendModel,
                itemName: name,
                itemTooltipOption: { show: true },
            });
        }

        itemGroup.add(hitRect);
        itemGroup.eachChild(function (child) {
            child.silent = true;
        });
        hitRect.silent = !selectMode;
        this.getContentGroup().add(itemGroup);
        enableHoverEmphasis(itemGroup); // @ts-ignore

        itemGroup.__legendDataIndex = dataIndex;
        return itemGroup;
    };

    LegendView.prototype.layoutInner = function (
        legendModel,
        itemAlign,
        maxSize,
        isFirstRender,
        selector,
        selectorPosition
    ) {
        var contentGroup = this.getContentGroup();
        var selectorGroup = this.getSelectorGroup(); // Place items in contentGroup.

        var orient = legendModel.get("orient");

        if(orient !== 'multiline') {
            layoutUtil.box(
                orient,
                contentGroup,
                legendModel.get("itemGap"),
                maxSize.width,
                maxSize.height
            );
        } else {
            multiline(
                orient,
                contentGroup,
                maxSize.width,
                maxSize.height,
                legendModel.get('rowNum'),
                legendModel.get('rowGap'),
                legendModel.get('colGap'),
            )
        }


        var contentRect = contentGroup.getBoundingRect();
        var contentPos = [-contentRect.x, -contentRect.y];
        selectorGroup.markRedraw();
        contentGroup.markRedraw();

        if (selector) {
            // Place buttons in selectorGroup
            layoutUtil.box(
                // Buttons in selectorGroup always layout horizontally
                "horizontal",
                selectorGroup,
                legendModel.get("selectorItemGap", true)
            );
            var selectorRect = selectorGroup.getBoundingRect();
            var selectorPos = [-selectorRect.x, -selectorRect.y];
            var selectorButtonGap = legendModel.get("selectorButtonGap", true);
            var orientIdx = legendModel.getOrient().index;
            var wh = orientIdx === 0 ? "width" : "height";
            var hw = orientIdx === 0 ? "height" : "width";
            var yx = orientIdx === 0 ? "y" : "x";

            if (selectorPosition === "end") {
                selectorPos[orientIdx] += contentRect[wh] + selectorButtonGap;
            } else {
                contentPos[orientIdx] += selectorRect[wh] + selectorButtonGap;
            } //Always align selector to content as 'middle'

            selectorPos[1 - orientIdx] +=
                contentRect[hw] / 2 - selectorRect[hw] / 2;
            selectorGroup.x = selectorPos[0];
            selectorGroup.y = selectorPos[1];
            contentGroup.x = contentPos[0];
            contentGroup.y = contentPos[1];
            var mainRect = {
                x: 0,
                y: 0,
            };
            mainRect[wh] =
                contentRect[wh] + selectorButtonGap + selectorRect[wh];
            mainRect[hw] = Math.max(contentRect[hw], selectorRect[hw]);
            mainRect[yx] = Math.min(
                0,
                selectorRect[yx] + selectorPos[1 - orientIdx]
            );
            return mainRect;
        } else {
            contentGroup.x = contentPos[0];
            contentGroup.y = contentPos[1];
            return this.group.getBoundingRect();
        }
    };

    return uxLegendView;
})(LegendView);

function getLegendStyle(
    iconType,
    legendModel,
    legendLineStyle,
    lineVisualStyle,
    itemVisualStyle,
    drawType,
    isSelected
) {
    /**
     * Use series style if is inherit;
     * elsewise, use legend style
     */
    // itemStyle
    var legendItemModel = legendModel.getModel("itemStyle");
    var itemProperties = ITEM_STYLE_KEY_MAP.concat([["decal"]]);
    var itemStyle = {};

    for (var i = 0; i < itemProperties.length; ++i) {
        var propName = itemProperties[i][itemProperties[i].length - 1];
        var visualName = itemProperties[i][0];
        var value = legendItemModel.getShallow(propName);

        if (value === "inherit") {
            switch (visualName) {
                case "fill":
                    /**
                     * Series with visualDrawType as 'stroke' should have
                     * series stroke as legend fill
                     */
                    itemStyle.fill = itemVisualStyle[drawType];
                    break;

                case "stroke":
                    /**
                     * icon type with "emptyXXX" should use fill color
                     * in visual style
                     */
                    itemStyle.stroke =
                        itemVisualStyle[
                            iconType.lastIndexOf("empty", 0) === 0
                                ? "fill"
                                : "stroke"
                        ];
                    break;

                case "opacity":
                    /**
                     * Use lineStyle.opacity if drawType is stroke
                     */
                    itemStyle.opacity = (
                        drawType === "fill" ? itemVisualStyle : lineVisualStyle
                    ).opacity;
                    break;

                default:
                    itemStyle[visualName] = itemVisualStyle[visualName];
            }
        } else if (value === "auto" && visualName === "lineWidth") {
            // If lineStyle.width is 'auto', it is set to be 2 if series has border
            itemStyle.lineWidth = itemVisualStyle.lineWidth > 0 ? 2 : 0;
        } else {
            itemStyle[visualName] = value;
        }
    } // lineStyle

    var legendLineModel = legendModel.getModel("lineStyle");
    var lineProperties = LINE_STYLE_KEY_MAP.concat([
        ["inactiveColor"],
        ["inactiveWidth"],
    ]);
    var lineStyle = {};

    for (var i = 0; i < lineProperties.length; ++i) {
        var propName = lineProperties[i][1];
        var visualName = lineProperties[i][0];
        var value = legendLineModel.getShallow(propName);

        if (value === "inherit") {
            lineStyle[visualName] = lineVisualStyle[visualName];
        } else if (value === "auto" && visualName === "lineWidth") {
            // If lineStyle.width is 'auto', it is set to be 2 if series has border
            lineStyle.lineWidth = lineVisualStyle.lineWidth > 0 ? 2 : 0;
        } else {
            lineStyle[visualName] = value;
        }
    } // Fix auto color to real color

    itemStyle.fill === "auto" && (itemStyle.fill = itemVisualStyle.fill);
    itemStyle.stroke === "auto" && (itemStyle.stroke = itemVisualStyle.fill);
    lineStyle.stroke === "auto" && (lineStyle.stroke = itemVisualStyle.fill);

    if (!isSelected) {
        var borderWidth = legendModel.get("inactiveBorderWidth");
        /**
         * Since stroke is set to be inactiveBorderColor, it may occur that
         * there is no border in series but border in legend, so we need to
         * use border only when series has border if is set to be auto
         */

        var visualHasBorder =
            itemStyle[iconType.indexOf("empty") > -1 ? "fill" : "stroke"];
        itemStyle.lineWidth =
            borderWidth === "auto"
                ? itemVisualStyle.lineWidth > 0 && visualHasBorder
                    ? 2
                    : 0
                : itemStyle.lineWidth;
        itemStyle.fill = legendModel.get("inactiveColor");
        itemStyle.stroke = legendModel.get("inactiveBorderColor");
        lineStyle.stroke = legendLineStyle.get("inactiveColor");
        lineStyle.lineWidth = legendLineStyle.get("inactiveWidth");
    }

    return {
        itemStyle: itemStyle,
        lineStyle: lineStyle,
    };
}

function getDefaultLegendIcon(opt) {
    var group = new Group();
    var symboType = opt.icon || "roundRect";
    var icon = createSymbol(
        symboType,
        0,
        0,
        opt.itemWidth,
        opt.itemHeight,
        opt.itemStyle.fill
    );

    icon.setStyle(opt.itemStyle);
    icon.rotation = ((opt.iconRotate || 0) * Math.PI) / 180;
    icon.setOrigin([opt.itemWidth / 2, opt.itemHeight / 2]);

    if (symboType.indexOf("empty") > -1) {
        icon.style.stroke = icon.style.fill;
        icon.style.fill = "#fff";
        icon.style.lineWidth = 2;
    }

    const rect = new graphic.Rect({
        shape: {}
    });

    rect.useStyle({
        ...opt.itemStyle,
    });

    rect.__getBoundingRect = rect.getBoundingRect;
    rect.getBoundingRect = function () {
        const result = this.__getBoundingRect();

        result.width = opt.itemWidth;
        result.height = opt.itemHeight;

        return result;
    };

    group.add(rect);
    group.add(icon);

    return group;
}
export default uxLegendView;
