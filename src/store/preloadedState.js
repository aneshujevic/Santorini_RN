import {Algorithms, GameStatesEnum, GameTypesEnum} from '../gameStatesEnum';

export const preloadedState = {
  gameState: {
    algorithmUri: Algorithms.ALPHA_BETA_CUSTOM_HEURISTICS,
    serverUrl: 'http://10.0.2.2:8000',
    depth: 3,
    username: '',
    gameEngineState: GameStatesEnum.SETTING_UP_BUILDERS,
    gameType: GameTypesEnum.HUMAN_VS_AI,
    cells: Array(25).fill(0),
    firstHe: -1,
    secondHe: -1,
    firstJu: -1,
    secondJu: -1,
    selected: -1,
    availableMovesOrBuilds: [],
    glowingCells: Array(25).fill(false),
    gameEnded: false,
    minNext: true,
  },
};
