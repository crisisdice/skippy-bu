import { verify } from 'jsonwebtoken'
import { WebSocketServer, WebSocket } from 'ws'
import axios from 'axios'

type Game = Map<string, WebSocket>


type Start = { token: string, key: string }

export type Token = {
  key: string
  iat: number,
  exp: number,
  iss: string
}

export function configureServer() {
  const wss = new WebSocketServer({ port: 3002 })

  const games = new Map()

  wss.on('connection', async (ws) => {
    //ws.on('open', async (data: string) => {
    //})
    ws.on('message', async (data) => {
      const { gameKey, userKey } = await guard(data.toString())
      const newGame = !games.has(gameKey)

      if (newGame) {
        const game = new Map
        console.log('creating')
        game.set(userKey, ws)
        games.set(gameKey, game)
        return
      }

      const game: Game = games.get(gameKey)

      game.forEach((ws1) => {
        const pl = JSON.stringify({ joined: userKey }) 
        console.log('sending %s', pl)
        ws1.send(pl)
      })

      game.set(userKey, ws)
    })
  })
}

async function guard(data: string) {
  const params = JSON.parse(data) as Start
  const key = params.key
  const token = params.token
  const decoded = verify(token, 'secret') as Token

  const { data: user } = await axios.get('http://localhost:3000/users/locate', {
    params: {
      key: decoded.key
    }
  })

  if (!user) throw new Error('User not found')

  return { gameKey: key, userKey: user.key }
}
