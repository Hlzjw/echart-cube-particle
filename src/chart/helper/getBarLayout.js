export function getLineWidth(itemModel) {
    var lineWidth = 0;
    if (Number.isFinite(itemModel)) {
        lineWidth = itemModel
    } else {
        // Has no border.
        var borderColor = itemModel.get(['itemStyle', 'borderColor'])

        if (!borderColor || borderColor === 'none') {
            return 0
        }

        lineWidth = itemModel.get(['itemStyle', 'borderWidth']) || 0 // width or height may be NaN for empty data
    }

    return lineWidth
  }

export default function(layout, itemModel) {
    var fixedLineWidth = itemModel ? getLineWidth(itemModel) : 0 // fix layout with lineWidth
    var signX = layout.width > 0 ? 1 : -1
    var signY = layout.height > 0 ? 1 : -1
    var width = Math.abs(layout.width) > fixedLineWidth ?  layout.width - signX * fixedLineWidth : 0;
    var height = Math.abs(layout.height) > fixedLineWidth ?  layout.height - signY * fixedLineWidth : 0;

    return {
        x: layout.x + (signX * fixedLineWidth) / 2,
        y: layout.y + (signY * fixedLineWidth) / 2,
        width,
        height,
    };
  }
