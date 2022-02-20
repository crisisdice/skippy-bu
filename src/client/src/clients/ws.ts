import WebSocket from 'ws'
import { WsArgs } from '../types'

export const gameClient = ({ wsURL, firstMessage, update }: WsArgs) => {
  const ws = new WebSocket(wsURL)
  ws.on('open', () => ws.send(firstMessage))
  ws.on('message', async (data: any) => update(ws, data.toString()))
}

