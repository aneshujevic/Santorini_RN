export function createJsonRequestAvailableMoves(state, selectedCoordinate) {
  return [
    {
      cells: serializeCellValue(state.cells),
      firstHE: state.firstHE,
      secondHE: state.secondHE,
      firstJU: state.firstJU,
      secondJU: state.secondJU,
      startPosition: [
        Math.floor(selectedCoordinate / 5),
        selectedCoordinate % 5,
      ],
      depth: null,
    },
  ];
}

export function createJsonRequestAiMove(state, depth) {
  return [
    {
      cells: serializeCellValue(state.cells),
      firstHE: this.state.firstHE,
      secondHE: this.state.secondHE,
      firstJU: this.state.firstJU,
      secondJU: this.state.secondJU,
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
