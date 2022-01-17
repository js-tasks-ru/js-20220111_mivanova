/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let array = [...fields];

  let clone = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (array.indexOf(key) >= 0) {
      clone[key] = obj[key];
    }
  });

  return clone;
};
