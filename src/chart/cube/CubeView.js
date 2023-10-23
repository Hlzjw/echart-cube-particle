import { Group, initProps, updateProps, removeElementWithFadeOut } from 'echarts/lib/util/graphic';
import ChartView from 'echarts/lib/view/Chart';
import { getECData } from 'echarts/lib/util/innerStore';
import { enableHoverEmphasis, setStatesStylesFromModel } from 'echarts/lib/util/states';
import { setLabelStyle, getLabelStatesModels, setLabelValueAnimation } from 'echarts/lib/label/labelStyle';
import { getDefaultLabel, getDefaultInterpolatedLabel } from 'echarts/lib/chart/helper/labelHelper';
import getBarLayout from '../helper/getBarLayout';
import createElement from './createElement';
import { createBackground, getBackgroundLayout } from './background';
import clip from './clip';
import { OutLine } from './graphic';
import { getLabelLayout } from './layout';

const rectPropties = ['x', 'y', 'width', 'height'];

function checkPropertiesValid(obj, props = rectPropties) {
    for (let i = 0; i < props.length; i++) {
        if (isFinite(obj[props[i]])) {
            return true;
        }
    }

    return false;
}

function updateStyle(el, data, dataIndex, itemModel, seriesModel, horizontal) {
    const cube = el.childAt(0);
    const mask = el.childAt(1);
    const rect = el.childAt(2);
    const style = data.getItemVisual(dataIndex, 'style');
    const layout = data.getItemLayout(dataIndex);
    const coord = seriesModel.coordinateSystem;

    cube.useStyle({
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

    setLabelStyle(rect, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: dataIndex,
        defaultText: getDefaultLabel(seriesModel.getData(), dataIndex),
        inheritColor: style.fill,
        defaultOpacity: style.opacity,
        defaultOutsidePosition: labelPositionOutside
    });

    const label = rect.getTextContent();

    if (label) {
        var position = itemModel.get(['label', 'position']);
        var labelWidth = label.getBoundingRect().width;
        var labelHeight = label.getBoundingRect().height;

        if (position === 'outside') {
            const bgLayout = getBackgroundLayout(coord, layout, horizontal);

            if (horizontal) {
                rect.textConfig.position = [
                    layout.width / 2 - labelWidth / 2,
                    layout.height > 0
                        ? bgLayout.height + (labelHeight + rect.textConfig.distance)
                        : bgLayout.y + -(layout.y + layout.height) + -(labelHeight + rect.textConfig.distance)
                ];
            } else {
                rect.textConfig.position = [
                    layout.width > 0
                        ? bgLayout.width + (labelHeight + rect.textConfig.distance)
                        : bgLayout.width - layout.width - (labelHeight + rect.textConfig.distance + labelWidth),
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

    setStatesStylesFromModel(cube, itemModel);

    setStatesStylesFromModel(mask, itemModel, 'itemStyle', () => ({
        fill: 'rgba(0,0,0,0.6)'
    }));
}

function createAnimition(fn, opt) {
    const { el, shape, seriesModel, dataIndex } = opt;

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
            shape
        },
        seriesModel,
        dataIndex
    );

    fn(
        el.childAt(2),
        {
            shape: getLabelLayout(shape)
        },
        seriesModel,
        dataIndex
    );
}


export default ChartView.extend({
    type: 'cube',

    render(seriesModel) {
        this._model = seriesModel;
        const { group } = this;
        const data = seriesModel.getData();
        const oldData = this._data;
        const coord = seriesModel.coordinateSystem;
        const baseAxis = coord.getBaseAxis();
        const horizontal = baseAxis.isHorizontal();
        const animationModel = seriesModel.isAnimationEnabled() ? seriesModel : null;
        const angle = seriesModel.get('angle') || 0;
        const backgroundModel = seriesModel.getModel(['background', 'itemStyle']);
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

                const el = createElement(layout, itemModel, angle, horizontal, animationModel);

                if (drawBackground) {
                    const bgel = createBackground(
                        coord,
                        data,
                        dataIndex,
                        angle,
                        backgroundModel,
                        horizontal,
                        needsClip ? clip.bind(this, coord, data) : null
                    );
                    bgEls[dataIndex] = bgel;
                }

                updateStyle(el, data, dataIndex, itemModel, seriesModel, horizontal);

                createAnimition(initProps, {
                    el,
                    shape: {
                        ...layout,
                        angle,
                        horizontal
                    },
                    itemModel,
                    seriesModel,
                    dataIndex
                });

                data.setItemGraphicEl(dataIndex, el);
                group.add(el);
                el.ignore = isClipped;
            })
            .update((newIndex, oldIndex) => {
                var itemModel = data.getItemModel(newIndex);
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
                    el = createElement(layout, itemModel, angle, horizontal, animationModel);
                } else {
                    el.__createClipPath = (shape) =>
                        new OutLine({
                            shape: {
                                ...shape,
                                height: Math.abs(layout.height),
                                width: Math.abs(layout.width),
                                angle,
                                horizontal
                            }
                        });
                }

                createAnimition(updateProps, {
                    el,
                    shape: {
                        ...layout,
                        angle,
                        horizontal
                    },
                    itemModel,
                    seriesModel,
                    newIndex
                });

                if (drawBackground) {
                    let bgEl;
                    const bgStyle = backgroundModel.getItemStyle();
                    if (oldBgEls.length === 0) {
                        bgEl = createBackground(
                            coord,
                            data,
                            newIndex,
                            angle,
                            backgroundModel,
                            horizontal,
                            needsClip ? clip.bind(this, coord, data) : null
                        );
                        bgEls[newIndex] = bgEl;
                    } else {
                        bgEl = oldBgEls[oldIndex];
                        bgEl.useStyle(bgStyle);
                        bgEls[newIndex] = bgEl;
                    }

                    const bgLayout = data.getItemLayout(newIndex);

                    if (needsClip) {
                        clip(coord, data, bgLayout);
                    }

                    updateProps(
                        bgEl.childAt(0),
                        {
                            shape: {
                                ...getBackgroundLayout(coord, bgLayout, horizontal),
                                angle,
                                horizontal
                            }
                        },
                        animationModel,
                        newIndex
                    );
                    updateProps(
                        bgEl.childAt(1),
                        {
                            shape: {
                                ...getBackgroundLayout(coord, bgLayout, horizontal),
                                angle,
                                horizontal
                            }
                        },
                        animationModel,
                        newIndex
                    );
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
        var model = this._model;
        var { group } = this;
        var data = this._data;

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
