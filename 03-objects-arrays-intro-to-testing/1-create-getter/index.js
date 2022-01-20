/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function(obj) {
    for (let key in obj) {
      let pathArr = path.split('.');
      for (let i = 0; i < pathArr.length; i++) {
        obj = obj[pathArr[i]];
      }
      return obj;
    }
  };
}
