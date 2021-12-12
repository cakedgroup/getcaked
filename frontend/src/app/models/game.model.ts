export interface Game {
    gameId: string,
    startTime: number,
    username: string | undefined,
    userId: string | undefined,
    groupId: string,
    moves: GameMove[]
}

export interface GameMove {
    row: number,
    column: number
}

export interface GameResponse {
    gameToken: string,
    gameState: number,
    game: Game
  }
