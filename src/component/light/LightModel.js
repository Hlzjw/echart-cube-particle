import ComponentModel from 'echarts/lib/model/Component';

export default ComponentModel.extend({
    type: "light",

    dependencies: ["series"],

    defaultOption: {
        show: true, // 是否显示

        time: [0, 100],

        imgPath: [], // 图片路径是数组 index=0 向上的， index=1 向下的

        color: "#fff",

        animeType: "up", // 运动类型 up/updown/down/downup

        offset: [0, 0], // 图标上下左右偏移

        easing: "quarticIn", // 运动轨迹算法

        zlevel: 0,

        z: 2000,
    },
});
