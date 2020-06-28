export function createJsonRequestAvailableMoves(customBuilderCoords, state) {
  return [
    {
      cells: serializeCellValue(state.cells),
      firstHE: state.firstHe,
      secondHE: state.secondHe,
      firstJU: state.firstJu,
      secondJU: state.secondJu,
      startPosition:
        customBuilderCoords === undefined
          ? [Math.floor(state.selected / 5), state.selected % 5]
          : [Math.floor(customBuilderCoords / 5), customBuilderCoords % 5],
      depth: null,
    },
  ];
}

export function createJsonRequestAiMove(state, depth, includeMinNext = false) {
  return includeMinNext
    ? [
        {
          cells: serializeCellValue(state.cells),
          firstHE: state.firstHe,
          secondHE: state.secondHe,
          firstJU: state.firstJu,
          secondJU: state.secondJu,
          startPosition: null,
          minNext: state.minNext,
          depth: depth,
        },
      ]
    : [
        {
          cells: serializeCellValue(state.cells),
          firstHE: state.firstHe,
          secondHE: state.secondHe,
          firstJU: state.firstJu,
          secondJU: state.secondJu,
          startPosition: null,
          depth: depth,
        },
      ];
}

function serializeCellValue(cells) {
  return cells.slice().map(x => {
    if (x >= 9) {
      return (x + 1) % 5;
    } else if (x >= 5) {
      return x % 5;
    } else {
      return x;
    }
  });
}

export function getStartingPlayerMessageJson(username, secretKey) {
  let message = {
    messageFrom: username,
    firstPlayer: username,
    key: secretKey,
  };

  return JSON.stringify(message);
}

export function getSetupMovesMessageJson(
  username,
  firstBuilderIndex,
  secondBuilderIndex,
  secretKey
) {
  let message = {
    messageFrom: username,
    firstBuilderIndex,
    secondBuilderIndex,
    key: secretKey,
  };

  return JSON.stringify(message);
}

export function getMoveAndTypeMessageJson(
  username,
  idOfCell,
  moveType,
  availableMovesOrBuilds,
  toCell = -1,
  secretKey,
) {
  let message = {
    messageFrom: username,
    moveType: moveType,
    selected: idOfCell,
    availableMovesOrBuilds,
    toCell: toCell,
    key: secretKey,
  };

  return JSON.stringify(message);
}
