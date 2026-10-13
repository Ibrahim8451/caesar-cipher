import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { encipher, decipher, shiftChar } from "../src/core.js";

describe("encipher", () => {
  it("shifts lower-case letters forward", () => {
    assert.equal(encipher("abc", 3), "def");
  });

  it("shifts upper-case letters forward", () => {
    assert.equal(encipher("ABC", 3), "DEF");
  });

  it("wraps past 'z' back to 'a'", () => {
    assert.equal(encipher("xyz", 3), "abc");
  });

  it("wraps past 'Z' back to 'A'", () => {
    assert.equal(encipher("XYZ", 3), "ABC");
  });

  it("preserves non-letter characters unchanged", () => {
    assert.equal(encipher("Hello, World!", 3), "Khoor, Zruog!");
  });

  it("returns the input unchanged when the shift is 0", () => {
    assert.equal(encipher("anything", 0), "anything");
  });

  it("treats a shift of 26 as the identity", () => {
    assert.equal(encipher("abcXYZ", 26), "abcXYZ");
  });

  it("handles shifts larger than 26", () => {
    // 29 mod 26 == 3
    assert.equal(encipher("abc", 29), "def");
  });

  it("handles negative shifts by shifting backward", () => {
    assert.equal(encipher("def", -3), "abc");
  });

  it("applies ROT13 when the shift is 13", () => {
    assert.equal(encipher("ROT13 example!", 13), "EBG13 rknzcyr!");
  });
});

describe("decipher", () => {
  it("reverses encipher for a positive shift", () => {
    const original = "The quick brown fox jumps over the lazy dog.";
    const encoded = encipher(original, 7);
    assert.equal(decipher(encoded, 7), original);
  });

  it("reverses encipher for a negative shift", () => {
    const original = "MixedCase 123!";
    const encoded = encipher(original, -11);
    assert.equal(decipher(encoded, -11), original);
  });

  it("reverses encipher for a shift greater than 26", () => {
    const original = "abcXYZ";
    const encoded = encipher(original, 50); // 50 mod 26 == 24
    assert.equal(decipher(encoded, 50), original);
  });
});

describe("shiftChar", () => {
  it("returns the original character for a non-letter", () => {
    assert.equal(shiftChar("5", 3), "5");
    assert.equal(shiftChar(" ", 3), " ");
    assert.equal(shiftChar("!", 3), "!");
  });

  it("shifts a single lower-case letter", () => {
    assert.equal(shiftChar("a", 1), "b");
    assert.equal(shiftChar("z", 1), "a");
  });

  it("shifts a single upper-case letter", () => {
    assert.equal(shiftChar("A", 1), "B");
    assert.equal(shiftChar("Z", 1), "A");
  });

  it("normalises negative shifts on a single character", () => {
    assert.equal(shiftChar("a", -1), "z");
  });
});
