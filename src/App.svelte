<script>
  import { STATE_RETURNS, validateState } from "./gameState";

  /**
   * What goes into the game loop:
   *
   * 1. Prompt the first player (Cross) for their move
   * 2. Moves are composed of [rowNumber, columnNumber]
   * 3. If move is invalid, re-prompt
   *  - Spot already filled
   *  - Do a pre-flight validateState with the new value, act on errors thrown (invalid row count, cell value, etc.)
   * 4. Check new gameState
   * 5. If win or draw, end of game state
   * 6. If ongoing, next player
   */

  const INITIAL_STATE = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  let gameState = INITIAL_STATE;

  // 1 (Cross) or 0 (Circle)
  let currentPlayer = 1;

  const CELL_VALUES = {
    1: "X",
    0: "O",
  };

  const CONCLUSION_LABELS = {
    [STATE_RETURNS[0]]: "Circle wins!",
    [STATE_RETURNS[1]]: "Cross wins!",
    [STATE_RETURNS.draw]: "It's a tie!",
  };

  function registerPlay(rowIndex, cellIndex, player) {
    if (gameState[rowIndex][cellIndex] != null) {
      // @TODO: user feedback on error
      return;
    }

    const newState = gameState.map((row, rowIdx) => {
      if (rowIdx === rowIndex) {
        return row.map((cell, cellIdx) => {
          if (cellIdx === cellIndex) {
            return player;
          }
          return cell;
        });
      }
      return row;
    });

    try {
      validateState(newState);
      gameState = newState;
      currentPlayer = player === 0 ? 1 : 0;
    } catch (error) {
      return;
    }
  }

  $: stateInfo = (function () {
    try {
      return validateState(gameState);
    } catch (error) {
      return "ongoing";
    }
  })();
</script>

<main>
  <h1>Tic Tac Toe</h1>

  {#if stateInfo !== "ongoing"}
    <p>{CONCLUSION_LABELS[stateInfo]}</p>
    <button on:click|preventDefault={() => (gameState = INITIAL_STATE)}
      >Restart</button
    >
  {/if}

  <div class="grid">
    {#each gameState as row, rowIndex}
      {#each row as cell, cellIndex}
        <button
          class="cell"
          disabled={cell !== null || stateInfo !== "ongoing"}
          data-value={cell}
          on:click|preventDefault={() =>
            registerPlay(rowIndex, cellIndex, currentPlayer)}
        >
          {CELL_VALUES[cell] || ""}
        </button>
      {/each}
    {/each}
  </div>
</main>

<style>
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    max-width: 500px;
    margin: 0 auto;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .cell {
    border: 1px solid black;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 800;
  }

  .cell[data-value="1"] {
    background: papayawhip;
  }
  .cell[data-value="0"] {
    background: paleturquoise;
  }
</style>
