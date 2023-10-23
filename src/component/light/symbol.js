import * as graphic from "echarts/lib/util/graphic";
import { parse } from "zrender/lib/tool/color";

export function createSymbol(particleModel) {
    var imgPath = particleModel.get("imgPath");
    var color = particleModel.get("color");

    return new Promise((resolve) => {
        var image = new Image();
        image.src = imgPath;

        image.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            let colorArr = parse(color || "#fff");
            let imageData = ctx.getImageData(0, 0, this.width, this.height);
            let data = imageData.data;

            // 白色时不进行颜色替换
            if (colorArr && colorArr[3] !== 0) {
                for (let i = 0, len = data.length; i < len; i += 4) {
                    if (data[i + 3] !== 0) {
                        data[i] = colorArr[0];
                        data[i + 1] = colorArr[1];
                        data[i + 2] = colorArr[2];
                        data[i + 3] *= colorArr[3];
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);

            var imageZr = new graphic.Image({
                silent: true,
                z: 100,
                style: {
                    x: 0,
                    y: 0,
                    image: canvas,
                    width: this.width,
                    height: this.height,
                },
            });

            resolve(imageZr);
        };
    });
}
