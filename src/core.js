/**
 * Core implementation of the Caesar cipher.
 *
 * Design decisions made here, stated plainly so the tests and README
 * can be held against them:
 *
 * 1. Only the 26 English letters A–Z / a–z are shifted. Digits,
 *    punctuation, whitespace, and every other code point are passed
 *    through untouched. The cipher historically only applies to letters;
 *    trying to rotate digits or symbols is a different cipher.
 *
 * 2. The shift is applied to the *character*, not a pre-split string.
 *    This keeps the module a pair of pure functions with no state and no
 *    allocation beyond the result string.
 *
 * 3. A shift of 13 on ASCII letters is the ROT13 special case; a shift
 *    of 0 is the identity. Both are handled naturally by the modular
 *    arithmetic and need no special-casing.
 */

const LOWER_A = 0x61; // 'a'
const UPPER_A = 0x41; // 'A'
const ALPHABET_SIZE = 26;

/**
 * Normalise an arbitrary integer shift into the range [0, 25].
 *
 * JavaScript's % operator keeps the sign of the dividend, so -1 % 26 is
 * -1 rather than 25. Adding the modulus once and taking % again folds
 * any integer — positive, negative, or very large — into the canonical
 * [0, 25] range. We do not use Math.trunc here because the shift is
 * always already an integer by the time this is called.
 */
function normaliseShift(shift) {
  return ((shift % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
}

/**
 * Shift a single character by `shift` positions through the alphabet.
 *
 * Returns the original character unchanged if it is not an ASCII letter.
 * The function is exported so callers can apply the cipher a character at
 * a time, and so it can be unit-tested in isolation.
 *
 * @param {string} char  A single code unit (we only inspect ASCII letters,
 *                       so surrogate pairs and multi-code-unit graphemes
 *                       are simply passed through if their first unit is
 *                       not an ASCII letter).
 * @param {number} shift Number of positions to shift; any integer is
 *                       accepted, including negatives and values larger
 *                       than 26.
 * @returns {string}
 */
export function shiftChar(char, shift) {
  const code = char.charCodeAt(0);

  // Lower-case letters: contiguous ASCII block a–z.
  if (code >= LOWER_A && code <= LOWER_A + ALPHABET_SIZE - 1) {
    const offset = code - LOWER_A;
    const shifted = (offset + normaliseShift(shift)) % ALPHABET_SIZE;
    return String.fromCharCode(LOWER_A + shifted);
  }

  // Upper-case letters: contiguous ASCII block A–Z.
  if (code >= UPPER_A && code <= UPPER_A + ALPHABET_SIZE - 1) {
    const offset = code - UPPER_A;
    const shifted = (offset + normaliseShift(shift)) % ALPHABET_SIZE;
    return String.fromCharCode(UPPER_A + shifted);
  }

  return char;
}

/**
 * Encipher `text` by shifting every ASCII letter forward by `shift`.
 *
 * Non-letters are preserved exactly, including their positions, so the
 * output has the same length as the input for any string composed of
 * BMP code units.
 *
 * @param {string} text
 * @param {number} shift
 * @returns {string}
 */
export function encipher(text, shift) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += shiftChar(text[i], shift);
  }
  return result;
}

/**
 * Decipher `text` that was enciphered with `shift`.
 *
 * Deciphering is just enciphering with the negated shift; calling
 * `encipher` with `-shift` keeps the two functions perfectly inverse
 * without duplicating the rotation logic.
 *
 * @param {string} text
 * @param {number} shift
 * @returns {string}
 */
export function decipher(text, shift) {
  return encipher(text, -shift);
}
