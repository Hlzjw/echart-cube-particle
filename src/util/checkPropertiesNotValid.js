export default function checkPropertiesNotValid(obj, props) {
    if (!obj) {
        return true;
    }

    for (var i = 0; i < props.length; i++) {
      if (!isFinite(obj[props[i]])) {
        return true;
      }
    }

    return false;
}
