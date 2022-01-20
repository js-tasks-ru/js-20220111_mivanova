/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let count = 1;
  let result = '';
  if (size > 0){
    for (let i = 0; i < string.length; i++) {
      if (count <= size) {
        result += string.charAt(i);
        count++;
      }
      if (string.charAt(i) !== string.charAt(i + 1)) {
        count = 1;
      }
    }
    return result;
  }
  return size === undefined ? string : '';
}
