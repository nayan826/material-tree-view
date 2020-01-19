let keyArray = [];
export const ExapansionArray = data => {
  if (data === undefined) {
    return null;
  }
  Object.keys(data).forEach(element => {
    if (data[element] === undefined) {
      keyArray = [];
    }
    keyArray.push(data[element].key);
    if (typeof data[element] === "object") {
      ExapansionArray(data[element].nodes);
    }
  });
  return keyArray;
};
