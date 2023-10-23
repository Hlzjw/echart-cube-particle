import {
  setAsHighDownDispatcher,
  enableHoverFocus,
  setDefaultStateProxy
} from 'echarts/lib/util/states'

export var OTHER_STATES = ['emphasis', 'blur', 'select'];
export var defaultStyleGetterMap = {
  itemStyle: 'getItemStyle',
  lineStyle: 'getLineStyle',
  areaStyle: 'getAreaStyle'
};

function updateElementState(el, updater, commonParam) {
  updater(el, commonParam);
}

function traverseUpdateState(el, updater, commonParam) {
  updateElementState(el, updater, commonParam);
  el.isGroup && el.traverse(function (child) {
    updateElementState(child, updater, commonParam);
  });
}

export const setStatesStylesFromModel = function (el, itemModel, styleType, // default itemStyle
  getter) {
  styleType = styleType || 'itemStyle';
  if (el.isGroup) {
    el.traverse(function (child) {
      for (var i = 0;i < OTHER_STATES.length;i++) {
        var stateName = OTHER_STATES[i];
        var model = itemModel.getModel([stateName, styleType]);
        var state = child.ensureState(stateName); // Let it throw error if getterType is not found.
        state.style = getter ? getter(model) : model[defaultStyleGetterMap[styleType]]();
      }
    })
  } else {
    for (var i = 0;i < OTHER_STATES.length;i++) {
      var stateName = OTHER_STATES[i];
      var model = itemModel.getModel([stateName, styleType]);
      var state = el.ensureState(stateName); // Let it throw error if getterType is not found.
      state.style = getter ? getter(model) : model[defaultStyleGetterMap[styleType]]();
    }
  }
}

export const enableHoverEmphasis = function (el, focus, blurScope) {
  setAsHighDownDispatcher(el, true);
  traverseUpdateState(el, setDefaultStateProxy);
  enableHoverFocus(el, focus, blurScope);
}



