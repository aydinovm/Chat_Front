// composables/useSignalR.js
import * as signalR from '@microsoft/signalr'

let connection = null

export const useSignalR = () => {
  const config = useRuntimeConfig()
  const hubUrl = `${config.public.apiBase}/hubs/chat`

  const getToken = () => {
    if (process.client) return localStorage.getItem('token')
    return null
  }

  const start = async () => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) return

    connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getToken()
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    try {
      await connection.start()
      console.log('SignalR connected')
    } catch (err) {
      console.error('SignalR connection error:', err)
    }
  }

  const stop = async () => {
    if (connection) {
      await connection.stop()
      connection = null
    }
  }

  const joinChat = async (chatId) => {
    if (connection?.state === signalR.HubConnectionState.Connected) {
      await connection.invoke('JoinChat', chatId)
    }
  }

  const leaveChat = async (chatId) => {
    if (connection?.state === signalR.HubConnectionState.Connected) {
      await connection.invoke('LeaveChat', chatId)
    }
  }

  const on = (event, callback) => {
    connection?.on(event, callback)
  }

  const off = (event, callback) => {
    connection?.off(event, callback)
  }

  return { start, stop, joinChat, leaveChat, on, off }
}