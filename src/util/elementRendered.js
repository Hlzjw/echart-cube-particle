/**
 * 判断图形是否渲染完成
 * @param {*} el
 * @returns
 */
export default function elementRendered(el) {
    return new Promise((resolve) => {
        const list = [];
        if (el.isGroup) {
            el.traverse((item) => {
                // 如果图形有动画需要等图形动画结束后在执行粒子效果
                if (item.animators && item.animators.length > 0) {
                    list.push(
                        new Promise((done) => {
                            item.animators[0].done(function () {
                                done();
                            });
                        })
                    );
                }
            });

            if (list.length > 0) {
                Promise.all(list).then(() => {
                    resolve();
                });
            } else {
                resolve();
            }

            return;
        }

        // 如果图形有动画需要等图形动画结束后在执行粒子效果
        if (el.animators && el.animators.length > 0) {
            el.animators[0].done(function () {
                resolve();
            });
        } else {
            resolve();
        }
    });
}
