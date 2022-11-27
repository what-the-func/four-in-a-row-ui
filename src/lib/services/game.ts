import { Contract } from '@ethersproject/contracts'
import type { JsonRpcSigner, Listener } from '@ethersproject/providers'
import { WebSocketProvider } from '@ethersproject/providers'
import abi from './abi.json'
import type { Challenge, GameInfo, GameState, Move } from '../types'
import { PUBLIC_RPC_URL, PUBLIC_CONTRACT_ADDRESS } from '$env/static/public'

export class Game {
  private ABI = abi

  private signer: JsonRpcSigner
  private contract: Contract

  moves: Move[] = []

  constructor(signer: JsonRpcSigner) {
    const provider = new WebSocketProvider(PUBLIC_RPC_URL)
    this.signer = signer
    this.contract = new Contract(PUBLIC_CONTRACT_ADDRESS, this.ABI, provider)
  }

  async challengeOpponent(address: string) {
    await this.contract.connect(this.signer).challangevictim(address)
  }

  async acceptChallenge(hostAddress: string) {
    const tx = await this.contract.connect(this.signer).joinGame(hostAddress)
    await tx.wait()
  }

  async getOpenChallenges(): Promise<Challenge[]> {
    const address = await this.signer.getAddress()
    const newGameFilter = this.contract.filters.GameCreation(null, address)
    const joinedGameFilter = this.contract.filters.GameJoin()
    try {
      const challenges = (await this.contract.queryFilter(newGameFilter, 29362205)).map((c) => {
        return {
          p1: c.args?.p1,
          p2: c.args?.p2,
          id: c.args?.game,
        }
      })
      const joined = (await this.contract.queryFilter(joinedGameFilter, 29362205)).map((j) => {
        return {
          p1: j.args?.p1,
          p2: j.args?.p2,
          id: j.args?.game,
        }
      })
      return challenges.filter((c) => {
        for (const j of joined) {
          if (j.id === c.id) {
            return
          }
        }

        return c
      })
    } catch (e) {
      return []
    }
  }

  async getOpenGame(): Promise<GameInfo | null> {
    const address = await this.signer.getAddress()
    const numGames = await this.contract.nrOfGames(address)
    const openGames: GameInfo[] = []
    for (let i = 0; i < numGames; i++) {
      const game = await this.contract.myGames(address, i)
      if (game.started && !game.ended) {
        openGames.push({ p1: game.player1, p2: game.player2, id: game.gameID })
      }
    }

    return openGames[0] || null
  }

  async getGameState(gameId: string): Promise<GameState> {
    const board = await this.contract.getBoard(gameId)
    const game = await this.contract.getGame(gameId)

    return { ...board, ended: game.ended }
  }

  async takeMove(gameId: string, col: number) {
    await this.contract.connect(this.signer).takeMove(gameId, col)
  }

  async subscribeToChallenges(handler: Listener) {
    const address = await this.signer.getAddress()
    const filter = this.contract.filters.GameCreation(null, address)
    this.contract.on(filter, handler)
  }

  subscribeToGameStart(handler: Listener) {
    const filter = this.contract.filters.GameJoin()
    this.contract.on(filter, handler)
  }

  subscribeToMoves(gameId: string, handler: Listener) {
    const filter = this.contract.filters.Move(null, gameId)
    this.contract.on(filter, handler)
  }

  subscribeToGameEnd(gameId: string, handler: Listener) {
    const filter = this.contract.filters.GameEnd(null, null, gameId)
    this.contract.on(filter, handler)
  }

  removeSubscriptions() {
    this.contract.removeAllListeners()
  }
}
