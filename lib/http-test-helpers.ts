import http, { IncomingMessage, ServerResponse } from 'http'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import listen from 'test-listen'
import fetch from 'isomorphic-unfetch'

const dummyApiContext = {
  previewModeEncryptionKey: '',
  previewModeId: '',
  previewModeSigningKey: ''
}

interface State {
  response?: Response
}

export const performRequest = (handler: any, params: any): State  => {
  let state: State = { response: undefined }
  let server: http.Server

  beforeAll(async () => {
    let requestHandler = (req: IncomingMessage, res: ServerResponse) => {
      return apiResolver(req, res, params, handler, dummyApiContext)
    }

    server = http.createServer(requestHandler)
    let url = await listen(server)
    state.response = await fetch(url)
  })

  afterAll(async() => {
    return server?.close()
  })

  return state
}
