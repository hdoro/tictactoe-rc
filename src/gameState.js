export const STATE_ERRORS = {
  nonArray: "Invalid state. Should be an array.",
  rowCount: "Invalid number of rows",
  invalidCell: "Invalid cell value",
  columnCount: "Row with invalid number of columns",
  circleMoves: "Circle player has more moves than Cross",
  crossMoves: "Cross player is more than 1 move ahead of Circle",
};

export const STATE_RETURNS = {
  ongoing: "ongoing",
  draw: "draw",
  [0]: "O-wins",
  [1]: "X-wins",
};

/**
 * gameState is an array of tuples of 1 for X, 0 for O & null for empty cell.
 * @param {
 *  [1, 0, null][]
 * } gameState
 *
 * @returns "ongoing" | "draw" | "O-wins" | "X-wins"
 */
export function validateState(gameState) {
  if (!Array.isArray(gameState)) {
    throw new Error(STATE_ERRORS.nonArray);
  }
  if (gameState.length !== 3) {
    throw new Error(STATE_ERRORS.rowCount);
  }
  if (gameState.some((row) => row.length !== 3)) {
    throw new Error(STATE_ERRORS.columnCount);
  }
  if (gameState.flat().some((cell) => ![1, 0, null].includes(cell))) {
    throw new Error(STATE_ERRORS.invalidCell);
  }

  const valueCount = gameState.reduce((count, curRow) => {
    return {
      X: (count["X"] || 0) + curRow.filter((cell) => cell === 1).length,
      O: (count["O"] || 0) + curRow.filter((cell) => cell === 0).length,
      empty:
        (count["empty"] || 0) + curRow.filter((cell) => cell === null).length,
    };
  }, {});

  if (valueCount.O > valueCount.X) {
    throw new Error(STATE_ERRORS.circleMoves);
  }
  if (valueCount.X - valueCount.O > 1) {
    throw new Error(STATE_ERRORS.crossMoves);
  }

  // Switch from rows to columns before we can analyze column wins
  const columns = gameState.reduce((cols, row) => {
    return row.map((cell, index) => [...(cols[index] || []), cell]);
  }, []);

  // Switch from rows to diagonals before we can analyze diagonals wins
  const diagonals = [
    // 1st index in 1st row -> last index in last row
    [gameState[0][0], gameState[1][1], gameState[2][2]],

    // Last index in 1st row -> 1st index in last row
    [gameState[2][0], gameState[1][1], gameState[0][2]],
  ];

  console.log({ diagonals });
  const winState = [
    ...gameState, // row wins
    ...columns, // column wins
    ...diagonals, // diagonal wins
  ]
    .map((sequence) => {
      // If the sequence starts with a number, let's check if it's fully made out of that number
      if (Number.isInteger(sequence[0])) {
        // If we find any cell that is different from the first cell in the sequence, we don't have a win state
        return sequence.some((cell) => cell !== sequence[0])
          ? undefined
          : // Else, return the proper win state for the given number
            STATE_RETURNS[sequence[0]];
      }
    })
    .find((state) => !!state);

  if (winState) {
    return winState;
  }

  // If no player has won, return draw ONYL if valueCount.empty === 0
  if (valueCount.empty === 0) {
    return "draw";
  }

  // Otherwise, game still running
  return "ongoing";
}
