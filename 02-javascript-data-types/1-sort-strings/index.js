/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
  const locales = ['ru', 'en'];
  const options = { caseFirst: 'upper' };
  const Collator = new Intl.Collator(locales, options);

  let sortedArr;

  if (param === 'asc') {
    sortedArr = arr.slice().sort((a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper' }));
  } else {
    sortedArr = arr.slice().sort((a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper' })).reverse();
  }

  return sortedArr;
}
