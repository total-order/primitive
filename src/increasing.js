/**
 * Compare two values in increasing order using the native comparison and
 * equality operators.
 *
 * @param {any} a The first parameter.
 * @param {any} b The second parameter.
 * @return {number} -1 if a < b, 0 if a === b, and 1 otherwise.
 */
const increasing = (a, b) => (a < b ? -1 : a === b ? 0 : 1);
export default increasing;
