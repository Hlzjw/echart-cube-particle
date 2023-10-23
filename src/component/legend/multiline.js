/**
 *
 * @param {*} orient multiline
 * 1、每列宽度一致
 * 2、行高一致
 */
export default function multiline(orient, group, maxWidth, maxHeight, rowNum, rowGap, colGap) {
    var x = 0;
    var y = 0;
    var colWidth = {};

    if (maxWidth == null) {
        maxWidth = Infinity;
    }

    if (maxHeight == null) {
        maxHeight = Infinity;
    }

    var currentLineMaxSize = 0;

    // 计算列宽和行高
    group.eachChild(function (child, idx) {
        var rect = child.getBoundingRect();
        colWidth[idx % rowNum] = colWidth[idx % rowNum] ? Math.max(colWidth[idx % rowNum], rect.width) : rect.width;
        currentLineMaxSize = Math.max(rect.height, currentLineMaxSize);
    });

    group.eachChild(function (child, idx) {
        child.x = x;
        child.y = y;
        child.markRedraw();

        var width = colWidth[idx % rowNum];
        x = (idx + 1) % rowNum !== 0 ? x + (width + colGap) : 0;

        if ((idx + 1) % rowNum === 0) {
            y += currentLineMaxSize + rowGap;
        }
    });
}
