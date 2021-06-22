function sortSimpleArrayByAlphabeticOrder(arr) {
  return [...arr].sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
  })
}

function sortArrayOfMapByFieldInAlphabeticOrder(arr, field) {
  let listOfFieldValues = [];
  for (var i = 0; i < arr.length; i++) {
    listOfFieldValues.push(arr[i][field]);
  }
  const sortedByFieldValue = sortSimpleArrayByAlphabeticOrder(listOfFieldValues);

  let sortedArr = [];
  for (var i = 0; i < sortedByFieldValue.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      if (arr[j][field] === sortedByFieldValue[i]) {
        sortedArr.push(arr[listOfFieldValues.indexOf(sortedByFieldValue[i])]);
        break;
      }
    }
  }
  return sortedArr;
}

/*
 * @param arr: array to be sorted
 * @param seq: array of the key values in the required sequence, 
 * e.g. when sorting address dictionary, seq = ['addressLine1', 'addressLine2', 'suburbOrCity', 'stateOrProvince', 'postalCode', 'country']
 */
function sortArrayofMapByKeySequence(arr, seq) {
  let sequentialized = [];
    for (let item of seq) 
      if (arr[item] && arr[item].trim() !== '') sequentialized.push(arr[item]);
    return sequentialized;
}

function sortDate(arr) {
  return [...arr].sort(function(a,b) {
    return new Date(b).valueOf() - new Date(a).valueOf();
  });
}

module.exports = {
  sortSimpleArrayByAlphabeticOrder,
  sortArrayOfMapByFieldInAlphabeticOrder,
  sortArrayofMapByKeySequence,
  sortDate,
}