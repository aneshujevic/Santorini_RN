export function createJsonRequestAvailableMoves(customBuilderCoords, state) {
  return [
    {
      cells: serializeCellValue(state.cells),
      firstHE: state.firstHe,
      secondHE: state.secondHe,
      firstJU: state.firstJu,
      secondJU: state.secondJu,
      startPosition: [
      //   Math.floor(
      //     customBuilderCoords === undefined
      //       ? state.selected / 5
      //       : customBuilderCoords / 5,
      //   ),
      //   customBuilderCoords === undefined
      //     ? state.selected % 5
      //     : customBuilderCoords % 5,
      // ],
        Math.floor(
         state.selected / 5
        ),
        state.selected % 5
      ],
      depth: null,
    },
  ];
}

export function createJsonRequestAiMove(state, depth) {
  return [
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
