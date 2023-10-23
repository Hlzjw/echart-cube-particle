export default function cloneGraphic(el) {
    if (el.isGroup) {
        const group = new el.constructor({
            ...el,
            _children: [],
            __zr: null
        });

        el.eachChild((item) => {
            group.add(cloneGraphic(item));
        });

        return group;
    }

    return new el.constructor({
        ...el,
        __zr: null
    });
}
