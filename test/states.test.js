import { expect, test } from "vitest";
import {
  validateState,
  STATE_ERRORS,
  STATE_RETURNS,
} from "../src/gameState.js";

// Edit an assertion and save to see HMR in action

test("Must pass an array of arrays with 3 entries", () => {
  expect(() => validateState()).toThrowError(STATE_ERRORS.nonArray);

  // Row count: too low and too high
  expect(() => validateState([])).toThrowError(STATE_ERRORS.rowCount);
  expect(() => validateState([[], [], [], []])).toThrowError(
    STATE_ERRORS.rowCount
  );

  // Column count: too low and too high
  expect(() => validateState([[], [], []])).toThrowError(
    STATE_ERRORS.columnCount
  );
  expect(() => validateState([[1, 1, 1, 1], [], []])).toThrowError(
    STATE_ERRORS.columnCount
  );
});

test("Cells must be 1, 0 or null", () => {
  expect(() =>
    validateState([
      [2, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.invalidCell);
  expect(() =>
    validateState([
      [-1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.invalidCell);
  expect(() =>
    validateState([
      [undefined, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.invalidCell);
  expect(() =>
    validateState([
      ["string", 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.invalidCell);
  expect(() =>
    validateState([
      [[], 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.invalidCell);
  expect(() =>
    validateState([
      [{}, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.invalidCell);
});

test("Circle player isn't ahead", () => {
  expect(() =>
    validateState([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.circleMoves);
  expect(() =>
    validateState([
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ])
  ).toThrowError(STATE_ERRORS.circleMoves);
});

test("Cross player isn't more than 1 ahead", () => {
  expect(() =>
    validateState([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ])
  ).toThrowError(STATE_ERRORS.crossMoves);
  expect(() =>
    validateState([
      [0, 0, null],
      [1, 1, null],
      [1, 1, null],
    ])
  ).toThrowError(STATE_ERRORS.crossMoves);
});

test("Diagonal wins", () => {
  expect(
    validateState([
      [1, 0, 0],
      [0, 1, 0],
      [1, null, 1],
    ])
  ).toBe(STATE_RETURNS[1]);
  expect(
    validateState([
      [0, 0, 1],
      [0, 1, 0],
      [1, null, 1],
    ])
  ).toBe(STATE_RETURNS[1]);
  expect(
    validateState([
      [1, null, null],
      [1, 0, null],
      [0, null, null],
    ])
  ).toBe(STATE_RETURNS.ongoing);
});

test("Column wins", () => {
  expect(
    validateState([
      [1, 0, 0],
      [1, null, 1],
      [1, 0, null],
    ])
  ).toBe(STATE_RETURNS[1]);
  expect(
    validateState([
      [0, 1, 0],
      [null, 1, 1],
      [0, 1, null],
    ])
  ).toBe(STATE_RETURNS[1]);
  expect(
    validateState([
      [0, 0, 1],
      [null, 1, 1],
      [0, null, 1],
    ])
  ).toBe(STATE_RETURNS[1]);
});

test("Row wins", () => {
  expect(
    validateState([
      [1, 1, 1],
      [null, 0, 0],
      [0, null, 1],
    ])
  ).toBe(STATE_RETURNS[1]);
  expect(
    validateState([
      [null, 0, 0],
      [1, 1, 1],
      [0, null, 1],
    ])
  ).toBe(STATE_RETURNS[1]);
  expect(
    validateState([
      [null, 0, 0],
      [0, null, 1],
      [1, 1, 1],
    ])
  ).toBe(STATE_RETURNS[1]);
});

test("Draw", () => {
  expect(
    validateState([
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
    ])
  ).toBe("draw");
});

test("Ongoing", () => {
  expect(
    validateState([
      [0, 1, null],
      [1, 0, 0],
      [1, 0, 1],
    ])
  ).toBe("ongoing");
});
