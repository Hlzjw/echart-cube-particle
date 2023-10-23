const mathMax = Math.max;
const mathMin = Math.min;

function isCoordinateSystemType(coordSys, type) {
    return coordSys.type === type;
}

function getClipArea(coord, data) {
    var coordSysClipArea = coord.getArea && coord.getArea();

    if (isCoordinateSystemType(coord, 'cartesian2d')) {
        var baseAxis = coord.getBaseAxis(); // When boundaryGap is false or using time axis. bar may exceed the grid.
        // We should not clip this part.
        // See test/bar2.html

        if (baseAxis.type !== 'category' || !baseAxis.onBand) {
            var expandWidth = data.getLayout('bandWidth');

            if (baseAxis.isHorizontal()) {
                coordSysClipArea.x -= expandWidth;
                coordSysClipArea.width += expandWidth * 2;
            }
            else {
                coordSysClipArea.y -= expandWidth;
                coordSysClipArea.height += expandWidth * 2;
            }
        }
    }

    return coordSysClipArea;
}

export default (coord, data, layout) => {
    const coordSysBoundingRect = getClipArea(coord, data);
    var signWidth = layout.width < 0 ? -1 : 1;
    var signHeight = layout.height < 0 ? -1 : 1; // Needs positive width and height

    if (signWidth < 0) {
        layout.x += layout.width;
        layout.width = -layout.width;
    }

    if (signHeight < 0) {
        layout.y += layout.height;
        layout.height = -layout.height;
    }

    var coordSysX2 = coordSysBoundingRect.x + coordSysBoundingRect.width;
    var coordSysY2 = coordSysBoundingRect.y + coordSysBoundingRect.height;
    var x = mathMax(layout.x, coordSysBoundingRect.x);
    var x2 = mathMin(layout.x + layout.width, coordSysX2);
    var y = mathMax(layout.y, coordSysBoundingRect.y);
    var y2 = mathMin(layout.y + layout.height, coordSysY2);
    var xClipped = x2 < x;
    var yClipped = y2 < y; // When xClipped or yClipped, the element will be marked as `ignore`.
    // But we should also place the element at the edge of the coord sys bounding rect.
    // Beause if data changed and the bar show again, its transition animaiton
    // will begin at this place.

    layout.x = xClipped && x > coordSysX2 ? x2 : x;
    layout.y = yClipped && y > coordSysY2 ? y2 : y;
    layout.width = xClipped ? 0 : x2 - x;
    layout.height = yClipped ? 0 : y2 - y; // Reverse back

    if (signWidth < 0) {
        layout.x += layout.width;
        layout.width = -layout.width;
    }

    if (signHeight < 0) {
        layout.y += layout.height;
        layout.height = -layout.height;
    }

    return xClipped || yClipped;
};
