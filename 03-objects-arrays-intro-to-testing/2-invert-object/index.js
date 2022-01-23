/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj) {
    const clone = {};
    for (const key in obj) {
      clone[obj[key]] = key;
    }
    return clone;
  }
}