### demo示例

```javascript
import echarts from "echart-cube-particle";

//只写series的示例，其他的与echarts官方配置一样
const option = {
  	"series": [
            {
                "name": "累计增加值",
                "type": "cube",
                "displayType": "cube",
                "barLength": 15,
                "symbol": "circle",
                "showSymbol": true,
                "symbolSize": 5,
                "smooth": false,
                "showArea": false,
                "yAxisIndex": 0,
                "label": {
                    "show": false,
                    "position": "top",
                    "color": "rgba(98,254,239,0.25)",
                    "fontSize": 24,
                    "fontFamily": "AdobeHeitiStd-Regular",
                    "fontStyle": "normal",
                    "fontWeight": "normal"
                },
                "itemStyle": {
                    "innerColor": {
                        "global": false,
                        "type": "linear",
                        "colorStops": [
                            {
                                "offset": 0,
                                "color": "rgba(98,254,239,0.25)"
                            },
                            {
                                "offset": 1,
                                "color": "#62feef"
                            }
                        ],
                        "x": 0,
                        "y": 0,
                        "x2": 0,
                        "y2": 1
                    },
                    "borderColor": "#50dc89",
                    "borderWidth": 1,
                    "borderType": "solid"
                },
                "lineStyle": {
                    "width": 3,
                    "type": "solid",
                    "color": {
                        "global": false,
                        "type": "linear",
                        "colorStops": [
                            {
                                "offset": 0,
                                "color": "rgba(98,254,239,0.25)"
                            },
                            {
                                "offset": 1,
                                "color": "#62feef"
                            }
                        ],
                        "x": 0,
                        "y": 0,
                        "x2": 0,
                        "y2": 1
                    }
                },
                "markLine": {
                    "silent": true,
                    "symbol": [
                        "none",
                        "arrow"
                    ],
                    "symbolSize": 12,
                    "lineStyle": {
                        "width": 1
                    },
                    "data": []
                },
                "particleStyle": "style_1",
                "particle": {
                    "show": true,
                    "time": [
                        29,
                        80
                    ],
                    "color": "#ffffff",
                    "imgPath": "/qipao.png"
                },
                "lightStyle": "style_1",
                "light": {
                    "show": true,
                    "time": [
                        40,
                        60
                    ],
                    "color": "#ffffff",
                    "imgPath": ["/liuguang.png"],
                    "animeType": "up",
                    "offset": [
                        0,
                        0
                    ]
                },
                "background": {
                    "show": false,
                    "itemStyle": {
                        "color": "rgba(255,255,255,0.4)",
                        "borderColor": "rgba(255,255,255,0.4)",
                        "borderWidth": 0,
                        "borderType": "solid"
                    }
                },
                "markPoint": {
                    "itemStyle": {
                        "color": {
                            "x": 0,
                            "y": 0,
                            "x2": 0,
                            "y2": 1,
                            "type": "linear",
                            "global": false,
                            "colorStops": [
                                {
                                    "offset": 0,
                                    "color": "rgba(22,149,137,0.79)"
                                },
                                {
                                    "offset": 1,
                                    "color": "#62feef"
                                }
                            ]
                        }
                    }
                },
                "barGap": "30%",
                "xAxisIndex": 0,
                "columnId": "fake-id-05747963084689156",
                "columnName": "累计增加值",
                "columnType": "MEASURE",
                "bindFieldName": "index1",
                "data": [
                    {
                        "value": 20,
                        "fullValue": 20,
                        "pureFullValue": 20,
                        "originValue": 20
                    },
                    {
                        "value": 40,
                        "fullValue": 40,
                        "pureFullValue": 40,
                        "originValue": 40
                    },
                    {
                        "value": 65,
                        "fullValue": 65,
                        "pureFullValue": 65,
                        "originValue": 65
                    },
                    {
                        "value": 45,
                        "fullValue": 45,
                        "pureFullValue": 45,
                        "originValue": 45
                    },
                    {
                        "value": 35,
                        "fullValue": 35,
                        "pureFullValue": 35,
                        "originValue": 35
                    }
                ],
                "barWidth": 21,
                "animationEasing": "bounceOut",
                "animation": true,
                "emphasis": {
                    "itemStyle": {
                        "color": {
                            "global": false,
                            "type": "linear",
                            "colorStops": [
                                {
                                    "offset": 0,
                                    "color": "rgba(129,254,242,0.25)"
                                },
                                {
                                    "offset": 1,
                                    "color": "rgba(129,254,242,1)"
                                }
                            ],
                            "x": 0,
                            "y": 0,
                            "x2": 0,
                            "y2": 1
                        },
                        "borderColor": "rgba(129,254,242,0.25)",
                        "borderType": "solid",
                        "borderWidth": 0
                    },
                    "label": {
                        "color": "#6db1fc",
                        "fontSize": 24,
                        "fontWeight": "normal",
                        "fontStyle": "normal"
                    }
                }
            },
        ],
  
}
```

series的属性配置：

| 属性名   |       说明 |                          值                          |
| :------- | ---------: | :--------------------------------------------------: |
| type     | 图表的类型 | cube（3d柱状图） cylinder（3d圆柱图）pie3d（3d饼图） |
| particle |   粒子效果 |                                                      |
| light    |   流光效果 |                                                      |

particle的属性配置：

| 属性名   |       说明 |                          值                          |
| :------- | ---------: | :--------------------------------------------------: |
| show     | 是否显示粒子效果 | true |
| time | 粒子移动时间 | [29,80] |
| color    |   流光颜色 | #ffffff |
| imgPath | 粒子图片路径 | /qipao.png |

light的属性配置：

| 属性名   |       说明 |                          值                          |
| :------- | ---------: | :--------------------------------------------------: |
| show     | 是否显示粒子效果 | true |
| time | 粒子移动时间 | [29,80] |
| color    |   流光颜色 | #ffffff |
| imgPath | 粒子图片路径 | /qipao.png |
| animeType | 流光移动方向 | up |
