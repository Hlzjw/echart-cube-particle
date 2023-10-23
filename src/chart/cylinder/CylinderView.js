import { initProps, updateProps, removeElementWithFadeOut, Group } from 'echarts/lib/util/graphic';
import { getECData } from 'echarts/lib/util/innerStore';
import ChartView from 'echarts/lib/view/Chart';
import { enableHoverEmphasis, setStatesStylesFromModel } from 'echarts/lib/util/states';
import { setLabelStyle, getLabelStatesModels, setLabelValueAnimation } from 'echarts/lib/label/labelStyle';
import { getDefaultLabel, getDefaultInterpolatedLabel } from 'echarts/lib/chart/helper/labelHelper';
import createElement from './createElement';
import getBarLayout from '../helper/getBarLayout';
import { createBackground, getBackgroundLayout } from './background';
import clip from './clip';
import { OutLine } from './graphic';

const rectPropties = ['x', 'y', 'width', 'height'];

function checkPropertiesValid(obj, props = rectPropties) {
    for (let i = 0; i < props.length; i++) {
        if (isFinite(obj[props[i]])) {
            return true;
        }
    }

    return false;
}

function createAnimition(fn, opt) {
    const { el, shape, seriesModel, dataIndex, itemModel } = opt;

    fn(
        el.childAt(0),
        {
            shape
        },
        seriesModel,
        dataIndex
    );

    fn(
        el.childAt(1),
        {
            shape: {
                ...shape,
                ...getBarLayout(shape, itemModel)
            }
        },
        seriesModel,
        dataIndex
    );
}

function updateStyle(el, data, dataIndex, itemModel, seriesModel, horizontal) {
    const cylinder = el.childAt(0);
    const mask = el.childAt(1);
    const style = data.getItemVisual(dataIndex, 'style');
    const layout = data.getItemLayout(dataIndex);
    const coord = seriesModel.coordinateSystem;

    cylinder.useStyle({
        ...style,
        lineJoin: 'round'
    });

    mask.useStyle({
        fill: 'rgba(0,0,0,1)',
        opacity: 0.1
    });

    const labelPositionOutside = horizontal
        ? layout.height >= 0
            ? 'bottom'
            : 'top'
        : layout.width >= 0
        ? 'right'
        : 'left';

    const labelStatesModels = getLabelStatesModels(itemModel);

    setLabelStyle(cylinder, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: dataIndex,
        defaultText: getDefaultLabel(seriesModel.getData(), dataIndex),
        inheritColor: style.fill,
        defaultOpacity: style.opacity,
        defaultOutsidePosition: labelPositionOutside
    });

    const label = cylinder.getTextContent();

    if (label) {
        var position = itemModel.get(['label', 'position']);
        var labelWidth = label.getBoundingRect().width;
        var labelHeight = label.getBoundingRect().height;

        if (position === 'outside') {
            const bgLayout = getBackgroundLayout(coord, layout, horizontal);

            if (horizontal) {
                cylinder.textConfig.position = [
                    layout.width / 2 - labelWidth / 2,
                    layout.height > 0
                        ? bgLayout.height + (labelHeight + cylinder.textConfig.distance)
                        : bgLayout.y + -(layout.y + layout.height) + -(labelHeight + cylinder.textConfig.distance)
                ];
            } else {
                cylinder.textConfig.position = [
                    layout.width > 0
                        ? bgLayout.width + (labelHeight + cylinder.textConfig.distance)
                        : bgLayout.width - layout.width - (labelHeight + cylinder.textConfig.distance + labelWidth),
                    layout.height / 2 - labelHeight / 2
                ];
            }
        }
    }

    setLabelValueAnimation(label, labelStatesModels, seriesModel.getRawValue(dataIndex), (value) =>
        getDefaultInterpolatedLabel(data, value)
    );

    const emphasisModel = itemModel.getModel(['emphasis']);

    enableHoverEmphasis(el, emphasisModel.get('focus'), emphasisModel.get('blurScope'));

    setStatesStylesFromModel(cylinder, itemModel);

    setStatesStylesFromModel(mask, itemModel, 'itemStyle', () => ({
        fill: 'rgba(0,0,0,0.6)'
    }));
}

