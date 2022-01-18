/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
  const locales = ['ru', 'en'];
  const options = { caseFirst: 'upper' };

  let sortedArr = arr.slice();

  sortedArr = sortedArr.sort((a, b) =>
    param === 'asc' ?
      a.localeCompare(b, locales, options) :
      b.localeCompare(a, locales, options));

  return sortedArr;
}
