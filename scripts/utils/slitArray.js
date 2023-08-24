/*
  * Split an array into chunks of a given size
  * @param {Array} input - The array to split
  * @param {Number} spacing - The size of the chunks
 */
export function splitArray(input, spacing = 3) {
  let result = [];
  let temp = [];

  for(let i = 0; i < input.length; i++) {
    temp.push(input[i]);

    if(temp.length === spacing || i === input.length - 1) {
      result.push(temp);
      temp = [];
    }
  }

  return result;
}

export default splitArray;
