# caesar-cipher

Enciphers and deciphers text by shifting each ASCII letter by a fixed number of positions through the English alphabet. Non-letters (digits, punctuation, whitespace, everything else) are passed through untouched, so the output always has the same length as the input.

## Usage

```js
import { encipher, decipher, shiftChar } from "caesar-cipher";

encipher("Hello, World!", 3);   // "Khoor, Zruog!"
decipher("Khoor, Zruog!", 3);   // "Hello, World!"
shiftChar("A", 1);              // "B"
```

## Why this exists

A Caesar cipher is too simple for real cryptography, but it is useful for light obfuscation, puzzle construction, and as a teaching tool. This library gives you that and nothing else: two pure functions with no state and no configuration. If you need key rotation, random IVs, or resistance to frequency analysis, you need a different library.

## Edge cases

Only the 26 English letters `A`–`Z` and `a`–`z` are shifted. Digit characters are **not** rotated, even though some toy implementations rotate them; this is a deliberate choice to match the historical cipher, which never had digits. The shift may be any integer — negative values shift backward, and values larger than 26 wrap around (a shift of 29 is equivalent to 3, and 26 is the identity).

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

## Limitations

Values are coerced to floats, so very large integers lose precision. If you need
exact integer aggregates over a window, this is the wrong tool.

