function parameterizeArray(arr, fromIndex = 1) {
  if (!Array.isArray(arr)) {
    console.error('An array was expected.');

    return null;
  }

  const normalizedArray = arr.map((_, index) => `$${index + fromIndex}`);

  return normalizedArray.join(',  ');
}

export default parameterizeArray;