export default ChartView.extend({
    type: 'cylinder',

    render(seriesModel) {
        this._model = seriesModel;
        const { group } = this;
        const data = seriesModel.getData();
        const oldData = this._data;
        const coord = seriesModel.coordinateSystem;
        const baseAxis = coord.getBaseAxis();
        const horizontal = baseAxis.isHorizontal();
        const animationModel = seriesModel.isAnimationEnabled() ? seriesModel : null;
        const backgroundModel = seriesModel.getModel(['background']);
        const drawBackground = seriesModel.get('background.show', false);
        const bgEls = [];
        const oldBgEls = this._backgroundEls || [];
        const needsClip = seriesModel.get('clip', true);

        data.diff(oldData)
            .add((dataIndex) => {
                const itemModel = data.getItemModel(dataIndex);
                const layout = getBarLayout(data.getItemLayout(dataIndex), itemModel);

                if (!data.hasValue(dataIndex) || !checkPropertiesValid(layout)) {
                    return;
                }
                let isClipped = false;
                if (needsClip) {
                    isClipped = clip(coord, data, layout);
                }

                const el = createElement(
                    layout,
                    horizontal,
                    itemModel,
                    animationModel,
                    needsClip ? clip.bind(this, coord, data) : null
                );

                if (drawBackground) {
                    const bgel = createBackground(
                        coord,
                        data,
                        dataIndex,
                        backgroundModel,
                        horizontal,
                        needsClip ? clip.bind(this, coord, data) : null
                    );
                    bgEls[dataIndex] = bgel;
                }

                updateStyle(el, data, dataIndex, itemModel, seriesModel, horizontal);

                createAnimition(initProps, {
                    el,
                    shape: layout,
                    seriesModel,
                    dataIndex,
                    itemModel
                });

                data.setItemGraphicEl(dataIndex, el);
                group.add(el);
                el.ignore = isClipped;
            })
            .update((newIndex, oldIndex) => {
                const itemModel = data.getItemModel(newIndex);
                const layout = getBarLayout(data.getItemLayout(newIndex), itemModel);
                let el = oldData.getItemGraphicEl(oldIndex);

                if (!data.hasValue(newIndex) || !checkPropertiesValid(layout)) {
                    group.remove(el);
                    return;
                }
                let isClipped = false;

                if (needsClip) {
                    isClipped = clip(coord, data, layout);
                }

                if (!el) {
                    el = createElement(layout, horizontal, itemModel, animationModel);
                } else {
                    el.__createClipPath = (shape) => {
                        return new OutLine({
                            shape: {
                                ...shape,
                                height: Math.abs(layout.height),
                                width: Math.abs(layout.width),
                                horizontal: horizontal
                            }
                        });
                    };
                }

                createAnimition(updateProps, {
                    el,
                    shape: {
                        ...layout,
                        horizontal
                    },
                    seriesModel,
                    newIndex,
                    itemModel
                });

                if (drawBackground) {
                    let bgEl = oldBgEls[oldIndex];
                    const bgStyle = backgroundModel.getModel(['itemStyle']).getItemStyle();

                    if (!bgEl) {
                        bgEl = createBackground(
                            coord,
                            data,
                            newIndex,
                            backgroundModel,
                            horizontal,
                            needsClip ? clip.bind(this, coord, data) : null
                        );
                        bgEls[newIndex] = bgEl;
                    } else {
                        bgEl.useStyle(bgStyle); // Only cartesian2d support borderRadius.
                        bgEls[newIndex] = bgEl;
                    }

                    const bgLayout = data.getItemLayout(newIndex);

                    if (needsClip) {
                        clip(coord, data, bgLayout);
                    }

                    createAnimition(updateProps, {
                        el: bgEl,
                        shape: {
                            ...getBackgroundLayout(coord, bgLayout, horizontal),
                            horizontal
                        },
                        seriesModel,
                        newIndex,
                        itemModel: backgroundModel
                    });
                }
                updateStyle(el, data, newIndex, itemModel, seriesModel, horizontal);

                data.setItemGraphicEl(newIndex, el);
                group.add(el);
                el.ignore = isClipped;
            })
            .remove((dataIndex) => {
                var el = oldData.getItemGraphicEl(dataIndex);
                el && removeElementWithFadeOut(el, seriesModel, dataIndex);
            })
            .execute();

        const bgGroup = this._backgroundGroup || (this._backgroundGroup = new Group());
        bgGroup.removeAll();

        for (let i = 0; i < bgEls.length; ++i) {
            bgGroup.add(bgEls[i]);
        }

        group.add(bgGroup);
        this._backgroundEls = bgEls;

        this._data = data;
    },

    remove() {
        const model = this._model;
        const { group } = this;
        const data = this._data;

        if (model && model.isAnimationEnabled() && data && !this._isLargeDraw) {
            this.group.remove(this._backgroundGroup);
            this._backgroundGroup = null;
            this._backgroundEls = [];

            data.eachItemGraphicEl((el) => {
                removeElementWithFadeOut(el, model, getECData(el).dataIndex);
            });
        } else {
            group.removeAll();
        }

        this._data = null;
    },

    dispose() {}
});
