/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const cloneArr = [];
  if (arr){
    for (let item of arr) {
      if (!cloneArr.includes(item)){
        cloneArr.push(item);
      }
    }
  }
  return cloneArr;
}
