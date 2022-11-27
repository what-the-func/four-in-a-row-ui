export type Challenge = {
  p1: string
  p2: string
  id: string
}

export type GameInfo = {
  p1: string
  p2: string
  id: string
}

export type GameState = {
  board: number[][]
  turn: string
  ended: boolean
}

export type Move = {
  player: string,
  id: string,
  col: number
}
