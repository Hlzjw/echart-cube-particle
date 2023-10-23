import ComponentModel from 'echarts/lib/model/Component';


export default ComponentModel.extend({
	type: 'particle',

	dependencies: ['series'],

	defaultOption: {
		show: true, // 是否显示
		minR: 1, // 自定义绘制时需要
		maxR: 5, // 自定义绘制时需要
		count: 40, // 自定义绘制时需要
		showDist: 40, //显示距离 自定义绘制时需要

		imgPath: '', // 图片路径

		time: [40, 60],

		color: '#fff',

		zlevel: 0,

		z: 10
	}
})
