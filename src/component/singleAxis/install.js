
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
import { __extends } from "tslib";
import { use } from 'echarts/lib/extension';
import ComponentView from 'echarts/lib/view/Component';
import SingleAxisView from 'echarts/lib/component/axis/SingleAxisView';
import axisModelCreator from 'echarts/lib/coord/axisModelCreator';
import SingleAxisModel from 'echarts/lib/coord/single/AxisModel';
import singleCreator from 'echarts/lib/coord/single/singleCreator';
import { install as installAxisPointer } from '../axisPointer/install';
import AxisView from 'echarts/lib/component/axis/AxisView';
import SingleAxisPointer from 'echarts/lib/component/axisPointer/SingleAxisPointer';

var SingleView =
/** @class */
function (_super) {
  __extends(SingleView, _super);

  function SingleView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = SingleView.type;
    return _this;
  }

  SingleView.type = 'single';
  return SingleView;
}(ComponentView);

export function install(registers) {
  use(installAxisPointer);
  AxisView.registerAxisPointerClass('SingleAxisPointer', SingleAxisPointer);
  registers.registerComponentView(SingleView); // Axis

  registers.registerComponentView(SingleAxisView);
  registers.registerComponentModel(SingleAxisModel);
  axisModelCreator(registers, 'single', SingleAxisModel, SingleAxisModel.defaultOption);
  registers.registerCoordinateSystem('single', singleCreator);
}
